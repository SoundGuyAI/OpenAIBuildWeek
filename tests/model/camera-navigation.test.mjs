import assert from "node:assert/strict";
import test from "node:test";
import { createDesktopCameraNavigation } from "../../src/kaiju-qa/camera-navigation.ts";

class FakeEventTarget {
  listeners = new Map();

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatch(type, event = {}) {
    event.type = type;
    event.target ??= this;
    event.defaultPrevented ??= false;
    event.preventDefault ??= function preventDefault() {
      this.defaultPrevented = true;
    };
    event.immediatePropagationStopped ??= false;
    event.stopImmediatePropagation ??= function stopImmediatePropagation() {
      this.immediatePropagationStopped = true;
    };
    for (const listener of [...(this.listeners.get(type) ?? [])]) {
      if (typeof listener === "function") listener(event);
      else listener.handleEvent(event);
    }
    return event;
  }
}

class FakeElement extends FakeEventTarget {
  clientWidth = 1600;
  clientHeight = 900;
  capturedPointers = new Set();

  setPointerCapture(pointerId) {
    this.capturedPointers.add(pointerId);
  }

  hasPointerCapture(pointerId) {
    return this.capturedPointers.has(pointerId);
  }

  releasePointerCapture(pointerId) {
    this.capturedPointers.delete(pointerId);
  }
}

function createFakeCamera() {
  return {
    aspect: 1,
    fov: 42,
    projectionUpdates: 0,
    matrixUpdates: 0,
    position: {
      x: 0,
      y: 0,
      z: 0,
      set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
      },
    },
    lookTarget: { x: 0, y: 0, z: 0 },
    lookAt(x, y, z) {
      this.lookTarget = { x, y, z };
    },
    updateProjectionMatrix() {
      this.projectionUpdates += 1;
    },
    updateMatrixWorld() {
      this.matrixUpdates += 1;
    },
  };
}

function createKeyboardEvent(code, target = null) {
  return {
    code,
    key: code.startsWith("Key") ? code.slice(3).toLowerCase() : code,
    target,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
  };
}

function point(camera) {
  return [camera.position.x, camera.position.y, camera.position.z];
}

function assertPoint(actual, expected, message) {
  assert.equal(actual.length, expected.length);
  actual.forEach((value, index) => {
    assert.ok(
      Math.abs(value - expected[index]) < 1e-9,
      `${message ?? "point mismatch"}: ${actual} !== ${expected}`,
    );
  });
}

function createHarness(overrides = {}) {
  const camera = createFakeCamera();
  const element = new FakeElement();
  const keyboardTarget = new FakeEventTarget();
  const navigation = createDesktopCameraNavigation({
    camera,
    element,
    keyboardTarget,
    autoUpdate: false,
    moveSpeed: 4,
    homes: [{ position: [0, 2, 5], target: [0, 1, 0] }],
    ...overrides,
  });
  return { camera, element, keyboardTarget, navigation };
}

test("tracks WASD key state until keyup", () => {
  const { camera, element, keyboardTarget, navigation } = createHarness();
  const keyDown = keyboardTarget.dispatch(
    "keydown",
    createKeyboardEvent("KeyW", element),
  );

  navigation.update(0.5);
  assertPoint(point(camera), [0, 2, 3], "W moves forward on the ground plane");
  assert.equal(keyDown.defaultPrevented, true);

  keyboardTarget.dispatch("keyup", createKeyboardEvent("KeyW", element));
  navigation.update(0.5);
  assertPoint(point(camera), [0, 2, 3], "keyup stops movement");

  keyboardTarget.dispatch("keydown", createKeyboardEvent("KeyD", element));
  navigation.update(0.25);
  assertPoint(point(camera), [1, 2, 3], "D strafes right");
  navigation.dispose();
});

test("reset clears input and selects the authored home for the current aspect", () => {
  const homes = [
    { maxAspect: 0.8, position: [1, 3, 8], target: [0, 1, -1] },
    { maxAspect: 1.3, position: [2, 3, 6], target: [0, 1, -1] },
    { position: [3, 2, 4], target: [0, 1, -1] },
  ];
  const { camera, element, keyboardTarget, navigation } = createHarness({ homes });

  assertPoint(point(camera), [3, 2, 4], "wide home is applied on creation");
  keyboardTarget.dispatch("keydown", createKeyboardEvent("KeyD", element));
  navigation.update(0.25);
  assert.notDeepEqual(point(camera), [3, 2, 4]);

  navigation.reset();
  assertPoint(point(camera), [3, 2, 4], "reset restores wide home");
  navigation.update(1);
  assertPoint(point(camera), [3, 2, 4], "reset clears held key state");

  element.clientWidth = 600;
  element.clientHeight = 900;
  navigation.reset();
  assertPoint(point(camera), [1, 3, 8], "narrow home follows current aspect");
  assert.equal(camera.aspect, 2 / 3);
  navigation.dispose();
});

test("orbits only during a right-button pointer drag", () => {
  const { camera, element, navigation } = createHarness();
  const initialPosition = point(camera);
  const leftDown = element.dispatch("pointerdown", {
    button: 0,
    buttons: 1,
    pointerId: 1,
    clientX: 10,
    clientY: 10,
  });
  element.dispatch("pointermove", {
    button: 0,
    buttons: 1,
    pointerId: 1,
    clientX: 80,
    clientY: 40,
  });

  assertPoint(point(camera), initialPosition, "left drag remains available to gameplay");
  assert.equal(leftDown.defaultPrevented, false);
  assert.equal(element.capturedPointers.has(1), false);

  const rightDown = element.dispatch("pointerdown", {
    button: 2,
    buttons: 2,
    pointerId: 2,
    clientX: 10,
    clientY: 10,
  });
  const rightMove = element.dispatch("pointermove", {
    button: 2,
    buttons: 2,
    pointerId: 2,
    clientX: 80,
    clientY: 40,
  });

  assert.notDeepEqual(point(camera), initialPosition);
  assert.equal(rightDown.defaultPrevented, true);
  assert.equal(rightMove.defaultPrevented, true);
  assert.equal(rightDown.immediatePropagationStopped, true);
  assert.equal(rightMove.immediatePropagationStopped, true);
  assert.equal(element.capturedPointers.has(2), true);
  navigation.dispose();
});

test("ignores movement started from input, button, link, or nested editable targets", () => {
  const { camera, element, keyboardTarget, navigation } = createHarness();
  const initialPosition = point(camera);
  const targets = [
    { tagName: "input" },
    { tagName: "BUTTON" },
    { tagName: "a" },
    { tagName: "span", parentElement: { tagName: "button" } },
    { tagName: "div", isContentEditable: true },
  ];

  for (const target of targets) {
    const event = keyboardTarget.dispatch(
      "keydown",
      createKeyboardEvent("KeyW", target),
    );
    navigation.update(0.25);
    assertPoint(point(camera), initialPosition, `ignored ${target.tagName}`);
    assert.equal(event.defaultPrevented, false);
  }

  keyboardTarget.dispatch("keydown", createKeyboardEvent("KeyW", element));
  navigation.update(0.25);
  assert.notDeepEqual(point(camera), initialPosition);
  navigation.dispose();
});

test("setEnabled and dispose clear state and stop handling events", () => {
  const { camera, element, keyboardTarget, navigation } = createHarness();
  navigation.setEnabled(false);
  keyboardTarget.dispatch("keydown", createKeyboardEvent("KeyW", element));
  navigation.update(1);
  assertPoint(point(camera), [0, 2, 5], "disabled controller does not move");

  navigation.setEnabled(true);
  keyboardTarget.dispatch("keydown", createKeyboardEvent("KeyW", element));
  navigation.update(0.25);
  assertPoint(point(camera), [0, 2, 4], "re-enabled controller moves");

  navigation.dispose();
  assert.equal(navigation.enabled, false);
  const disposedPosition = point(camera);
  keyboardTarget.dispatch("keydown", createKeyboardEvent("KeyS", element));
  navigation.update(1);
  assertPoint(point(camera), disposedPosition, "disposed controller remains inert");
});

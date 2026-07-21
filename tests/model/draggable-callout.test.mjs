import assert from "node:assert/strict";
import test from "node:test";
import {
  Group,
  PerspectiveCamera,
  Ray,
  Vector3,
} from "three";
import { createDraggableCallout } from "../../src/kaiju-qa/draggable-callout.ts";

const EPSILON = 1e-6;

function rayAt(worldX, worldY, worldZ = 0) {
  return new Ray(
    new Vector3(worldX, worldY, 10),
    new Vector3(0, 0, worldZ - 10).normalize(),
  );
}

function pointer(pointerId, ray, extra = {}) {
  return {
    pointerId,
    ray,
    ...extra,
    stopped: 0,
    stopPropagation() {
      this.stopped += 1;
    },
  };
}

function near(actual, expected, message) {
  assert.ok(
    Math.abs(actual - expected) <= EPSILON,
    `${message}: expected ${expected}, received ${actual}`,
  );
}

function connectorPoints(connector) {
  const position = connector.geometry.getAttribute("position");
  return [
    [position.getX(0), position.getY(0), position.getZ(0)],
    [position.getX(1), position.getY(1), position.getZ(1)],
  ];
}

function nearPoints(actual, expected) {
  for (let pointIndex = 0; pointIndex < expected.length; pointIndex += 1) {
    for (let axis = 0; axis < expected[pointIndex].length; axis += 1) {
      near(
        actual[pointIndex][axis],
        expected[pointIndex][axis],
        `connector point ${pointIndex}, axis ${axis}`,
      );
    }
  }
}

test("drags on a camera-facing ray plane with local bounds and pointer ownership", () => {
  const space = new Group();
  space.position.x = 10;
  const card = new Group();
  card.name = "evidence-card";
  space.add(card);

  const camera = new PerspectiveCamera();
  camera.position.set(10, 0, 10);
  camera.lookAt(10, 0, 0);
  camera.updateMatrixWorld(true);
  space.updateMatrixWorld(true);

  const captured = [];
  const released = [];
  const controller = createDraggableCallout({
    card,
    camera,
    localSpace: space,
    getRay: (event) => event.ray,
    bounds: {
      min: { x: -1, y: -0.5, z: 0 },
      max: { x: 2, y: 1, z: 0 },
    },
    connector: false,
    capturePointer: (pointerId) => captured.push(pointerId),
    releasePointer: (pointerId) => released.push(pointerId),
  });

  const rightMouseDown = pointer(6, rayAt(10.25, 0.1), {
    pointerType: "screen-mouse",
    button: 2,
  });
  controller.pointerDown(rightMouseDown);
  assert.equal(controller.dragging, false);
  assert.equal(rightMouseDown.stopped, 0);

  const down = pointer(7, rayAt(10.25, 0.1));
  controller.pointerDown(down);
  assert.equal(controller.dragging, true);
  assert.deepEqual(captured, [7]);
  assert.equal(down.stopped, 1);

  controller.pointerMove(pointer(8, rayAt(12, 1)));
  assert.deepEqual(card.position.toArray(), [0, 0, 0]);

  controller.pointerMove(pointer(7, rayAt(11.25, 0.1)));
  near(card.position.x, 1, "drag preserves the original horizontal grab offset");
  near(card.position.y, 0, "drag preserves the original vertical grab offset");

  const move = pointer(7, rayAt(13, 2));
  controller.pointerMove(move);
  near(card.position.x, 2, "x is clamped in local space");
  near(card.position.y, 1, "y is clamped in local space");
  near(card.position.z, 0, "fixed local depth is retained");
  assert.equal(move.stopped, 1);

  const up = pointer(7, rayAt(12, 1));
  controller.pointerUp(up);
  assert.equal(controller.dragging, false);
  assert.deepEqual(released, [7]);
  assert.equal(up.stopped, 1);

  controller.setEnabled(false);
  const disabledDown = pointer(9, rayAt(10, 0));
  controller.pointerDown(disabledDown);
  assert.equal(controller.dragging, false);
  assert.equal(disabledDown.stopped, 0);
  assert.deepEqual(captured, [7]);
});

test("reset animation is deterministic and reduced motion snaps to home", () => {
  const space = new Group();
  const card = new Group();
  const target = new Group();
  card.position.set(1, 0, 0);
  target.position.set(3, 2, 0);
  space.add(card, target);

  const camera = new PerspectiveCamera();
  camera.position.z = 10;
  camera.lookAt(0, 0, 0);
  space.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);

  const controller = createDraggableCallout({
    card,
    camera,
    localSpace: space,
    home: { x: 0, y: 0, z: 0 },
    target,
    getRay: (event) => event.ray,
    resetDuration: 1,
    connector: {
      parent: space,
      cardAnchor: { x: 0.2, y: 0, z: 0 },
      targetAnchor: { x: 0, y: 0.1, z: 0 },
    },
  });

  assert.ok(controller.connector);
  nearPoints(connectorPoints(controller.connector), [
    [1.2, 0, 0],
    [3, 2.1, 0],
  ]);

  card.position.x = 2;
  target.position.set(4, -1, 0.5);
  controller.update();
  nearPoints(connectorPoints(controller.connector), [
    [2.2, 0, 0],
    [4, -0.9, 0.5],
  ]);

  controller.reset();
  controller.update(0.5);
  near(card.position.x, 0.25, "cubic reset reaches a deterministic midpoint");

  controller.setReducedMotion(true);
  near(card.position.x, 0, "enabling reduced motion completes an active reset");

  controller.setHome({ x: -0.5, y: 0.25, z: 0 }, true);
  near(card.position.x, -0.5, "responsive homes can move a resting card");
  near(card.position.y, 0.25, "responsive homes preserve the requested plane");

  card.position.x = 1.5;
  controller.reset();
  near(card.position.x, -0.5, "reduced-motion reset uses the latest home");

  target.visible = false;
  controller.update();
  assert.equal(controller.connector.visible, false);
  target.visible = true;
  controller.setTarget(target);
  assert.equal(controller.connector.visible, true);
  controller.setConnectorVisible(false);
  assert.equal(controller.connector.visible, false);
});

test("cancel resets, dispose releases capture, removes the line, and is idempotent", () => {
  const space = new Group();
  const card = new Group();
  const target = new Group();
  target.position.x = 2;
  space.add(card, target);

  const camera = new PerspectiveCamera();
  camera.position.z = 10;
  camera.lookAt(0, 0, 0);
  space.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);

  const released = [];
  const controller = createDraggableCallout({
    card,
    camera,
    target,
    reducedMotion: true,
    getRay: (event) => event.ray,
    releasePointer: (pointerId) => released.push(pointerId),
  });
  const connector = controller.connector;
  assert.ok(connector);

  controller.pointerDown(pointer(3, rayAt(0, 0)));
  controller.pointerMove(pointer(3, rayAt(1, 0)));
  near(card.position.x, 1, "card follows the active pointer");
  controller.pointerCancel(pointer(3, rayAt(1, 0)));
  near(card.position.x, 0, "cancel returns the card home");
  assert.deepEqual(released, [3]);

  let geometryDisposals = 0;
  let materialDisposals = 0;
  connector.geometry.addEventListener("dispose", () => geometryDisposals += 1);
  connector.material.addEventListener("dispose", () => materialDisposals += 1);

  controller.pointerDown(pointer(4, rayAt(0, 0)));
  controller.dispose();
  controller.dispose();
  assert.deepEqual(released, [3, 4]);
  assert.equal(connector.parent, null);
  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
  assert.equal(controller.connector, null);

  controller.pointerMove(pointer(4, rayAt(2, 0)));
  near(card.position.x, 0, "disposed callbacks are inert");
});

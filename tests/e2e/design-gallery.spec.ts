import { expect, test } from "@playwright/test";

test("design gallery presents, filters, and opens all concept details", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  const response = await page.goto("/designs/", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle("Twenty WebXR game worlds");
  await expect(page.getByRole("heading", { name: "Twenty worlds." })).toBeVisible();
  await expect(page.locator("[data-card]")).toHaveCount(20);
  await expect(page.locator(".asset-link")).toHaveCount(40);

  const loopCard = page.locator("[data-card]").filter({ hasText: "Loop Engineer" });
  await expect(loopCard).toContainText("Ultimate Modular Sci-Fi Pack");
  await loopCard.getByRole("button").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Free asset starter kit");
  await expect(dialog).toContainText("SDLC");
  await expect(dialog.getByRole("link")).toHaveCount(2);
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(loopCard.getByRole("button")).toBeFocused();

  await page.getByLabel("Search title, fantasy, pack, or verb").fill("train");
  await expect(page.locator("[data-card]:visible")).toHaveCount(1);
  await expect(page.getByRole("status")).toContainText("1 concept shown");
  await expect(page.locator("[data-card]:visible")).toContainText("Ghostline Dispatcher");
  await page.getByRole("button", { name: "Clear" }).click();

  await page.getByLabel("Selection").selectOption("true");
  await expect(page.locator("[data-card]:visible")).toHaveCount(5);
  await page.getByRole("button", { name: "Clear" }).click();

  const firstTab = page.getByRole("tab").first();
  await firstTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(horizontalOverflow).toBe(false);
  expect(errors).toEqual([]);

  await page.screenshot({
    path: testInfo.outputPath(`design-gallery-${testInfo.project.name}.png`),
    fullPage: true,
  });
});

import { expect, test } from "@playwright/test";

test.describe("catalog navigation", () => {
  test("PLP to PDP and sticky CTA presence", async ({ page }) => {
    await page.goto("/collections/men");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.locator("article[role='button']").first().click();
    await expect(page).toHaveURL(/\/product\//);
    await expect(page.getByRole("button", { name: /add to cart/i }).first()).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

test.describe("search behavior", () => {
  test("query, filter, and sort interactions", async ({ page }) => {
    await page.goto("/search?q=shirt");
    await expect(page.getByRole("heading", { name: /^search$/i })).toBeVisible();
    await expect(page.getByText(/classic oxford shirt/i)).toBeVisible();

    await page.getByLabel(/in stock only/i).check();
    await page.getByPlaceholder("Min").fill("50");
    await page.getByPlaceholder("Max").fill("100");
    await page.getByRole("button", { name: /price/i }).click();

    await expect(page.getByText(/classic oxford shirt/i)).toBeVisible();
  });
});

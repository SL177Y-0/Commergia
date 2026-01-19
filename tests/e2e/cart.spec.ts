import { expect, test } from "@playwright/test";

test.describe("cart lifecycle", () => {
  test("add -> update quantity -> remove", async ({ page }) => {
    await page.goto("/product/classic-oxford-shirt");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.getByRole("main").getByRole("button", { name: /^add to cart$/i }).first().click();
    await page.getByRole("button", { name: /open cart drawer/i }).click();
    const drawer = page.getByRole("dialog", { name: /shopping cart/i });
    await expect(drawer.getByRole("heading", { name: /your cart/i })).toBeVisible();

    await drawer.getByRole("button", { name: "+" }).first().click();
    await drawer.getByRole("button", { name: /view cart/i }).click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByRole("heading", { name: /^cart$/i })).toBeVisible();

    await page.getByRole("button", { name: /remove/i }).first().click();
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });
});

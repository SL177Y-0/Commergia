import { expect, test } from "@playwright/test";

test.describe("account area", () => {
  test("updates profile and expands order details", async ({ page }) => {
    const encoded = Buffer.from("demo@commergia.dev").toString("base64").replace(/=+$/g, "");
    const token = `mock_token_${encoded}_${Date.now()}`;
    await page.context().addCookies([
      {
        name: "customerAccessToken",
        value: token,
        url: "http://127.0.0.1:3000",
      },
    ]);

    await page.goto("/account");
    await expect(page.getByRole("heading", { name: /account dashboard/i })).toBeVisible();

    await page.getByRole("button", { name: /^edit$/i }).click();
    await page.getByPlaceholder("First name").fill("Updated");
    await page.getByPlaceholder("Last name").fill("Shopper");
    await page.getByPlaceholder("Phone").fill("+1 646 555 0134");
    await page.getByRole("button", { name: /^save$/i }).click();

    await page.goto("/account/orders");
    await expect(page.getByRole("heading", { name: /order history/i })).toBeVisible();
    await expect(page.getByText(/#CG-/).first()).toBeVisible();
    await page.getByRole("button", { name: /view/i }).first().click();
    await expect(page.getByRole("link", { name: /track shipment/i })).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

test.describe("checkout full flow", () => {
  test("information -> shipping -> payment -> confirmation", async ({ page }) => {
    await page.goto("/product/classic-oxford-shirt");
    await page.getByRole("main").getByRole("button", { name: /^add to cart$/i }).first().click();

    await page.request.post("/api/checkout/session", {
      data: {
        information: {
          email: "buyer@commergia.dev",
          firstName: "Flow",
          lastName: "Tester",
          address: "210 Commerce Ave",
          city: "New York",
          state: "NY",
          zip: "10001",
          phone: "+12125550123",
        },
        currency: "USD",
      },
    });

    await page.goto("/checkout/shipping");

    const shippingSection = page.locator("section").filter({
      has: page.getByRole("heading", { name: /checkout - shipping/i }),
    });
    await expect(shippingSection.getByRole("radio").first()).toBeVisible();
    await shippingSection.getByRole("radio").first().check();
    await Promise.all([
      page.waitForURL(/\/checkout\/payment/, { timeout: 30_000 }),
      shippingSection.getByRole("button", { name: /continue to payment/i }).click(),
    ]);

    const paymentSection = page.locator("section").filter({
      has: page.getByRole("heading", { name: /checkout - payment/i }),
    });
    await Promise.all([
      page.waitForURL(/\/checkout\/confirmation/, { timeout: 30_000 }),
      paymentSection.getByRole("button", { name: /pay now/i }).click(),
    ]);

    await expect(page.getByRole("heading", { name: /thank you for your purchase/i })).toBeVisible();
  });
});

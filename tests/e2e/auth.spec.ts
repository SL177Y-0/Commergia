import { expect, test } from "@playwright/test";

test.describe("auth end-to-end flow", () => {
  test("register -> login -> account -> logout", async ({ page }) => {
    const uniqueEmail = `e2e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@commergia.dev`;
    const password = "Password123";
    const main = page.getByRole("main");

    await page.goto("/auth");
    await expect(main.getByRole("heading", { name: /welcome to commergia/i })).toBeVisible();

    await main.getByRole("button", { name: /don't have an account/i }).click();
    const signupForm = main.locator("form");
    await signupForm.getByLabel("First Name", { exact: true }).fill("E2E");
    await signupForm.getByLabel("Last Name", { exact: true }).fill("Tester");
    await signupForm.getByLabel("Email", { exact: true }).fill(uniqueEmail);
    await signupForm.getByLabel("Password", { exact: true }).fill(password);
    await signupForm.getByLabel("Confirm Password", { exact: true }).fill(password);
    await signupForm.getByRole("button", { name: /sign up/i }).click();
    await expect(page.getByText(/account created successfully/i)).toBeVisible();

    await main.getByRole("button", { name: /already have an account/i }).click();
    const loginForm = main.locator("form");
    await loginForm.getByLabel("Email", { exact: true }).fill(uniqueEmail);
    await loginForm.getByLabel("Password", { exact: true }).fill(password);
    await loginForm.getByRole("button", { name: /^login$/i }).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 20_000 });
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: /account dashboard/i })).toBeVisible();

    await page.getByRole("banner").getByRole("button", { name: /logout/i }).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 20_000 });

    await page.goto("/account");
    if (/\/auth/.test(page.url())) {
      await expect(page).toHaveURL(/\/auth/, { timeout: 20_000 });
    } else {
      await expect(page.getByRole("heading", { name: /sign in required/i })).toBeVisible();
    }
  });
});

import { api } from "@convex/_generated/api";
import type { Page } from "@playwright/test";
import { convexTest } from "convex-test";
import schema from "../../convex/schema";
import { modules } from "../../convex/test.setup";
import { test } from "./fixtures";

test("displays error message for invalid fields", async ({ expect, page }) => {
  const { email, submit } = await goToRegisterTab(page);

  await email.click();
  await email.fill("hi");
  await submit.click();

  const errors = page.locator("[slot='errorMessage']");
  await expect(errors).toHaveCount(2);
  await expect(errors.nth(0)).toContainText("'hi' is missing an '@'.");
  await expect(errors.nth(1)).toHaveText("Please fill out this field.");
});

test.skip("displays success message on valid registration", async ({
  expect,
  page,
}) => {
  const removeUser = await createUser(page, {
    email: "test.user@example.com",
    password: "hax0r3000",
  });

  const result = page.locator("");
  expect(result).toBe("TODO");

  await removeUser();
});

test.skip("displays error message if email already exists", async ({
  expect,
  page,
}) => {
  const USER = {
    email: "test.user.exists@example.com",
    password: "hax0r3000",
  };

  const removeUser = await createUser(page, USER);
  await createUser(page, USER);

  const result = page.locator("");
  expect(result).toBe("TODO");

  await removeUser();
});

//

async function goToRegisterTab(page: Page) {
  await page.goto("/signin");
  await page.getByRole("tab", { name: "Register" }).click();

  return {
    email: await page.getByRole("textbox", { name: "Email" }),
    password: await page.getByRole("textbox", { name: "Password" }),
    submit: await page.getByRole("button", { name: "Register" }),
  };
}

async function createUser(
  page: Page,
  user: { email: string; password: string },
) {
  const { email, password, submit } = await goToRegisterTab(page);

  await email.click();
  await email.fill(user.email);

  await password.click();
  await password.fill(user.password);

  await submit.click();

  return async function removeUser() {
    const t = convexTest(schema, modules);

    const testUser = await t.query(api.users.getByEmail, {
      email: user.email,
    });

    if (testUser) {
      const asUser = t.withIdentity({ subject: testUser._id });
      await asUser.mutation(api.users.deleteCurrentUser, {});
    }
  };
}

import { expect, test } from "@playwright/test";

test("conteúdo e conversão continuam disponíveis sem JavaScript", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Aprenda inglês de forma prática",
  );
  await expect(page.locator("main")).toContainText("Como funcionam as aulas");
  await expect(page.locator("main")).toContainText("Perguntas frequentes");
  await expect(page.locator('a[href="https://wa.me/5511942685665"]')).not.toHaveCount(0);

  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();

  const firstFaq = page.locator("details").first();
  await expect(firstFaq).toHaveAttribute("open", "");
  await expect(firstFaq).toContainText("As aulas da English For All são 100% online");
});

import { expect, test } from "@playwright/test";

test("redireciona /admin para o login quando não há sessão", async ({
  page,
}) => {
  const response = await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login$/);
  expect(response?.headers()["cache-control"]).toContain("private");
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await expect(
    page.getByRole("heading", { name: "Bem-vinda de volta" }),
  ).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Senha", { exact: true })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("preserva o destino protegido no parâmetro next", async ({ page }) => {
  await page.goto("/admin/alunos?status=active");

  await expect(page).toHaveURL(
    /\/admin\/login\?next=%2Fadmin%2Falunos%3Fstatus%3Dactive$/,
  );
  await expect(page.locator('input[name="next"]')).toHaveValue(
    "/admin/alunos?status=active",
  );
});

test("valida o formulário de login sem expor detalhes de autenticação", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Revise os campos destacados.")).toBeVisible();
  await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();
  await expect(page.getByText("Informe sua senha.")).toBeVisible();
});

test("permite mostrar e ocultar a senha", async ({ page }) => {
  await page.goto("/admin/login");
  const password = page.getByLabel("Senha", { exact: true });
  await password.fill("senha-temporaria");
  await page.getByRole("button", { name: "Mostrar senha" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Ocultar senha" }).click();
  await expect(password).toHaveAttribute("type", "password");
});

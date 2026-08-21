import { expect, test } from "@playwright/test";

const whatsappUrl = "https://wa.me/5511942685665";
const expectedDescription =
  "Aulas de inglês online para crianças, adolescentes, jovens e adultos em todo o Brasil, com foco em comunicação, prática e acompanhamento próximo.";
const isIndexable = process.env.E2E_EXPECT_INDEXABLE === "1";

test("expõe semântica e metadata completas", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(
    "English For All | Aulas de Inglês Online para Todas as Idades",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    expectedDescription,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/brand\/open-graph-social-share\.png$/,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/site.webmanifest",
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png",
  );
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h2")).toHaveCount(8);
  await expect(page.locator('[data-slot="faq-item"]')).toHaveCount(9);

  const robots = page.locator('meta[name="robots"]');
  const canonical = page.locator('link[rel="canonical"]');
  const jsonLd = page.locator('script[type="application/ld+json"]');

  if (isIndexable) {
    await expect(robots).toHaveAttribute("content", /index, follow/);
    await expect(canonical).toHaveAttribute(
      "href",
      "https://english-for-all.example",
    );
    await expect(jsonLd).toHaveCount(1);

    const graph = JSON.parse((await jsonLd.textContent()) ?? "{}") as {
      "@graph"?: Array<{ "@type"?: string }>;
    };
    expect(graph["@graph"]?.map((entry) => entry["@type"])).toEqual(
      expect.arrayContaining([
        "EducationalOrganization",
        "WebSite",
        "WebPage",
        "FAQPage",
      ]),
    );
  } else {
    await expect(robots).toHaveAttribute("content", /noindex/);
    await expect(canonical).toHaveCount(0);
    await expect(jsonLd).toHaveCount(0);
  }
});

test("mantém âncoras e destinos externos corretos", async ({ page }) => {
  await page.goto("/");

  for (const href of ["#sobre", "#metodologia", "#publicos", "#diferenciais", "#depoimentos"]) {
    await expect(page.locator(`header a[href="${href}"]`)).toHaveCount(1);
  }

  const whatsappLinks = page.locator(`a[href="${whatsappUrl}"]`);
  expect(await whatsappLinks.count()).toBeGreaterThanOrEqual(5);
  await expect(
    page.locator('a[href="https://www.instagram.com/eforall.school"]'),
  ).toHaveCount(1);
});

test("menu mobile abre e fecha depois da navegação", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("link", { name: "Metodologia" }).click();

  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/#metodologia$/);
});

test("FAQ nativo responde ao teclado", async ({ page }) => {
  await page.goto("/#faq");
  const item = page
    .locator("details")
    .filter({ hasText: "A English For All atende alunos de todo o Brasil?" });
  const trigger = item.locator("summary");

  await expect(item).not.toHaveAttribute("open", "");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(item).toHaveAttribute("open", "");
  await expect(page.getByText(/diferentes cidades e estados do Brasil/)).toBeVisible();
});

test("carrossel avança pelos controles", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#depoimentos");
  const rail = page.locator(".testimonial-rail");
  const initialScroll = await rail.evaluate((element) => element.scrollLeft);

  await page.getByRole("button", { name: "Próximos depoimentos" }).click();
  await expect
    .poll(() => rail.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(initialScroll);
});

test("publica headers de segurança e cache", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(response.ok()).toBeTruthy();
  expect(headers["x-powered-by"]).toBeUndefined();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-robots-tag"]).toBe(
    isIndexable ? undefined : "noindex, nofollow, noarchive",
  );
});

test("serve robots, sitemap, manifest e assets de marca", async ({ request }) => {
  const [robots, sitemap, manifest, favicon, openGraph] = await Promise.all([
    request.get("/robots.txt"),
    request.get("/sitemap.xml"),
    request.get("/site.webmanifest"),
    request.get("/favicon.ico"),
    request.get("/brand/open-graph-social-share.png"),
  ]);

  for (const response of [robots, sitemap, manifest, favicon, openGraph]) {
    expect(response.ok()).toBeTruthy();
  }

  const robotsText = await robots.text();
  const sitemapText = await sitemap.text();
  const manifestData = (await manifest.json()) as { name?: string; icons?: unknown[] };

  expect(robotsText).toContain(isIndexable ? "Allow: /" : "Disallow: /");
  expect(sitemapText.includes("https://english-for-all.example/")).toBe(isIndexable);
  expect(manifestData.name).toBe("English For All");
  expect(manifestData.icons).toHaveLength(2);
  expect(openGraph.headers()["content-type"]).toContain("image/png");
});

test("carrega todo o documento até o rodapé sem imagens quebradas", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");

  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
  await expect(footer).toContainText("Todos os direitos reservados");

  const brokenImages = await page.locator("img").evaluateAll((images) =>
    (images as HTMLImageElement[])
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.getAttribute("src")),
  );
  expect(brokenImages).toEqual([]);
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`não cria overflow horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto("/");

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));

    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  });
}

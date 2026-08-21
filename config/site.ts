function resolveSiteUrl() {
  const candidate = process.env.SITE_URL?.trim();

  if (!candidate) {
    return undefined;
  }

  let url: URL;

  try {
    url = new URL(candidate);
  } catch (error) {
    throw new Error("SITE_URL must be a valid absolute URL.", { cause: error });
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL must be an HTTPS origin without credentials, path, query, or hash.",
    );
  }

  return url;
}

export const siteConfig = {
  name: "English For All",
  description:
    "Aulas de inglês online para crianças, adolescentes, jovens e adultos em todo o Brasil, com foco em comunicação, prática e acompanhamento próximo.",
  locale: "pt-BR",
  country: "Brasil",
  whatsappNumber: "5511942685665",
  whatsappTelephone: "+55 11 94268-5665",
  whatsappUrl: "https://wa.me/5511942685665",
  instagramUrl: "https://www.instagram.com/eforall.school",
  instagramHandle: "@eforall.school",
  siteUrl: resolveSiteUrl(),
} as const;

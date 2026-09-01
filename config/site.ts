const siteUrl = new URL("https://eforallschool.com.br");

const isIndexable =
  process.env.VERCEL_ENV === "production" ||
  process.env.E2E_EXPECT_INDEXABLE === "1";

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
  siteUrl,
  isIndexable,
} as const;

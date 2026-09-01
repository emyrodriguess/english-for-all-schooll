import { AboutSection } from "@/components/landing/about-section";
import { AudienceSection } from "@/components/landing/audience-section";
import { DifferentialsSection } from "@/components/landing/differentials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { FloatingWhatsApp } from "@/components/landing/floating-whatsapp";
import { FounderSection } from "@/components/landing/founder-section";
import { HeroSection } from "@/components/landing/hero-section";
import { MethodologySection } from "@/components/landing/methodology-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { siteConfig } from "@/config/site";
import { faqItems } from "@/content/landing";

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function StructuredData() {
  if (!siteConfig.isIndexable) return null;

  const organizationId = new URL("/#organization", siteConfig.siteUrl).toString();
  const websiteId = new URL("/#website", siteConfig.siteUrl).toString();
  const webpageId = new URL("/#webpage", siteConfig.siteUrl).toString();
  const faqId = new URL("/#faq", siteConfig.siteUrl).toString();

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": organizationId,
        "@type": "EducationalOrganization",
        name: siteConfig.name,
        url: siteConfig.siteUrl.toString(),
        description: siteConfig.description,
        logo: {
          "@type": "ImageObject",
          url: new URL("/web-app-manifest-512x512.png", siteConfig.siteUrl).toString(),
          width: 512,
          height: 512,
        },
        sameAs: [siteConfig.instagramUrl],
        areaServed: { "@type": "Country", name: siteConfig.country },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: siteConfig.whatsappTelephone,
          contactType: "customer service",
          availableLanguage: ["Portuguese", "English"],
        },
      },
      {
        "@id": websiteId,
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.siteUrl.toString(),
        inLanguage: siteConfig.locale,
        publisher: { "@id": organizationId },
      },
      {
        "@id": webpageId,
        "@type": "WebPage",
        name: "Aulas de Inglês Online para Todas as Idades",
        url: siteConfig.siteUrl.toString(),
        description: siteConfig.description,
        inLanguage: siteConfig.locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
      },
      {
        "@id": faqId,
        "@type": "FAQPage",
        url: new URL("/#faq", siteConfig.siteUrl).toString(),
        inLanguage: siteConfig.locale,
        isPartOf: { "@id": webpageId },
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <MethodologySection />
        <AudienceSection />
        <DifferentialsSection />
        <FounderSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  );
}

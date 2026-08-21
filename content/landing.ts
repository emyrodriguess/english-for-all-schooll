export interface NavigationItem {
  readonly label: string;
  readonly href: `#${string}`;
}

export interface AudienceItem {
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly alt: string;
}

export interface TestimonialItem {
  readonly image: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export const navigation = [
  { label: "Sobre", href: "#sobre" },
  { label: "Metodologia", href: "#metodologia" },
  { label: "Para quem é", href: "#publicos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Depoimentos", href: "#depoimentos" },
] as const satisfies readonly NavigationItem[];

export const methodologyPillars = [
  "Comunicação",
  "Participação ativa",
  "Situações reais",
] as const;

export const languageSkills = ["Fala", "Compreensão", "Leitura", "Escrita"] as const;

export const audience = [
  {
    title: "Crianças",
    description:
      "Aprendizado de inglês durante a infância com acompanhamento adequado à fase de aprendizagem.",
    image: "/images/audience/children-learning.webp",
    alt: "Criança estudando com caderno e materiais escolares.",
  },
  {
    title: "Adolescentes",
    description:
      "Desenvolvimento do idioma, comunicação e confiança durante uma fase importante de formação.",
    image: "/images/audience/teenager-library-learning.webp",
    alt: "Adolescente estudando online com notebook e caderno.",
  },
  {
    title: "Jovens",
    description:
      "Inglês para estudos, carreira, viagens, comunicação e novas oportunidades.",
    image: "/images/audience/young-student-online.webp",
    alt: "Jovem estudando com notebook em uma biblioteca.",
  },
  {
    title: "Adultos",
    description:
      "Inglês para diferentes objetivos pessoais e profissionais, sem limite de idade.",
    image: "/images/audience/adult-online-study.webp",
    alt: "Adulta estudando online em uma mesa de trabalho.",
  },
] as const satisfies readonly AudienceItem[];

export const differentials = [
  "Ensino voltado à comunicação",
  "Aplicação na vida real",
  "Acompanhamento próximo",
  "Respeito ao ritmo do aluno",
  "Ambiente acolhedor",
  "Desenvolvimento de confiança",
  "Ensino 100% online",
  "Equipe preparada",
] as const;

export const testimonials = [
  {
    image: "/images/testimonials/testimonial-01.webp",
    alt: "Screenshot de depoimento real de uma aluna sobre comunicação e satisfação com as aulas.",
    width: 1179,
    height: 432,
  },
  {
    image: "/images/testimonials/testimonial-02.webp",
    alt: "Screenshot de depoimento real de uma aluna sobre seu desenvolvimento nas aulas.",
    width: 1179,
    height: 434,
  },
  {
    image: "/images/testimonials/testimonial-03.webp",
    alt: "Screenshot de depoimento real sobre a importância e a experiência de aprender inglês.",
    width: 1179,
    height: 599,
  },
  {
    image: "/images/testimonials/testimonial-04.webp",
    alt: "Screenshot de depoimento real sobre confiança, acolhimento e realização de um sonho.",
    width: 1179,
    height: 534,
  },
  {
    image: "/images/testimonials/testimonial-05.webp",
    alt: "Screenshot de depoimento real sobre aulas alinhadas às necessidades da aluna.",
    width: 1179,
    height: 560,
  },
  {
    image: "/images/testimonials/testimonial-06.webp",
    alt: "Screenshot de depoimento real sobre o vínculo positivo com o inglês e as aulas.",
    width: 1179,
    height: 361,
  },
] as const satisfies readonly TestimonialItem[];

export const faqItems = [
  {
    question: "As aulas de inglês da English For All são online?",
    answer:
      "Sim. As aulas da English For All são 100% online, permitindo que alunos de diferentes regiões do Brasil estudem inglês de onde estiverem.",
  },
  {
    question: "A English For All atende alunos de todo o Brasil?",
    answer:
      "Sim. Como as aulas são realizadas online, a English For All pode atender alunos de diferentes cidades e estados do Brasil.",
  },
  {
    question: "A English For All oferece inglês para crianças?",
    answer:
      "Sim. A English For All atende crianças e conta com uma equipe preparada para acompanhar diferentes fases da aprendizagem.",
  },
  {
    question: "A English For All oferece inglês para adolescentes?",
    answer:
      "Sim. Adolescentes fazem parte do público atendido pela escola, com aprendizagem voltada ao desenvolvimento do idioma, comunicação e confiança.",
  },
  {
    question: "Jovens podem estudar na English For All?",
    answer:
      "Sim. A escola atende jovens com diferentes objetivos, incluindo estudos, carreira, viagens, comunicação e desenvolvimento pessoal.",
  },
  {
    question: "Adultos também podem estudar inglês na English For All?",
    answer:
      "Sim. A English For All atende adultos com diferentes objetivos pessoais e profissionais.",
  },
  {
    question: "Como funciona a metodologia da English For All?",
    answer:
      "A metodologia prioriza comunicação, participação ativa e situações reais do dia a dia. O aprendizado busca desenvolver fala, compreensão, leitura e escrita, respeitando o ritmo e os objetivos de cada aluno.",
  },
  {
    question: "As aulas trabalham conversação em inglês?",
    answer:
      "Sim. A comunicação é um dos pilares da metodologia da English For All, buscando desenvolver maior confiança para utilizar o idioma em situações reais.",
  },
  {
    question: "Como posso saber mais sobre as aulas?",
    answer:
      "Entre em contato com a equipe da English For All pelo WhatsApp para conversar e receber mais informações.",
  },
] as const satisfies readonly FaqItem[];

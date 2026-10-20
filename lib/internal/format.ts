const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const weekdays = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
] as const;

export function formatMoney(value: number | string | null | undefined) {
  return moneyFormatter.format(Number(value ?? 0));
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return dateFormatter.format(new Date(`${value.slice(0, 10)}T12:00:00.000Z`));
}

export function formatLongDate(value = new Date()) {
  const formatted = longDateFormatter.format(value);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatTime(value: string | null | undefined) {
  return value ? value.slice(0, 5) : "—";
}

export function formatWeekday(value: number | null | undefined) {
  return value && value >= 1 && value <= weekdays.length
    ? weekdays[value - 1]
    : "Dia não informado";
}

export function formatPhone(value: string | null | undefined) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("55")) digits = digits.slice(2);
  digits = digits.slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);
  if (number.length <= 4) return `(${areaCode}) ${number}`;
  const firstPartLength = number.length > 8 ? 5 : 4;
  return `(${areaCode}) ${number.slice(0, firstPartLength)}-${number.slice(firstPartLength)}`;
}

export function monthBounds(month?: string) {
  const valid = /^\d{4}-\d{2}$/.test(month ?? "")
    ? month!
    : saoPauloToday().slice(0, 7);
  const [year, monthNumber] = valid.split("-").map(Number);
  const start = `${valid}-01`;
  const next = new Date(Date.UTC(year, monthNumber, 1))
    .toISOString()
    .slice(0, 10);
  return { month: valid, start, next, year };
}

export function saoPauloToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

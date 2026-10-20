"use client";

import { useEffect } from "react";

const unsupportedInputTypes = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

function inputHint(input: HTMLInputElement) {
  if (input.placeholder || unsupportedInputTypes.has(input.type)) return;

  const key = `${input.name} ${input.id}`.toLowerCase();
  if (input.type === "email" || key.includes("email")) {
    input.placeholder = "exemplo@gmail.com";
  } else if (input.type === "password") {
    input.placeholder = "Digite sua senha";
  } else if (input.type === "tel" || key.includes("whatsapp")) {
    input.placeholder = "(11) 99999-9999";
  } else if (key.includes("amount") || key.includes("valor")) {
    input.placeholder = "0,00";
  } else if (input.type === "number") {
    input.placeholder = "0";
  } else if (key.includes("name") || key.includes("nome")) {
    input.placeholder = "Digite seu nome";
  } else if (input.type === "date") {
    input.placeholder = "Selecione uma data";
  } else if (input.type === "time") {
    input.placeholder = "Selecione um horário";
  } else {
    input.placeholder = "Digite aqui";
  }
}

function applyInputHints(root: ParentNode) {
  if (root instanceof HTMLInputElement) inputHint(root);
  if (root instanceof HTMLTextAreaElement && !root.placeholder) {
    root.placeholder = "Digite aqui";
  }
  root.querySelectorAll<HTMLInputElement>("input").forEach(inputHint);
  root.querySelectorAll<HTMLTextAreaElement>("textarea").forEach((textarea) => {
    if (!textarea.placeholder) textarea.placeholder = "Digite aqui";
  });
}

export function AdminInputHints() {
  useEffect(() => {
    applyInputHints(document);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) applyInputHints(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

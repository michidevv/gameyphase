import en from "../../assets/i18n/en.json";

export type TextKeys = keyof typeof en;

export function getTranslation(key: TextKeys): string {
  return en[key];
}

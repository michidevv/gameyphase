import en from "../../assets/i18n/en.json";

export type TextKeys = keyof typeof en;

export function getTranslation(
  key: TextKeys,
  values: Record<string, string> = {}
): string {
  let str = en[key];
  Object.entries(values).forEach(([k, v]) => {
    str = str.replace(`{${k}}`, v);
  });
  return str;
}

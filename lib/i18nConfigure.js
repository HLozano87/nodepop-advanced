import { I18n } from "i18n";
import path from "node:path";

const i18n = new I18n({
  locales: ["en", "es"],
  directory: path.join(process.cwd(), "lang"),
  defaultLocale: "en",
  cookie: "nodepop-lang",
  autoReload: true,
  syncFiles: true,
});

export default i18n;

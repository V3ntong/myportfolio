import type { IconType } from "react-icons";
import { FaBolt, FaCode, FaDatabase, FaFire, FaTerminal } from "react-icons/fa6";
import {
  SiAndroidstudio,
  SiCplusplus,
  SiCss,
  SiDjango,
  SiFastapi,
  SiFirebase,
  SiFlask,
  SiFlutter,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMysql,
  SiNextdotjs,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSqlite,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

import type { TechIconName } from "@/src/data/portfolio";

type TechIconProps = {
  name: TechIconName;
  className?: string;
};

const ICONS: Record<TechIconName, IconType> = {
  html: SiHtml5,
  css: SiCss,
  javascript: SiJavascript,
  python: SiPython,
  java: SiOpenjdk,
  cpp: SiCplusplus,
  php: SiPhp,
  react: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  fastapi: SiFastapi,
  flask: SiFlask,
  django: SiDjango,
  laravel: SiLaravel,
  sqlserver: FaDatabase,
  sqlite: SiSqlite,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  firestore: FaFire,
  flutter: SiFlutter,
  firebase: SiFirebase,
  supabase: SiSupabase,
  git: SiGit,
  github: SiGithub,
  vscode: FaCode,
  antigravity: FaCode,
  androidstudio: SiAndroidstudio,
  orca: FaTerminal,
  kiro: FaBolt,
};

export function TechIcon({ name, className = "size-4" }: TechIconProps) {
  const Icon = ICONS[name];

  return <Icon aria-hidden="true" className={className} />;
}

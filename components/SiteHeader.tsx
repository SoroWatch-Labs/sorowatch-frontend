import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          SoroWatch
        </Link>
        <span className="site-header__tagline">
          AI-agent risk monitoring for Soroban
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}

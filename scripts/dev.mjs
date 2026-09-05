import { spawnSync } from "node:child_process";

/**
 * `pnpm dev` weigert, en dat is geen storing.
 *
 * Previews gaan via de Vercel-preview van de pull request: dat is de enige omgeving
 * die de klant kan openen, en het is wat er ook echt live gaat. Een dev-server op
 * localhost bewijst niets over de gebouwde versie en kan niemand anders zien.
 *
 * Dit staat hier, op scriptniveau, en niet alleen in de hook van Claude Code: zo geldt
 * de afspraak ook voor een andere agent en voor een mens, zonder dat iemand iets hoeft
 * te installeren. De hook maakt hem alleen eerder merkbaar.
 *
 * Wil je de app toch op je eigen computer bekijken, bijvoorbeeld zonder internet?
 * README.md legt onder "Zelf op je computer draaien" uit hoe.
 */
if (process.env.STACK_ALLOW_DEV !== "1") {
  console.error(
    [
      "",
      "✗ Geen dev-server om werk te laten zien.",
      "",
      "  Previews gaan via de Vercel-preview van je pull request: dat is de enige",
      "  omgeving die de klant kan openen en die is wat er ook echt live gaat.",
      "  Zie docs/WERKWIJZE.md, hoofdstuk 5, en de route docs/routes/verder-werken.md.",
      "",
      "  Wil je iets controleren zonder browser? Draai `pnpm test` of `pnpm test:e2e`.",
      "  Wil je de app op je eigen computer bekijken? Zie README.md, onderaan.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

const uit = spawnSync("pnpm", ["exec", "vite", ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(uit.status ?? 1);

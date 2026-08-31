import { Sparkles, Mail, Rss, Globe2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

const columns = [
  {
    title: "Platform",
    links: ["Model Studio", "Inference API", "Agents", "Fine-tuning"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Changelog", "Status", "Security"],
  },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-4">
          <a href="#top" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              Techno<span className="text-primary-300">AI</span>
            </span>
          </a>
          <p className="max-w-xs text-sm text-foreground/60">
            Building the foundation models and agent infrastructure that
            power the next generation of intelligent products.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {[Mail, Rss, Globe2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-primary/40 hover:text-primary-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">
              {column.title}
            </h4>
            {column.links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-foreground/60 transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </Container>

      <Container className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-xs text-foreground/40 sm:flex-row">
        <p>© {new Date().getFullYear()} TechnoAI, Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground/70">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground/70">
            Terms
          </a>
        </div>
      </Container>
    </footer>
  );
}

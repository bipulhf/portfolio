import { pageContainerClass } from "./lib/styles";

export function Footer() {
  return (
    <footer
      className={`${pageContainerClass} theme-only-crayon pb-12 pt-8 text-center font-hand text-base text-ink-soft`}
    >
      Made with a box of crayons and careful thinking ❤️{" "}
      {new Date().getFullYear()} Bipul Hf
    </footer>
  );
}

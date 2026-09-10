type WorldHeadingProps = Readonly<{
  lines: readonly string[];
  opening?: boolean;
}>;

/** Line masks let the typography arrive with the camera without splitting words. */
export function WorldHeading({ lines, opening = false }: WorldHeadingProps) {
  const Heading = opening ? "h1" : "h2";
  return (
    <Heading
      id={opening ? "studio-title" : undefined}
      className="studio-world-heading"
    >
      {lines.map((line, index) => (
        <span className="studio-heading-line" key={line}>
          <span className="studio-heading-ink">
            {index === lines.length - 1 ? <em>{line}</em> : line}
            {index < lines.length - 1 ? " " : null}
          </span>
        </span>
      ))}
    </Heading>
  );
}

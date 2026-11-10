import { cn } from "@/utils/cn";

/**
 * Eyebrow + heading + intro, animated in. One h1 per page — sections use the default h2.
 *   <SectionHeading eyebrow="Services" title="What we do" text="…" />
 */
export default function SectionHeading({ eyebrow, title, text, as: Heading = "h2", align = "left", className }) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <p className="text-eyebrow text-muted" data-reveal="fade">
          {eyebrow}
        </p>
      )}
      <Heading className="max-w-4xl" data-heading-effect>
        {title}
      </Heading>
      {text && (
        <p className="max-w-2xl text-body-lg text-muted" data-para-effect>
          {text}
        </p>
      )}
    </div>
  );
}

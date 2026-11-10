import { Link } from "next-view-transitions";
import { cn } from "@/utils/cn";
import { isExternal } from "@/utils/url";

const VARIANTS = {
  solid: "bg-ink text-paper hover:bg-ink/80",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
};

/**
 * <Button href="/contact">Get in touch</Button>       internal link (page transition)
 * <Button href="mailto:hi@brand.com">Email us</Button>  external / mailto / tel → <a>
 * <Button type="submit">Send</Button>                  no href → <button>
 */
export default function Button({ href, variant = "solid", className, children, ...props }) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 text-cta whitespace-nowrap transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    className,
  );

  if (!href) {
    return (
      <button type="button" className={classes} {...props}>
        {children}
      </button>
    );
  }

  if (isExternal(href)) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

/** A dashed "fill me in" note, shown in development only, where a site.js value is still empty */
export default function DevHint({ children }) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <span className="inline-block border border-dashed border-muted px-2 py-1 text-caption text-muted">
      Add {children} in src/config/site.js
    </span>
  );
}

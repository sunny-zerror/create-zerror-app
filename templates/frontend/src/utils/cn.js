/** Joins class names, skipping falsy ones: cn("a", isOpen && "b") */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

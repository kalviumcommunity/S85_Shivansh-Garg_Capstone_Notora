// src/lib/utils.js
/**
 * A simple `cn(…)` function that joins truthy class names.
 * You can swap this out for `clsx` or any other utility if you prefer.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

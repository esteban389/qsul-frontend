import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges and conditionally combines class names using `clsx` and `tailwind-merge`.
 *
 * @param {...ClassValue[]} inputs - The class names to merge. Accepts a variable number of arguments,
 *                                   each of which can be a string, object, or array representing class names.
 * @returns {string} The combined class names with Tailwind utility conflicts resolved.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generates initials from the first two words in a name.
 *
 * @param {string} name - The full name from which to generate initials.
 * @returns {string} A string containing the initials of the first two words in uppercase.
 *                   For example, "John Doe" will return "JD".
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

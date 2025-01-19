import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Role } from '@/types/user';

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

/**
 * Checks if an object is empty.
 *
 * @param {Object} obj - The object to check.
 * @returns {boolean} Returns `true` if the object is empty, `false` otherwise.
 */
export function isObjectEmpty(obj: object): boolean {
  return JSON.stringify(obj) === '{}';
}

/**
 * Converts a value from one binary unit to another.
 * @param {number} value - The size value to be converted.
 * @param {string} fromUnit - The unit of the input value ('B', 'KB', 'MB', 'GB').
 * @param {string} toUnit - The unit to convert to ('B', 'KB', 'MB', 'GB').
 * @returns {number} - The converted value.
 */
export type BinaryUnit = 'B' | 'KB' | 'MB' | 'GB';
export function convertBinaryUnits(
  value: number,
  fromUnit: BinaryUnit,
  toUnit: BinaryUnit,
): number {
  const units = ['B', 'KB', 'MB', 'GB'];
  const fromIndex = units.indexOf(fromUnit.toUpperCase());
  const toIndex = units.indexOf(toUnit.toUpperCase());

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Invalid unit specified. Use "B", "KB", "MB", or "GB".');
  }

  // Calculate the conversion factor (1024^difference in index)
  const factor = 1024 ** (fromIndex - toIndex);
  return value * factor;
}
export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  return new Intl.DateTimeFormat('es-CO', options).format(new Date(date));
}

export const RolesTranslations = {
  [Role.NATIONAL_COORDINATOR]: 'Coordinador nacional',
  [Role.CAMPUS_COORDINATOR]: 'Coordinador seccional',
  [Role.PROCESS_LEADER]: 'Líder de proceso',
};

export function removeUndefinedAndNull<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null),
  ) as T;
}

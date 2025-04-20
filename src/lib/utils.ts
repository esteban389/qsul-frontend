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
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  return new Intl.DateTimeFormat('es-CO', options).format(typeof date === "string" ? new Date(date) : date);
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

export const jsonToBase64Image = (
  jsonString: string,
  primaryColor: string = '#22863a',
): string => {
  // Function to convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : { r: 0, g: 0, b: 0 };
  };

  // Function to create lighter background color
  const getLighterColor = (hex: string): string => {
    const { r, g, b } = hexToRgb(hex);
    // Mix with white to create lighter shade (90% white, 10% base color)
    const lighterR = Math.round(r * 0.1 + 255 * 0.9);
    const lighterG = Math.round(g * 0.1 + 255 * 0.9);
    const lighterB = Math.round(b * 0.1 + 255 * 0.9);
    return `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
  };

  const createSvg = (json: string): string => {
    const lines = JSON.stringify(JSON.parse(json), null, 2).split('\n');
    const height = Math.max(lines.length * 24 + 40, 100);
    const backgroundColor = getLighterColor(primaryColor);

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${height}">
        <rect width="100%" height="100%" fill="${backgroundColor}"/>
        <text x="20" y="40" font-family="monospace" font-size="14">
          ${lines
        .map(
          (line, i) => `
            <tspan
              x="20"
              dy="${i === 0 ? 0 : '1.2em'}"
              fill="${line.includes('"')
              ? primaryColor
              : line.includes(':')
                ? '#24292e'
                : line.match(/true|false|null/)
                  ? '#005cc5'
                  : line.match(/\d+/)
                    ? '#032f62'
                    : '#24292e'
            }"
            >${line
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;')}</tspan>
          `,
        )
        .join('')}
        </text>
      </svg>
    `.trim();
  };

  try {
    const svg = createSvg(jsonString);
    const base64 = btoa(svg);
    return `data:image/svg+xml;base64,${base64}`;
  } catch (e) {
    return '';
  }
};

const createSvg = (
  json: string,
  title: string = '',
  primaryColor = '#22863a',
): string => {
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : { r: 0, g: 0, b: 0 };
  };
  const getLighterColor = (hex: string): string => {
    const { r, g, b } = hexToRgb(hex);
    // Mix with white to create lighter shade (90% white, 10% base color)
    const lighterR = Math.round(r * 0.1 + 255 * 0.9);
    const lighterG = Math.round(g * 0.1 + 255 * 0.9);
    const lighterB = Math.round(b * 0.1 + 255 * 0.9);
    return `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
  };
  const lines = JSON.stringify(JSON.parse(json), null, 2).split('\n');
  // Increase height to accommodate title
  const height = Math.max(lines.length * 24 + 80, 140); // Added extra space for title
  const backgroundColor = getLighterColor(primaryColor);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${height}">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      
      <!-- Title -->
      <text 
        x="20" 
        y="30" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="16" 
        font-weight="bold" 
        fill="#24292e"
      >${title}</text>

      <!-- JSON Content -->
      <text x="20" y="60" font-family="monospace" font-size="14">
        ${lines
      .map(
        (line, i) => `
          <tspan
            x="20"
            dy="${i === 0 ? 0 : '1.2em'}"
            fill="${line.includes('"')
            ? primaryColor
            : line.includes(':')
              ? '#24292e'
              : line.match(/true|false|null/)
                ? '#005cc5'
                : line.match(/\d+/)
                  ? '#032f62'
                  : '#24292e'
          }"
          >${line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')}</tspan>
        `,
      )
      .join('')}
      </text>
    </svg>
  `.trim();
};

export const jsonToSvgDataUrl = (
  jsonString: string,
  title: string = '',
  color?: string,
): string => {
  try {
    const svg = createSvg(jsonString, title, color);
    const base64 = btoa(svg);
    return `data:image/svg+xml;base64,${base64}`;
  } catch (e) {
    return '';
  }
};

export function downloadURI(uri: string, name: string) {
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)) 
}

export function formatFileName(url: string): string {
  const fileName = url.split('/').pop() || '';
  return fileName
    .replace(/\.[^.]+$/, '') // Remove file extension
    .replace(/[_]/g, ' ') // Replace underscores with spaces
    .split(' ') // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    .join(' '); // Join back into a string
}

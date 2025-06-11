import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
  }).format(date);
}
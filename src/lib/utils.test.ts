import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should merge tailwind classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle clsx arguments', () => {
    expect(cn('text-sm', { 'font-bold': true, 'italic': false })).toBe('text-sm font-bold');
  });

  it('should handle arrays', () => {
    expect(cn(['text-sm', 'font-bold'])).toBe('text-sm font-bold');
  });

  it('should merge conflicting classes correctly', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });

  it('should ignore null and undefined', () => {
    expect(cn('text-sm', null, undefined, 'font-bold')).toBe('text-sm font-bold');
  });
});

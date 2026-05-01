import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { PreviewDashboard } from './PreviewDashboard';
import { useThemeStore } from '../store/useThemeStore';

vi.mock('../store/useThemeStore', () => ({
  useThemeStore: vi.fn(),
}));

describe('PreviewDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.head.innerHTML = '';
  });

  it('encodes font family names in Google Fonts URL', () => {
    const maliciousFont = 'Inter&family=MaliciousFont';
    (useThemeStore as any).mockReturnValue({
      meta: { baseTheme: 'light', projectName: 'Test Project' },
      lightColors: {
        background: '#ffffff',
        foreground: '#000000',
        card: '#ffffff',
        cardForeground: '#000000',
        popover: '#ffffff',
        popoverForeground: '#000000',
        primary: '#000000',
        primaryForeground: '#ffffff',
        secondary: '#cccccc',
        secondaryForeground: '#000000',
        muted: '#cccccc',
        mutedForeground: '#000000',
        accent: '#cccccc',
        accentForeground: '#000000',
        destructive: '#ff0000',
        destructiveForeground: '#ffffff',
        border: '#cccccc',
        input: '#cccccc',
        ring: '#000000',
        success: '#00ff00',
        successForeground: '#ffffff',
        warning: '#ffff00',
        warningForeground: '#000000',
      },
      darkColors: {},
      typography: {
        headingFont: maliciousFont,
        bodyFont: 'Roboto Mono',
        letterSpacing: 0,
        lineHeight: 1.5,
        baseSize: 1,
      },
      geometry: { radius: '0.5rem', borderThickness: 1 },
      effects: { shadowDepth: 'elevated', transitionEasing: 'ease-out' },
    });

    render(<PreviewDashboard />);

    const link = document.getElementById('stylemark-fonts') as HTMLLinkElement;
    expect(link).toBeTruthy();

    const href = link.href;
    // It should contain the encoded font name
    // Inter%26family%3DMaliciousFont
    expect(href).toContain('Inter%26family%3DMaliciousFont');
    // Roboto Mono should be encoded as Roboto+Mono or Roboto%20Mono
    expect(href).toMatch(/Roboto(\+|%20)Mono/);
  });
});

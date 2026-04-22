import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ControlCenter } from './ControlCenter';
import { useThemeStore } from '../store/useThemeStore';

describe('ControlCenter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('handles invalid JSON file import and does not update state', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const loadStateSpy = vi.spyOn(useThemeStore.getState(), 'loadState');

    const { container } = render(<ControlCenter />);

    const file = new File(['invalid json content'], 'test.json', { type: 'application/json' });
    const input = container.querySelector('#import-json') as HTMLInputElement;

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to parse JSON', expect.any(Error));
    });
    expect(loadStateSpy).not.toHaveBeenCalled();
  });

  it('handles valid JSON file import successfully', async () => {
    const loadStateSpy = vi.spyOn(useThemeStore.getState(), 'loadState');

    const { container } = render(<ControlCenter />);

    const validData = { primary: '#ff0000', radius: '0.5rem' };
    const file = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' });
    const input = container.querySelector('#import-json') as HTMLInputElement;

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(loadStateSpy).toHaveBeenCalledWith(validData);
    });
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nProvider } from '../I18nContext';
import { useI18n } from '../useI18n';

// Mock fetch
global.fetch = vi.fn();

// Create a mock store
const mockStore = configureStore({
  reducer: {
    ui: (state = {}) => state,
  },
});

// Test component that uses the hook
const TestComponent = () => {
  const { t, lang, setLang } = useI18n();
  return (
    <div>
      <div data-testid="translation">{t('test_key')}</div>
      <div data-testid="language">{lang}</div>
      <button onClick={() => setLang('pl')} data-testid="change-lang">
        Change Language
      </button>
    </div>
  );
};

describe('I18nContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide translations and language state', async () => {
    const mockTranslations = { test_key: 'Test Translation' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTranslations,
    });

    render(
      <Provider store={mockStore}>
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('translation')).toHaveTextContent('Test Translation');
    });
    expect(screen.getByTestId('language')).toHaveTextContent('en');
  });

  it('should handle translation loading errors gracefully', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(
      <Provider store={mockStore}>
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('translation')).toHaveTextContent('test_key');
    });
  });

  it('should fallback to English when translation fails', async () => {
    const mockEnglishTranslations = { test_key: 'English Translation' };
    
    // First call fails (for non-English language)
    (fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnglishTranslations,
      });

    render(
      <Provider store={mockStore}>
        <I18nProvider initialLang="pl">
          <TestComponent />
        </I18nProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('translation')).toHaveTextContent('English Translation');
    });
  });

  it('should replace parameters in translations', async () => {
    const mockTranslations = { 
      welcome_message: 'Welcome, {name}! You have {count} items.' 
    };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTranslations,
    });

    const TestComponentWithParams = () => {
      const { t } = useI18n();
      return (
        <div data-testid="param-translation">
          {t('welcome_message', { name: 'John', count: '5' })}
        </div>
      );
    };

    render(
      <Provider store={mockStore}>
        <I18nProvider>
          <TestComponentWithParams />
        </I18nProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('param-translation')).toHaveTextContent('Welcome, John! You have 5 items.');
    });
  });
});

# Plan Testów - FairMerchant

## 1. Wprowadzenie i Cele Testowania

### 1.1 Cel Projektu
FairMerchant to aplikacja mobilna przeznaczona dla sprzedawców na konwentach fantasy, comic-conach i targach. Aplikacja umożliwia zarządzanie sprzedażą, inwentarzem i kosztami wydarzeń w trybie offline-first.

### 1.2 Cele Testowania
- **Główny cel**: Zapewnienie wysokiej jakości i niezawodności aplikacji dla użytkowników końcowych
- **Cel funkcjonalny**: Weryfikacja wszystkich funkcji biznesowych zgodnie z wymaganiami produktowymi
- **Cel techniczny**: Sprawdzenie stabilności, wydajności i bezpieczeństwa aplikacji
- **Cel UX**: Zapewnienie intuicyjnego i wydajnego interfejsu użytkownika

## 2. Zakres Testów

### 2.1 Funkcjonalności Podlegające Testowaniu
- **Zarządzanie użytkownikami**: Rejestracja, logowanie, profil użytkownika
- **Zarządzanie produktami**: Dodawanie, edycja, usuwanie, kategoryzacja produktów
- **Zarządzanie sprzedażą**: Rejestrowanie transakcji, historia sprzedaży, edycja sprzedaży
- **Zarządzanie wydarzeniami**: Tworzenie, edycja, przeglądanie wydarzeń
- **Zarządzanie kosztami**: Dodawanie i śledzenie kosztów wydarzeń
- **Synchronizacja danych**: Tryb offline, synchronizacja z chmurą
- **Eksport danych**: Generowanie raportów CSV

### 2.2 Funkcjonalności Wyłączone z Testowania
- Integracja z zewnętrznymi systemami płatności (Square/SumUp)
- Funkcje wieloużytkownikowe dla jednego sklepu
- Zaawansowane zarządzanie inwentarzem

## 3. Typy Testów

### 3.1 Testy Jednostkowe
**Cel**: Weryfikacja pojedynczych komponentów i funkcji
**Zakres**:
- Komponenty React (ProductForm, SalesView, EventManagement)
- Redux slice'y (auth, products, sales, events)
- Serwisy (productService, saleService, eventService)
- Utility functions (csv.ts, imageHelpers.ts)

**Narzędzia**: Jest, React Testing Library
**Kryteria pokrycia**: Minimum 80% pokrycia kodu

### 3.2 Testy Integracyjne
**Cel**: Weryfikacja współpracy między komponentami
**Zakres**:
- Integracja Redux z komponentami React
- Integracja z Supabase API
- Integracja z lokalnym storage (SQLite)
- Integracja z systemem autoryzacji

**Narzędzia**: Jest, MSW (Mock Service Worker)
**Środowisko**: Test environment z mock'owanym Supabase

### 3.3 Testy End-to-End
**Cel**: Weryfikacja kompletnych scenariuszy użytkownika
**Zakres**:
- Pełne przepływy sprzedaży
- Zarządzanie produktami
- Zarządzanie wydarzeniami
- Synchronizacja offline-online

**Narzędzia**: Playwright
**Środowisko**: Staging environment

### 3.4 Testy Wydajnościowe
**Cel**: Weryfikacja responsywności aplikacji
**Zakres**:
- Czas ładowania komponentów
- Wydajność przy dużej liczbie produktów
- Synchronizacja dużych ilości danych
- Responsywność na różnych urządzeniach

**Narzędzia**: Lighthouse, React DevTools Profiler
**Kryteria**: Ładowanie < 3s, interakcje < 100ms

### 3.5 Testy Bezpieczeństwa
**Cel**: Weryfikacja bezpieczeństwa danych użytkowników
**Zakres**:
- Row Level Security (RLS) w Supabase
- Walidacja danych wejściowych
- Bezpieczeństwo autoryzacji
- Ochrona przed XSS i CSRF

**Narzędzia**: OWASP ZAP, manualne testy penetracyjne

### 3.6 Testy Offline
**Cel**: Weryfikacja funkcjonalności w trybie offline
**Zakres**:
- Działanie aplikacji bez połączenia internetowego
- Synchronizacja po przywróceniu połączenia
- Rozwiązywanie konfliktów danych
- Przechowywanie danych lokalnie

**Narzędzia**: Chrome DevTools (Network throttling), manualne testy

## 4. Scenariusze Testowe

### 4.1 Scenariusze Zarządzania Produktami
```
Scenariusz 1: Dodawanie nowego produktu
- Krok 1: Użytkownik loguje się do aplikacji
- Krok 2: Przechodzi do sekcji "Produkty"
- Krok 3: Klika "Dodaj produkt"
- Krok 4: Wypełnia formularz (nazwa, cena, koszt, kategoria)
- Krok 5: Dodaje zdjęcie produktu
- Krok 6: Zapisuje produkt
- Oczekiwany rezultat: Produkt zostaje dodany i widoczny na liście

Scenariusz 2: Edycja produktu
- Krok 1: Użytkownik wybiera produkt z listy
- Krok 2: Klika "Edytuj"
- Krok 3: Modyfikuje dane produktu
- Krok 4: Zapisuje zmiany
- Oczekiwany rezultat: Zmiany zostają zapisane i widoczne
```

### 4.2 Scenariusze Sprzedaży
```
Scenariusz 3: Rejestrowanie sprzedaży
- Krok 1: Użytkownik przechodzi do "Rejestruj sprzedaż"
- Krok 2: Wybiera wydarzenie (opcjonalnie)
- Krok 3: Dodaje produkty do koszyka
- Krok 4: Modyfikuje ilości
- Krok 5: Finalizuje sprzedaż
- Oczekiwany rezultat: Sprzedaż zostaje zapisana, stan magazynowy aktualizuje się

Scenariusz 4: Sprzedaż offline
- Krok 1: Użytkownik wyłącza internet
- Krok 2: Rejestruje sprzedaż
- Krok 3: Włącza internet
- Krok 4: Sprawdza synchronizację
- Oczekiwany rezultat: Dane synchronizują się automatycznie
```

### 4.3 Scenariusze Zarządzania Wydarzeniami
```
Scenariusz 5: Tworzenie wydarzenia
- Krok 1: Użytkownik przechodzi do "Wydarzenia"
- Krok 2: Klika "Nowe wydarzenie"
- Krok 3: Wypełnia dane wydarzenia
- Krok 4: Zapisuje wydarzenie
- Oczekiwany rezultat: Wydarzenie zostaje utworzone

Scenariusz 6: Dodawanie kosztów wydarzenia
- Krok 1: Użytkownik wybiera wydarzenie
- Krok 2: Dodaje koszt (np. opłata za stoisko)
- Krok 3: Sprawdza podsumowanie finansowe
- Oczekiwany rezultat: Koszt zostaje dodany, podsumowanie aktualizuje się
```

## 5. Środowisko Testowe

### 5.1 Środowiska Testowe
- **Development**: Lokalne środowisko deweloperskie
- **Staging**: Środowisko testowe z bazą danych testową
- **Production**: Środowisko produkcyjne (tylko testy smoke)

### 5.2 Konfiguracja Środowisk
```
Development:
- Supabase: Local development instance
- Database: Local PostgreSQL
- Storage: Local file system

Staging:
- Supabase: Staging project
- Database: Staging database
- Storage: Supabase storage (test bucket)

Production:
- Supabase: Production project
- Database: Production database
- Storage: Production storage
```

### 5.3 Dane Testowe
- Zestaw produktów testowych (różne kategorie, ceny)
- Wydarzenia testowe (przeszłe, aktualne, przyszłe)
- Sprzedaże testowe z różnymi scenariuszami
- Profile użytkowników testowych

## 6. Narzędzia do Testowania

### 6.1 Narzędzia Automatyzacji
- **Jest**: Testy jednostkowe i integracyjne
- **React Testing Library**: Testy komponentów React
- **Playwright**: Testy end-to-end
- **MSW**: Mockowanie API calls

### 6.2 Narzędzia Monitorowania
- **Lighthouse**: Wydajność i accessibility
- **React DevTools**: Profiling komponentów
- **Chrome DevTools**: Network throttling, offline simulation

### 6.3 Narzędzia Bezpieczeństwa
- **OWASP ZAP**: Automatyczne testy bezpieczeństwa
- **ESLint**: Analiza statyczna kodu
- **TypeScript**: Type checking

## 7. Harmonogram Testów

### 7.1 Faza 1: Testy Jednostkowe (Tydzień 1-2)
- Konfiguracja środowiska testowego
- Implementacja testów jednostkowych dla komponentów
- Implementacja testów dla Redux slice'ów
- Osiągnięcie 80% pokrycia kodu

### 7.2 Faza 2: Testy Integracyjne (Tydzień 3)
- Testy integracji z Supabase
- Testy synchronizacji danych
- Testy autoryzacji i RLS

### 7.3 Faza 3: Testy E2E (Tydzień 4)
- Implementacja scenariuszy Playwright
- Testy przepływów użytkownika
- Testy responsywności

### 7.4 Faza 4: Testy Offline i Wydajnościowe (Tydzień 5)
- Testy funkcjonalności offline
- Testy wydajnościowe
- Testy bezpieczeństwa

### 7.5 Faza 5: Testy Akceptacyjne (Tydzień 6)
- Testy z użytkownikami końcowymi
- Testy na różnych urządzeniach
- Finalne testy smoke

## 8. Kryteria Akceptacji Testów

### 8.1 Kryteria Funkcjonalne
- Wszystkie funkcje biznesowe działają zgodnie z wymaganiami
- Aplikacja działa w trybie offline
- Synchronizacja danych działa poprawnie
- Eksport CSV generuje poprawne dane

### 8.2 Kryteria Techniczne
- Pokrycie kodu testami ≥ 80%
- Wszystkie testy automatyczne przechodzą
- Brak błędów krytycznych i wysokich
- Wydajność zgodna z wymaganiami

### 8.3 Kryteria UX
- Interfejs jest intuicyjny i responsywny
- Aplikacja działa na różnych urządzeniach
- Czas odpowiedzi < 3 sekundy
- Dostępność zgodna z WCAG 2.1

## 9. Role i Odpowiedzialności

### 9.1 Zespół Testowy
- **QA Lead**: Koordynacja testów, definiowanie strategii
- **Automation Engineer**: Implementacja testów automatycznych
- **Manual Tester**: Testy eksploracyjne, testy UX
- **Security Tester**: Testy bezpieczeństwa

### 9.2 Współpraca z Deweloperami
- Code review testów
- Współpraca przy debugowaniu
- Ustalenie kryteriów akceptacji
- Wsparcie techniczne

## 10. Procedury Raportowania Błędów

### 10.1 Szablon Raportu Błędu
```
Tytuł: [Krótki opis problemu]
Priorytet: [Krytyczny/Wysoki/Średni/Niski]
Środowisko: [Development/Staging/Production]
Przeglądarka/Urządzenie: [Szczegóły]
Kroki do reprodukcji:
1. [Krok 1]
2. [Krok 2]
...
Oczekiwany rezultat: [Opis]
Rzeczywisty rezultat: [Opis]
Załączniki: [Screenshoty, logi]
```

### 10.2 Workflow Błędów
1. **Odkrycie**: Tester odkrywa błąd
2. **Raportowanie**: Utworzenie raportu w systemie śledzenia
3. **Weryfikacja**: Deweloper weryfikuje błąd
4. **Naprawa**: Implementacja poprawki
5. **Weryfikacja**: Testowanie poprawki
6. **Zamknięcie**: Potwierdzenie naprawy

### 10.3 Metryki Jakości
- Liczba błędów na sprint
- Czas naprawy błędów
- Pokrycie kodu testami
- Wskaźnik przejścia testów
- Satysfakcja użytkowników

## 11. Plan Ryzyka i Mitigacji

### 11.1 Zidentyfikowane Ryzyka
- **Ryzyko 1**: Problemy z synchronizacją offline-online
  - **Mitigacja**: Intensywne testy scenariuszy offline, implementacja mechanizmów rozwiązywania konfliktów

- **Ryzyko 2**: Problemy z wydajnością przy dużej liczbie produktów
  - **Mitigacja**: Testy wydajnościowe, optymalizacja zapytań, paginacja

- **Ryzyko 3**: Problemy z bezpieczeństwem danych użytkowników
  - **Mitigacja**: Testy bezpieczeństwa, audyt RLS, walidacja danych

- **Ryzyko 4**: Problemy z kompatybilnością urządzeń
  - **Mitigacja**: Testy na różnych urządzeniach, responsive design testing

### 11.2 Plan Kontyngencyjny
- Rezerwowy czas na dodatkowe testy
- Możliwość rozszerzenia zespołu testowego
- Alternatywne narzędzia testowe
- Procedury eskalacji problemów

## 12. Podsumowanie

Plan testów dla FairMerchant został opracowany z uwzględnieniem specyfiki projektu jako aplikacji offline-first dla sprzedawców na konwentach. Plan obejmuje wszystkie kluczowe aspekty testowania od jednostkowych po end-to-end, z szczególnym naciskiem na funkcjonalność offline, bezpieczeństwo danych i wydajność aplikacji.

Plan jest elastyczny i może być dostosowywany w miarę rozwoju projektu, zapewniając wysoką jakość produktu końcowego i satysfakcję użytkowników.

# Technology Stack: FaireFolio

This document outlines the proposed technology stack for the FaireFolio application, considering the project constraints (40-hour MVP, single senior developer with AI assistance) and the user's preferences.

## 1. Frontend (Mobile Application)

*   **Framework:** React Native
    *   *Rationale:* Leverages existing React/TypeScript knowledge for cross-platform mobile development (iOS and Android), aligning with the mobile-first requirement.
*   **Language:** TypeScript
    *   *Rationale:* Provides type safety and improves code quality, aligning with modern development practices.
*   **State Management:** React Context API
    *   *Rationale:* Sufficient for the initial MVP's complexity, avoiding external libraries to minimize overhead.
*   **Styling:** React Native StyleSheet API
    *   *Rationale:* Built-in solution for styling components, keeping the stack lean.

## 2. Backend & Cloud Services

*   **Backend-as-a-Service (BaaS):** Supabase
    *   *Rationale:* Confirmed by the user. Provides PostgreSQL database, authentication, and real-time capabilities, significantly reducing backend development time. It aligns well with the multitenancy requirement.

## 3. Local Data Storage (Offline-First)

*   **Database:** SQLite (via `react-native-sqlite-storage` or similar wrapper)
    *   *Rationale:* A robust, embedded relational database suitable for offline data storage on mobile devices. It's a common and well-supported choice for React Native applications requiring structured local data. For the 40-hour MVP, a basic implementation will focus on storing products and sales locally.

## 4. Development Tools & Practices

*   **Package Manager:** npm or Yarn
*   **Version Control:** Git
*   **IDE:** VS Code (common for JavaScript/TypeScript development)

## Considerations for Future Phases (Beyond 40-hour MVP)

*   **Advanced Offline Sync:** Integration with Supabase Realtime and potentially a more sophisticated local-first sync library (e.g., WatermelonDB, Realm Sync) for robust cloud synchronization and conflict resolution.
*   **State Management:** For larger applications, Redux Toolkit or Zustand might be considered.
*   **UI Libraries:** UI component libraries (e.g., NativeBase, React Native Paper) for faster UI development and consistent design.

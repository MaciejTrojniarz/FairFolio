# 0001-use-supabase-as-baas

## Title: Use Supabase as Backend-as-a-Service (BaaS)

## Status: Accepted

## Context

The application requires a backend for user authentication, multitenancy, and data storage. Given the project constraints (single senior developer, limited timeline), a full custom backend development is not feasible for the MVP.

## Decision

We will use Supabase as our Backend-as-a-Service (BaaS) solution.

## Consequences

### Positive
*   **Rapid Development:** Supabase provides out-of-the-box authentication, a PostgreSQL database, and real-time capabilities, significantly accelerating backend development.
*   **Scalability:** Managed service handles infrastructure scaling.
*   **Familiarity:** PostgreSQL database is widely understood.
*   **Cost-Effective:** Free tier is suitable for initial development and small-scale usage.

### Negative
*   **Vendor Lock-in:** Reliance on Supabase platform and its features.
*   **Customization Limitations:** While flexible, certain highly custom backend logic might require workarounds or edge functions.
*   **Offline Sync Complexity:** Integrating Supabase with a robust offline-first strategy (event-based, conflict resolution) will still require significant development effort.

## Alternatives Considered

*   **Firebase:** Another popular BaaS, but Supabase's PostgreSQL and open-source nature were preferred.
*   **Custom Node.js/Express Backend:** Too time-consuming for the given MVP timeline.
*   **No Backend (Local-only):** Not viable due to authentication and multitenancy requirements.

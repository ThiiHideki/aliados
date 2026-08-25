# Aliados

## Overview

Aliados is a Counter-Strike 2 community management system for friend groups. It tracks player performance, manages user profiles, provides player rankings, facilitates team balancing (MIX), and offers administrative dashboards. The application is a full-stack TypeScript project with a React frontend and an Express backend, utilizing PostgreSQL for data and Replit's OpenID Connect for authentication, all presented in Portuguese. Key features include player statistics, a virtual casino with betting and games, and a fantasy league.

## User Preferences

- Preferred communication style: Simple, everyday language
- Language: Portuguese (Brazil)
- Theme: CS-themed dark design with orange accents

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for fast development and optimized production builds. Wouter handles client-side routing. UI components leverage shadcn/ui (built on Radix UI) and Tailwind CSS for styling, adhering to a "New York" style variant with a gaming dashboard aesthetic. State management primarily uses TanStack Query for server state caching, avoiding a global client-side state library. Custom hooks encapsulate business logic. Typography uses Inter and JetBrains Mono, with a responsive grid layout.

### Backend Architecture

The backend is an Express.js application with TypeScript. It uses session-based authentication with `express-session` and PostgreSQL for session storage. Drizzle ORM provides type-safe PostgreSQL interactions, connecting to Neon serverless PostgreSQL. The data model includes tables for users (with detailed CS stats, level progression, streak system, and modifier items), matches, player-specific match statistics, a virtual casino system (balances, bets, transactions), and trophies.

**Authentication & Authorization:** A dual login system supports Replit OpenID Connect and custom Steam OpenID 2.0 implementation. The first user to log in automatically gains admin privileges, with subsequent users being regular players. Role-based access control uses an `isAdmin` flag.

**API Endpoints:** Key API endpoints handle user management, match data retrieval and import, SteamID linking, and casino functionalities (balance, betting, slot, case opening).

**CSV Import System:** An admin-only feature allows importing match data from CS2 server CSVs. This system automatically calculates MVPs based on various performance metrics and recalculates aggregated user statistics.

### Feature Specifications

-   **Level Progression:** Players earn `levelPoints` (LP) based on match performance (Rating Inimigos, wins/losses, bonuses) to progress through levels and tiers (Bronze, Prata, Dourado, Lendário).
-   **Streak System:** Tracks consecutive wins and applies bonus LP for streaks of 3 or more, displayed with a "Fire" icon.
-   **Modifier Items:** Players can earn and use `desafio_rp` (doubles LP change) and `freeze_rp` (zeroes LP change) items, with daily activation limits.
-   **Trophies:** Monthly award medals are generated and displayed on user profiles.
-   **Copa Aliados:** Tournament system with team registration, bracket management, player leaderboards, prize calculation, and rules.
-   **Virtual Casino:** Includes betting on player stats, a slot machine, and case opening games, using a virtual currency.
-   **Fantasy League:** A "Cartola FC"-style fantasy game where users pick players, and scores are based on real match performance.

## External Dependencies

### Core Infrastructure
-   **Neon Database:** Serverless PostgreSQL hosting.
-   **Replit Authentication:** OpenID Connect provider.

### UI & Component Libraries
-   **Radix UI:** Headless accessible component primitives.
-   **shadcn/ui:** Pre-built component library.
-   **Lucide React:** Icon library.

### Data & State Management
-   **TanStack Query:** Server state synchronization and caching.
-   **Drizzle ORM:** Type-safe database queries.
-   **Zod:** Runtime schema validation.

### Development Tools
-   **TypeScript:** Language for type safety.
-   **Tailwind CSS:** Utility-first styling framework.

### Authentication Stack
-   **Passport.js:** Authentication middleware.
-   **openid-client:** OpenID Connect client.
-   **express-session:** Session management.
-   **connect-pg-simple:** PostgreSQL session store.

### Supporting Libraries
-   **date-fns:** Date manipulation.
-   **recharts:** Data visualization.
-   **react-hook-form:** Form state management.
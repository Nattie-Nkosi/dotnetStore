# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce application with .NET 9 API backend and React 19 + TypeScript frontend.

## Commands

### Backend (API/)
```bash
dotnet watch run          # Dev server with hot reload (https://localhost:5001)
dotnet build              # Build project
dotnet run                # Run without watch
```

### Frontend (client/)
```bash
npm run dev               # Dev server with HMR (https://localhost:3000)
npm run build             # Production build
npm run lint              # ESLint
```

### Testing
No test infrastructure currently configured. To add:
- Backend: Create xUnit project with `dotnet new xunit -n API.Tests`
- Frontend: Install Vitest with `npm install -D vitest @testing-library/react`

## Architecture

### Backend Structure
- **Controllers/**: REST API endpoints (ProductsController handles `/api/products`)
- **Data/**: EF Core DbContext and migrations; DbInitializer seeds database on startup
- **Entities/**: Data models (Product)
- **Database**: SQLite (store.db) with auto-migrations

### Frontend Structure
- **app/layout/**: Root App component, NavBar, global styles
- **app/store/**: Redux store configuration
- **app/routes/**: React Router setup
- **features/**: Feature-based organization (catalog, about, contact, home)
- **app/models/**: TypeScript interfaces

### Key Patterns
- Feature-based folder structure on frontend
- Redux Toolkit for state management (minimal usage currently)
- Material-UI (MUI v6) for all UI components
- Async/await throughout backend with EF Core
- CORS configured to allow only localhost:3000

## Important Conventions

- TypeScript strict mode enabled
- .NET nullable reference types enabled
- Prices stored as cents (long), display by dividing by 100
- API base URL hardcoded: `https://localhost:5001/api`
- Both servers require HTTPS (frontend uses mkcert plugin)

## Key Files

- `API/Program.cs` - App configuration, DI, CORS, middleware
- `API/Data/DbInitializer.cs` - Database seeding logic
- `client/src/main.tsx` - React entry with Redux Provider and Router
- `client/src/app/routes/Routes.tsx` - Route definitions
- `client/src/features/catalog/Catalog.tsx` - Product list with API fetch

# GamePlatform Monorepo

This repository contains the frontend and backend for the GamePlatform project.

## Structure

-   `backend/`: Node.js (Express, TypeScript) API, including Supabase integration, authentication, and CRUD operations for various game platform entities. Also contains an OpenAPI specification.
-   `frontend/`: React (Vite, TypeScript) application, featuring user authentication, admin dashboards for managing platform data, and user-facing views for championships, events, and registrations.

## Development

Refer to the README files within the `frontend/` and `backend/` directories for specific setup and development instructions.

## Key Features

-   **Backend:**
    -   User authentication and role-based access control (RBAC).
    -   CRUD APIs for: Users, Championships, Events, Tracks, Vehicles, Rules, Registrations, Results, Comments, and File Uploads.
    -   Supabase integration for database and storage.
    -   API testing suite scaffolded with Jest and Supertest.
    -   OpenAPI specification for API documentation.
-   **Frontend:**
    -   User authentication flow (Login, Register, Profile).
    -   Public pages for viewing Championships and Events.
    -   User dashboard for managing registrations ("My Registrations") and profile (including avatar upload).
    -   Admin dashboards for managing all platform entities (Users, Championships, Events, Tracks, Vehicles, Rules, Registrations, Results, Files, Comments).
    -   Reusable components for comments and image galleries.
    -   Tailwind CSS for styling, with conceptual use of Shadcn/UI components.
    -   Data fetching through custom hooks interacting with the backend API.

## Cleanup Status

This project has undergone a rewrite from an older Symfony-based application.
-   **Successfully removed from root:** `.buildpath`, `.project`, `.travis.yml`, old `LICENSE`, old `README.md`, `_config.yml`, `composer.json`, `composer.lock`, `.gitattributes`, old `.gitignore`, `.settings/`, `nbproject/`. The `app/` directory also appears to have been removed.
-   **Remaining old Symfony directories (due to tool limitations on deleting large numbers of files):** `src/` (PHP), `web/`. These should be manually removed from the repository if this project were being managed outside the current AI agent environment.
-   **New root files:** This `README.md` and a new `.gitignore` suitable for the monorepo structure.
-   **New primary directories:** `frontend/` and `backend/` contain the new applications.

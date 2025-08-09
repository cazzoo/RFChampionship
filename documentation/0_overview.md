# Application Architecture

This application is a web-based championship management system named `//RF//Championship`, built with the Symfony 2 PHP framework. It allows users to organize and participate in racing championships for various games.

The application follows a modular architecture, leveraging Symfony's bundle system. Each bundle encapsulates a specific set of functionalities. Here are the main bundles and their responsibilities:

## Bundles

*   **`RFCCoreBundle`**: This is the heart of the application. It contains the core business logic, all the main database entities (like `Championship`, `Event`, `Game`, `Result`, etc.), and the primary features accessible to end-users.

*   **`RFCAdminBundle`**: This bundle provides the administration back-end. It contains controllers and views for managing all the core entities of the application, such as creating new games, managing championships, users, and system settings.

*   **`RFCUserBundle`**: Built on top of the popular `FOSUserBundle`, this bundle handles everything related to user management. This includes user registration, login, profile management, and roles. It defines the `User` entity with application-specific fields.

*   **`RFCSetupBundle`**: This bundle appears to be responsible for the initial setup and installation process of the application, guiding the administrator through the necessary configuration steps.

*   **`RFCFrameworkBundle`**: This bundle likely contains shared services, custom listeners, and other framework-level customizations that are used across the other bundles in the application.

This component-based architecture makes the system modular and easier to maintain or extend. The core functionalities are well-separated from the user management and administration parts.

# Database Schema

The database schema is defined using Doctrine ORM entities. The core entities are located in the `src/RFC/CoreBundle/Entity` directory. The `User` entity is in `src/RFC/UserBundle/Entity`.

## Core Entities

### `Game`
Represents a specific racing game (e.g., Assetto Corsa, iRacing).

-   **Properties**: `id`, `shortName`, `name`, `description`.
-   **Relationships**:
    -   Has many `Championships`.
    -   Has many `Tracks`.
    -   Has many `Vehicles`.
    -   Has many `Categories`.
    -   Has many `Rules` and `MetaRules`.

### `Championship`
Represents a championship for a specific game.

-   **Properties**: `id`, `championshipAgreed`, `registrationInProgress`, `name`, `description`.
-   **Relationships**:
    -   Belongs to one `Game`.
    -   Has many `Events`.
    -   Has many `Teams`.
    -   Has many `Registrations`.
    -   Has many `Users` (participants).
    -   Has many `Users` (managers).
    -   Can have many `Rules` and one `MetaRule`.
    -   Can have many `Vehicles` and `Categories` to restrict entries.

### `Event`
Represents a single event within a championship (e.g., a race weekend).

-   **Properties**: `id`, `listBroadcast`, `name`, `description`.
-   **Relationships**:
    -   Belongs to one `Championship`.
    -   Belongs to one `Track`.
    -   Has many `Sessions`.

### `Session`
Represents a specific session within an event (e.g., practice, qualifying, race).

-   **Properties**: `id`, `beginDate`, `endDate`, `name`, `description`.
-   **Relationships**:
    -   Belongs to one `Event`.
    -   Belongs to one `TypeSession`.
    -   Has many `Results`.

### `Result`
Represents the result of a user in a session.

-   **Properties**: `id`, `comments`.
-   **Relationships**:
    -   Belongs to one `User`.
    -   Belongs to one `Session`.
    -   Can be associated with a `Rule`.

### `Track`
Represents a race track.

-   **Properties**: `id`, `name`, `description`.
-   **Relationships**:
    -   Belongs to one `Game`.

### `Vehicle`
Represents a vehicle.

-   **Properties**: `id`, `name`, `description`.
-   **Relationships**:
    -   Belongs to one `Game`.

### `Team`
Represents a team of users in a championship.

-   **Properties**: `id`, `name`, `description`.
-   **Relationships**:
    -   Belongs to one `Championship`.
    -   Has many `Users` (main drivers).
    -   Has many `Users` (secondary drivers).

### `Registration`
Represents a user's registration in a championship.

-   **Properties**: `id`, `type` (main driver, secondary driver).
-   **Relationships**:
    -   Belongs to one `User`.
    -   Belongs to one `Championship`.
    -   Can belong to one `Team`.

### `User`
Represents a user of the application. Extends `FOSUserBundle`'s `BaseUser`.

-   **Properties**: `id`, `username`, `email`, `firstName`, `lastName`, `age`, `avatarUrl`, `steamId`, `favoriteNumber`, `locale`.
-   **Relationships**:
    -   Can be a member of many `Championships`.
    -   Can have many `Registrations`.
    -   Can have many `Results`.
    -   Can be a member of a `Crew` (team).
    -   Has roles (`ROLE_USER`, `ROLE_MANAGER`, `ROLE_ADMIN`).

# Application Features

This application provides a comprehensive platform for managing and participating in online racing championships.

## User Features

*   **User Registration and Profile**: Users can register for an account, log in, and manage their profile information, including personal details and racing preferences (like a favorite number).
*   **Championship Discovery**: Users can browse a list of available championships for different racing games.
*   **Championship Registration**: Users can register to participate in championships, either as individual drivers or as part of a team.
*   **View Championship Details**: Users can view detailed information about a championship, including its schedule of events, rules, and registered participants.
*   **View Results**: Users can view the results of past events and sessions.
*   **Team Management**: Users can create or join teams to compete in team-based championships.

## Admin Features

Admins have access to a backend panel to manage the entire application:

*   **Game Management**: Admins can add new racing games and manage their associated data, such as tracks, vehicles, and vehicle categories.
*   **Championship Management**: Admins can create, edit, and manage championships. This includes setting up the rules, defining the schedule of events, and managing registrations.
*   **Event and Session Management**: For each championship, admins can create events and define the sessions within them (e.g., practice, qualifying, race), including setting the dates and times.
*   **User Management**: Admins can manage all users of the system, including their roles and permissions.
*   **Results Entry**: Admins can enter and manage the results for each session of an event.
*   **System Configuration**: Admins can configure various aspects of the application.

# Technical Documentation for Porting

This section provides technical details that would be useful when porting this application to another language or framework (e.g., a modern web stack using a TSX-based frontend).

## API Endpoints

The application exposes some API endpoints. Based on the file structure (`src/RFC/CoreBundle/Resources/config/routing/api.yml`) and serializer annotations in the entities (`@Groups({"api"})`), there is an API for retrieving core data.

A full audit of the routing configuration files (`routing.yml` in each bundle) would be necessary to map out all available API endpoints. However, we can infer the existence of endpoints for entities like `Championship`, `Game`, `User`, etc.

When porting, you would need to recreate these API endpoints in the new backend to serve data to the frontend.

## Data Formats

The application uses the standard Symfony stack, which means data is typically rendered in HTML templates (Twig). For the API, the data is likely serialized to JSON. The `@Groups` annotations in the entities control which fields are exposed in the API, which is a feature of the JMSSerializerBundle.

When porting to a separate frontend, you would need to ensure the new backend's API provides JSON responses with a similar structure to what the current API provides.

## Authentication

Authentication is handled by `FOSUserBundle`. It uses a session-based authentication mechanism. For a modern web application with a separate frontend, you would likely want to switch to a token-based authentication system, such as JWT (JSON Web Tokens). This would involve:

1.  Creating a new endpoint on the backend for users to log in and receive a token.
2.  Securing the backend API so that it requires a valid token for most requests.
3.  Storing the token on the frontend (e.g., in `localStorage` or a cookie) and sending it with every request to the backend.

## Business Logic

A significant amount of the application's business logic is contained within the Doctrine entities themselves (e.g., in the `Championship.php` entity, there are methods like `getCurrentEvent()`, `getNextSession()`, `getIsFinished()`, etc.).

When porting, this logic will need to be extracted and reimplemented in the new backend. It's crucial to carefully review the methods in each entity file in `src/RFC/CoreBundle/Entity` and `src/RFC/UserBundle/Entity` to ensure no business logic is lost. This includes calculations, state checks (like `isFinished`), and complex data retrieval logic.

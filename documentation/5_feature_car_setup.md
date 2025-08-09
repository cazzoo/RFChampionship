# Feature: Car Setup Management

The application includes a highly flexible and generic feature for managing car setups, which is implemented in the `RFCSetupBundle`. This feature allows users to create, manage, and version detailed, step-by-step setups for specific vehicles and tracks.

## Core Concepts

The feature is built around three main entities:

1.  **`Step`**: This is a *definition* of a setup component. An administrator defines a series of Steps for each game. Each `Step` represents a configurable part of the car, such as "Tire Pressure", "Front Wing Angle", or "Brake Bias". A `Step` can be broken down further into `SubStep` entities for more granularity.
2.  **`Setup`**: This is the main container for a user's car setup. A `Setup` entity is created by a user and is associated with a specific `Vehicle` and `Track`. It acts as a collection of all the setup values for that car/track combination.
3.  **`SetupStep`**: This is the join entity that stores the actual *value* for a given `Step` within a user's `Setup`. It links the `Setup`, the `Step`, and contains the `value` (e.g., "28psi") entered by the user. It also includes a `version` field, allowing users to save multiple iterations of their setup.

## Functional Flow

### 1. Admin Configuration

-   **Process**: Before the feature can be used for a game, an administrator must define the "setup template" by creating a series of `Step` and `SubStep` entities.
-   **Logic**:
    -   The admin uses the `/admin/game/{gameId}/Setup/Step` interface to create, order, and categorize each step of a setup.
    -   For each `Step`, they can define its name, description, complexity, and any helpful tips. This creates a standardized template for all users creating setups for that game.

### 2. User Setup Creation

-   **Process**: A user navigates to the "Setups" section of the site, and chooses to create a new setup for a specific vehicle and track.
-   **Logic**:
    -   This action creates a new `Setup` entity, linked to the `User`, `Vehicle`, and `Track`.
    -   The system then presents the user with a multi-step interface based on the `Step` definitions created by the admin.

### 3. Entering Setup Values

-   **Process**: The user goes through the defined steps, entering the value for each one (e.g., typing a value, selecting from a dropdown).
-   **Logic**:
    -   For each `Step` the user fills out, a `SetupStep` entity is created.
    -   This `SetupStep` record stores the `value` and links back to the parent `Setup` and the `Step` definition.
    -   The user can save their progress and come back later. The system keeps track of which steps are completed.

### 4. Versioning

-   **Process**: A user can revise a setup and save it as a new version.
-   **Logic**:
    -   The `SetupStep` entity has a `version` field. When a user edits a setup, new `SetupStep` records can be created with an incremented version number, preserving the history of their setup changes.
    -   The `Setup` entity has logic (`getLastSetupStepVersion()`) to retrieve the latest version for any given step.

In summary, this is not just a feature for storing a few setup parameters. It is a generic, admin-configurable, and version-controlled system for guiding users through a detailed car setup process, which can be customized for any vehicle or game within the application.

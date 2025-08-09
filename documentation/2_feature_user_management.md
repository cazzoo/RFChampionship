# Feature: User Management

User management is handled by the `RFCUserBundle`, which is built on top of the `FOSUserBundle`, a common bundle for user management in Symfony applications.

## User Entity

The `User` entity (`src/RFC/UserBundle/Entity/User.php`) extends the base `User` class from `FOSUserBundle` and adds several application-specific fields:

-   `firstName`: The user's first name.
-   `lastName`: The user's last name.
-   `age`: The user's age.
-   `avatarUrl`: A URL to the user's avatar image.
-   `steamId`: The user's Steam ID.
-   `favoriteNumber`: The user's preferred racing number.
-   `locale`: The user's preferred language for the application (e.g., `en_UK`, `fr_FR`).

## Registration

-   **Process**: New users can register through a form. The registration form (`src/RFC/UserBundle/Form/RegistrationFormType.php`) collects the standard user information (username, email, password) as well as the custom fields listed above.
-   **Logic**: Upon submission, a new `User` entity is created and persisted to the database. The user is initially assigned the `ROLE_USER` role.

## Authentication (Login)

-   **Process**: Registered users can log in using their username and password.
-   **Logic**: Authentication is handled by `FOSUserBundle`. After a successful login, a `LoginListener` (`src/RFC/UserBundle/EventListener/LoginListener.php`) is triggered.
-   **Post-Login Logic**: The listener retrieves the `locale` from the logged-in user's profile and sets it as the `_locale` in the session. This ensures the application is displayed in the user's preferred language.

## Profile Management

-   **Process**: Logged-in users can view and edit their profile information.
-   **Logic**: The profile management forms allow users to update the custom fields on their `User` entity.

## Roles and Permissions

The application defines a set of user roles, likely in `src/RFC/UserBundle/Entity/RoleEnum.php`, to manage permissions. The roles are hierarchical:

-   `ROLE_USER`: Basic user, can participate in championships.
-   `ROLE_MANAGER`: Can manage championships.
-   `ROLE_CERTIFIED_MANAGER`: A manager with a higher level of trust.
-   `ROLE_ADMIN`: Has full control over the application.

The `User` entity has methods like `isRoleAdmin()`, `isRoleManager()`, etc., to check the user's permissions. These roles are used throughout the application to restrict access to certain features (e.g., only admins can access the admin panel).

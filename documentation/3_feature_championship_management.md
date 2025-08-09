# Feature: Championship Management

Championship management is the core feature of the application. The logic is split between the `RFCAdminBundle` for administration and the `RFCCoreBundle` for user-facing views and actions.

## Championship Lifecycle

### 1. Creation (Admin)

-   **Process**: An administrator creates a new championship via the admin panel (`/admin/game/{gameId}/championship/new`).
-   **Configuration**: The `ChampionshipType` form allows the admin to configure:
    -   Basic details: Name, description.
    -   Status: Whether it's agreed/official, and if registrations are open.
    -   Rules: A set of rules and a meta-rule for scoring.
    -   Vehicle restrictions: Limiting the championship to specific vehicles or categories.
    -   Managers: Assigning users who can manage the championship.
-   **Team Generation**: If the championship is team-based, the system can automatically generate the teams.
    -   **Logic**: The `ChampionshipController::createAction` in the `AdminBundle` calls the `generateTeams()` method on the `Championship` entity. This method can create teams based on the list of allowed vehicles, categories, or a manually specified number.

### 2. User Registration (User)

-   **Process**: Once a championship is active and registrations are open, users can register for it.
-   **Logic**:
    -   The `ChampionshipController::registrationAction` in the `RFCCoreBundle` handles the registration request.
    -   It calls the `addUserRegistration()` method on the `Championship` entity.
    -   This creates a `Registration` entity that links the `User` to the `Championship`.
    -   If the championship is team-based, the user can be assigned to a `Team` with a specific `drivertype` (e.g., main or secondary driver).
-   **Vehicle Selection**: After registering, if the championship requires it, the user must select a vehicle. The `vehicleSelectionAction` handles this by associating a `Vehicle` with the user's `Registration` entity.

#### Logic Flow: User Registration
```mermaid
graph TD
    A[User clicks Register/Unregister button] --> B{Controller: registrationAction};
    B --> C{Fetch Championship, User, Team entities};
    C --> D{Action == 'register' ?};
    D -- Yes --> E[Call championship->addUserRegistration()];
    E --> F[Create new Registration entity];
    F --> G[Flush changes to DB];
    D -- No --> H[Call championship->removeUserRegistration()];
    H --> I[Find and remove Registration entity];
    I --> G;
    G --> J[Return JSON success response];
```

### 3. Viewing and Standings (User)

-   **Process**: Users can view the championship page, which includes the schedule, participants, and results.
-   **Logic**:
    -   The `indexAction` in the `CoreBundle`'s `ChampionshipController` categorizes championships into "Current", "Past", and "Draft" based on their dates and status.
    -   The `getResultsAction` calculates the overall standings. It fetches all results for the championship's events and sessions, and uses the `addPointsToUser` and `addPointsToTeam` methods to sum up the points according to the rules. The results are then sorted and displayed.

#### Logic Flow: Result Calculation
```mermaid
graph TD
    A[User requests Championship Results page] --> B{Controller: getResultsAction};
    B --> C{Fetch Championship entity};
    C --> D[Initialize empty userResults and teamResults arrays];
    D --> E{For each Event in Championship};
    E --> F{For each Session in Event};
    F --> G{Is session used for results?};
    G -- Yes --> H{For each Result in Session};
    H --> I[Call addPointsToUser(result)];
    I --> J[Call addPointsToTeam(result)];
    J --> H;
    H -- End of Results --> F;
    G -- No --> F;
    F -- End of Sessions --> E;
    E -- End of Events --> K[Sort userResults and teamResults arrays];
    K --> L[Render results template];
```

### 4. Management (Admin)

-   **Process**: Admins can edit, update, and delete championships at any time through the admin panel.
-   **Logic**: The `AdminBundle`'s `ChampionshipController` provides the standard CRUD actions for managing championship entities.

This lifecycle shows a clear separation of concerns between the admin's setup and management tasks and the user's interaction with the championship. A lot of the core business logic is encapsulated within the `Championship` entity itself.

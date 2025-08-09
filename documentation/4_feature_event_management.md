# Feature: Event & Result Management

The management of events, sessions, and results is handled by administrators in the admin panel.

## Event Management

-   **Process**: For any given championship, an admin can create one or more events. An event typically represents a race weekend at a specific track.
-   **Logic**:
    -   The `EventController` in the `AdminBundle` handles the creation, editing, and deletion of `Event` entities.
    -   When creating an event, the admin uses the `EventType` form to specify the event's name, description, and the `Track` it will take place on.
    -   The event is always associated with a parent `Championship`.

## Session Management

-   **Process**: Within each event, an admin can create multiple sessions, such as "Practice", "Qualifying", and "Race".
-   **Logic**:
    -   Sessions are not created at the same time as the event. They are added afterwards.
    -   The `SessionController` in the `AdminBundle` handles the CRUD operations for `Session` entities.
    -   When creating a session, the admin specifies its type (e.g., Race, Qualifying), and its start and end times. Each session is linked to its parent `Event`.

## Result Management

-   **Process**: After a session is completed, an admin is responsible for entering the results for each participant.
-   **Logic**:
    -   The user interface for result entry likely sends an AJAX request with all the session's results in a single batch.
    -   The `ResultController::setSessionResultsAction` in the `AdminBundle` receives this request.
    -   The action processes a list of results, where each result contains the `User`, the `Rule` that applies (which determines the points), and any comments.
    -   The logic then creates new `Result` entities or updates existing ones for the given `Session`.
    -   This allows for efficient bulk entry of results for all participants in a session.

This workflow shows a clear separation of concerns: Events are containers for Sessions, and Sessions are containers for Results. The data entry is designed to be done by administrators after the racing events have concluded.

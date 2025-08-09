# Entity: CrewRequest

**File:** `src/RFC/CoreBundle/Entity/CrewRequest.php`

**Description:** Represents a user's request to join a `Crew`. It holds the status of the request (e.g., pending, accepted, rejected).

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the request. |
| `state` | `integer` | `state` | Not Null | The current state of the join request (e.g., 1 for pending, 2 for accepted). |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `crew` | ManyToOne | `Crew` | Inversed by `listCrewRequests` | The crew that the user is requesting to join. |
| `requester` | ManyToOne | `User` | Inversed by `listCrewRequests` | The user who made the request. |

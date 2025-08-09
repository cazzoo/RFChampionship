# Entity: Crew

**File:** `src/RFC/CoreBundle/Entity/Crew.php`

**Description:** Represents a "crew" or a persistent group of users, likely for a specific game. This appears to be a social feature separate from the formal `Team` entity used in championships.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the crew. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the crew. |
| `description` | `text` | `description` | Nullable | A detailed description of the crew. |
| `commentsActive`| `boolean` | `commentsActive`| Not Null | A flag to enable or disable comments. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `game` | ManyToOne | `Game` | N/A | The game this crew is primarily associated with. |
| `owner` | ManyToOne | `User` | N/A | The user who owns or created the crew. |
| `listCrewRequests` | OneToMany | `CrewRequest` | Mapped by `crew` | A list of all requests to join this crew. |

### Inherited Relationships

*From `Descriptor`*

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listImages` | ManyToMany | `File` | N/A (Unidirectional) | A list of image files associated with the crew. |

# Entity: Session

**File:** `src/RFC/CoreBundle/Entity/Session.php`

**Description:** Represents a single session within an event, such as Practice, Qualifying, or a Race. It has a specific start and end time and holds the results for that session.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the session. |
| `beginDate` | `datetime` | `begin_date` | Not Null | The start date and time of the session. |
| `endDate` | `datetime` | `end_date` | Not Null | The end date and time of the session. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the session (e.g., "Race 1", "Qualifying"). |
| `description` | `text` | `description` | Nullable | A detailed description of the session. |
| `commentsActive`| `boolean` | `commentsActive`| Not Null | A flag to enable or disable comments. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listResults` | OneToMany | `Result` | Mapped by `session` | The list of results for all participants in this session. |
| `typeSession` | ManyToOne | `TypeSession` | N/A | The type of the session (e.g., Practice, Race). |
| `event` | ManyToOne | `Event` | Inversed by `listSessions` | The event this session belongs to. |

### Inherited Relationships

*From `Descriptor`*

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listImages` | ManyToMany | `File` | N/A (Unidirectional) | A list of image files associated with the session. |

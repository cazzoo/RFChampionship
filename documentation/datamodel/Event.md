# Entity: Event

**File:** `src/RFC/CoreBundle/Entity/Event.php`

**Description:** Represents a single event within a championship, which typically corresponds to a race weekend at a specific track. It contains one or more sessions.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the event. |
| `listBroadcast` | `array` | `listBroadcast` | Not Null | An array containing information or links related to the event's broadcast. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the event (e.g., "Monza Grand Prix"). |
| `description` | `text` | `description` | Nullable | A detailed description of the event. |
| `commentsActive`| `boolean` | `commentsActive`| Not Null | A flag to enable or disable comments. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `track` | ManyToOne | `Track` | N/A | The track where the event takes place. |
| `championship` | ManyToOne | `Championship` | Inversed by `listEvents` | The championship this event belongs to. |
| `listSessions` | OneToMany | `Session` | Mapped by `event` | The list of all sessions (practice, qualifying, race) within this event. |

### Inherited Relationships

*From `Descriptor`*

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listImages` | ManyToMany | `File` | N/A (Unidirectional) | A list of image files associated with the event. |

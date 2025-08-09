# Entity: Vehicle

**File:** `src/RFC/CoreBundle/Entity/Vehicle.php`

**Description:** Represents a single vehicle (car) available in a specific game.

**Extends:** `KnowledgeData` (which extends `Descriptor`)

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the vehicle. |

### Inherited Fields

*From `KnowledgeData` & `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the vehicle. |
| `description` | `text` | `description` | Nullable | A detailed description of the vehicle. |
| `commentsActive`| `boolean` | `commentsActive`| Not Null | A flag to enable or disable comments. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `game` | ManyToOne | `Game` | Inversed by `listVehicles` | The game this vehicle belongs to. |

### Inherited Relationships

*From `Descriptor`*

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listImages` | ManyToMany | `File` | N/A (Unidirectional) | A list of image files associated with the vehicle. |

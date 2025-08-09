# Entity: Setup

**File:** `src/RFC/SetupBundle/Entity/Setup.php`

**Description:** Represents a user's car setup for a specific vehicle and track combination. It acts as a container for a versioned, multi-step setup process.

**Extends:** `KnowledgeData` (which extends `Descriptor`)

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the setup. |

### Inherited Fields
*From `KnowledgeData` & `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the setup. |
| `description` | `text` | `description` | Nullable | A detailed description of the setup. |
| `commentsActive`| `boolean` | `commentsActive`| Not Null | A flag to enable or disable comments. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listSetupSteps` | OneToMany | `SetupStep` | Mapped by `setup` | A list of all the steps and their values that comprise this setup. |
| `user` | ManyToOne | `User` | N/A | The user who owns this setup. |
| `track` | ManyToOne | `Track` | N/A | The track this setup is for. Can be null. |
| `vehicle` | ManyToOne | `Vehicle` | N/A | The vehicle this setup is for. |
| `game` | ManyToOne | `Game` | N/A | The game this setup belongs to. |

### Inherited Relationships
*From `Descriptor`*

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listImages` | ManyToMany | `File` | N/A (Unidirectional) | A list of image files associated with the setup. |

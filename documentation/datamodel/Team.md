# Entity: Team

**File:** `src/RFC/CoreBundle/Entity/Team.php`

**Description:** Represents a team of users competing in a specific championship.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the team. |
| `maxMainDrivers` | `integer` | `maxMainDrivers` | Nullable | The maximum number of main drivers allowed on this team. |
| `maxSecondaryDrivers` | `integer` | `maxSecondaryDrivers` | Nullable | The maximum number of secondary drivers allowed on this team. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the team. |
| `description` | `text` | `description` | Nullable | A detailed description of the team. |
| `commentsActive`| `boolean` | `commentsActive`| Not Null | A flag to enable or disable comments. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `championship` | ManyToOne | `Championship` | Inversed by `listTeams` | The championship this team is competing in. |
| `category` | ManyToOne | `Category` | N/A | The vehicle category this team is associated with (if applicable). |
| `vehicle` | ManyToOne | `Vehicle` | N/A | The specific vehicle this team uses (if applicable). |
| `listMainDrivers` | ManyToMany | `User` | N/A (Unidirectional) | A list of the main drivers on the team. |
| `listSecondaryDrivers` | ManyToMany | `User` | N/A (Unidirectional) | A list of the secondary or reserve drivers on the team. |

### Inherited Relationships

*From `Descriptor`*

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listImages` | ManyToMany | `File` | N/A (Unidirectional) | A list of image files associated with the team. |

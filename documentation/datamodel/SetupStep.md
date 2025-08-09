# Entity: SetupStep

**File:** `src/RFC/SetupBundle/Entity/SetupStep.php`

**Description:** This is the join entity that stores the actual value for a given `Step` within a user's `Setup`. It is the core of the versioned setup data.

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for this specific setup step instance. |
| `value` | `text` | `value` | Not Null | The actual value entered by the user for this step (e.g., "28psi"). |
| `version` | `integer` | `version` | Not Null | The version number for this step value, allowing for setup history. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp automatically set when the entity is created. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp automatically set when the entity is updated. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `setup` | ManyToOne | `Setup` | Inversed by `listSetupSteps` | The parent `Setup` this value belongs to. |
| `step` | ManyToOne | `Step` | N/A | The `Step` definition this value corresponds to. |
| `subStep` | ManyToOne | `SubStep` | N/A | The `SubStep` definition this value corresponds to, if applicable. |

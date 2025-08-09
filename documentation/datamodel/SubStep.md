# Entity: SubStep

**File:** `src/RFC/SetupBundle/Entity/SubStep.php`

**Description:** Represents a more granular part of a `Step`. This allows for creating complex, nested setup templates.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the sub-step definition. |
| `stepCondition`| `string(255)` | `stepCondition`| Nullable | A condition that might determine if this sub-step is active or required. |
| `toDoText` | `text` | `toDoText` | Nullable | A specific instruction or "to-do" text for this sub-step. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the sub-step. |
| `description` | `text` | `description` | Nullable | A detailed description of the sub-step. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `step` | ManyToOne | `Step` | Inversed by `listSubSteps` | The parent `Step` this sub-step belongs to. |

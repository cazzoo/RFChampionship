# Entity: TypeSession

**File:** `src/RFC/CoreBundle/Entity/TypeSession.php`

**Description:** Defines a type of session, such as "Practice", "Qualifying", or "Race".

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the session type. |
| `usedForResults`| `boolean` | `usedForResults`| Not Null | A flag indicating if this session type should be used for calculating championship results. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the session type. |
| `description` | `text` | `description` | Nullable | A detailed description of the session type. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `game` | ManyToOne | `Game` | Inversed by `listTypeSessions` | The game this session type is associated with. |

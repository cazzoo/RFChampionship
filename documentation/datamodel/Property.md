# Entity: Property

**File:** `src/RFC/CoreBundle/Entity/Property.php`

**Description:** A generic entity to store key-value properties, likely for game-specific settings or dynamic content.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the property. |
| `value` | `text` | `value` | Nullable | The value of the property. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The key or name of the property (e.g., "flashNews", "weeklyDriver"). |
| `description` | `text` | `description` | Nullable | A detailed description of the property. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `game` | ManyToOne | `Game` | Inversed by `listProperties` | The game this property is associated with. |

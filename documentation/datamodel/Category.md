# Entity: Category

**File:** `src/RFC/CoreBundle/Entity/Category.php`

**Description:** Represents a category of vehicles within a specific game (e.g., "GT3", "Prototype").

**Extends:** `KnowledgeData`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the category. |

### Inherited Fields
*From `KnowledgeData` & `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the category. |
| `description` | `text` | `description` | Nullable | A detailed description of the category. |
| `game` | `Game` | `game_id` | Not Null | The game this category belongs to. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listVehicles` | ManyToMany | `Vehicle` | Mapped by `listCategories` | The list of vehicles that belong to this category. |

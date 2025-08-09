# Entity: Rule

**File:** `src/RFC/CoreBundle/Entity/Rule.php`

**Description:** Represents a specific rule that can be applied to a championship or a result, often to assign points.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the rule. |
| `value` | `integer` | `value` | Not Null | The point value associated with this rule (e.g., 25 for 1st place). |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the rule (e.g., "P1", "Fastest Lap"). |
| `description` | `text` | `description` | Nullable | A detailed description of the rule. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `game` | ManyToOne | `Game` | Inversed by `listRules` | The game this rule is associated with. |
| `metaRule` | ManyToOne | `MetaRule` | Inversed by `listRules` | The meta-rule (rule group) this rule belongs to. |

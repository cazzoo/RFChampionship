# Entity: MetaRule

**File:** `src/RFC/CoreBundle/Entity/MetaRule.php`

**Description:** Represents a collection or a group of rules that can be applied together to a championship. It acts as a container for `Rule` entities.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the meta-rule. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the rule set (e.g., "FIA Standard Points"). |
| `description` | `text` | `description` | Nullable | A detailed description of the rule set. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `game` | ManyToOne | `Game` | Inversed by `listMetaRules` | The game this meta-rule is associated with. |
| `listRules` | OneToMany | `Rule` | Mapped by `metaRule` | The list of individual rules that make up this rule set. |

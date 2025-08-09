# Entity: Step

**File:** `src/RFC/SetupBundle/Entity/Step.php`

**Description:** Represents the definition of a single, configurable step in a car setup template for a specific game (e.g., "Tire Pressures", "Aerodynamics").

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the step definition. |
| `category` | `string(100)` | `category` | Not Null | The category this step belongs to (e.g., "Suspension", "Chassis"). |
| `indicatorType`| `string(255)` | `indicatorType` | Not Null | The type of indicator or input expected for this step. |
| `tip` | `text` | `tip` | Nullable | A helpful tip or instruction for the user regarding this step. |
| `complexity` | `integer` | `complexity` | Not Null | A measure of the complexity of this setup step. |
| `stepOrder` | `integer` | `stepOrder` | Not Null | The order in which this step should appear in the setup process. |

### Inherited Fields

*From `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the setup step. |
| `description` | `text` | `description` | Nullable | A detailed description of the setup step. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listSubSteps` | OneToMany | `SubStep` | Mapped by `step` | A list of more granular sub-steps that make up this step. |
| `game` | ManyToOne | `Game` | N/A | The game this step definition applies to. |

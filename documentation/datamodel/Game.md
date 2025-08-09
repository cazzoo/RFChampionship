# Entity: Game

**File:** `src/RFC/CoreBundle/Entity/Game.php`

**Description:** Represents a specific racing game that can host championships (e.g., Assetto Corsa, iRacing). It acts as a top-level container for game-specific elements like tracks, vehicles, and rules.

**Extends:** `Descriptor`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the game. |
| `shortName` | `string(255)` | `shortName` | Not Null | A shorter or abbreviated name for the game. |

### Inherited Fields from `Descriptor`

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The full name of the game. |
| `description` | `text` | `description` | Nullable | A detailed description of the game. |
| `commentsActive`| `boolean` | `commentsActive`| Not Null | A flag to enable or disable comments on the game's page. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp automatically set when the entity is created. (from `TimestampableEntity` trait) |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp automatically set when the entity is updated. (from `TimestampableEntity` trait) |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listChampionships` | OneToMany | `Championship` | Mapped by `game` | A list of all championships that belong to this game. |
| `listMetaRules` | OneToMany | `MetaRule` | Mapped by `game` | A list of meta-rules specific to this game. |
| `listRules` | OneToMany | `Rule` | Mapped by `game` | A list of rules specific to this game. |
| `listTracks` | OneToMany | `Track` | Mapped by `game` | A list of tracks available in this game. |
| `listVehicles` | OneToMany | `Vehicle` | Mapped by `game` | A list of vehicles available in this game. |
| `listCategories` | OneToMany | `Category` | Mapped by `game` | A list of vehicle categories specific to this game. |
| `listTypeSessions`| OneToMany | `TypeSession` | Mapped by `game` | The types of sessions (e.g., Race, Qualify) that can be had in this game. |
| `listProperties` | OneToMany | `Property` | Mapped by `game` | A list of custom properties associated with this game. |

### Inherited Relationships from `Descriptor`

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listImages` | ManyToMany | `File` | N/A (Unidirectional) | A list of image files associated with the game. |

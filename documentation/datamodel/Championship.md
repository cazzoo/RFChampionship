# Entity: Championship

**File:** `src/RFC/CoreBundle/Entity/Championship.php`

**Description:** Represents a single championship or league for a specific game. This is a central entity that links together events, teams, participants, and rules.

**Extends:** `KnowledgeData` (which extends `Descriptor`)

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the championship. |
| `championshipAgreed` | `boolean` | `championshipAgreed` | Not Null | A flag to indicate if the championship is officially agreed upon or approved. |
| `registrationInProgress` | `boolean` | `registrationInProgress` | Not Null | A flag to indicate if user registration is currently open. |

### Inherited Fields

*From `KnowledgeData` & `Descriptor`*

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `name` | `string(255)` | `name` | Not Null | The name of the championship. |
| `description` | `text` | `description` | Nullable | A detailed description of the championship. |
| `commentsActive`| `boolean` | `commentsActive`| Not Null | A flag to enable or disable comments. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `game` | ManyToOne | `Game` | Inversed by `listChampionships` | The game this championship is for. |
| `listEvents` | OneToMany | `Event` | Mapped by `championship` | The list of all events (races) in this championship. |
| `listManagers` | ManyToMany | `User` | N/A (Unidirectional) | A list of users who can manage the championship. |
| `metaRule` | ManyToOne | `MetaRule` | N/A | The main scoring rule set for the championship. |
| `listRules` | ManyToMany | `Rule` | N/A (Unidirectional) | A list of additional rules that apply. |
| `listUsers` | ManyToMany | `User` | Mapped by `listChampionships` | A list of all users participating in the championship. |
| `listTeams` | OneToMany | `Team` | Mapped by `championship` | The list of teams competing in the championship. |
| `listRegistrations` | OneToMany | `Registration` | Mapped by `championship` | A list of all registration records for this championship. |
| `listCategories` | ManyToMany | `Category` | N/A (Unidirectional) | Vehicle categories allowed in this championship. |
| `listVehicles` | ManyToMany | `Vehicle` | N/A (Unidirectional) | Specific vehicles allowed in this championship. |

### Inherited Relationships

*From `Descriptor`*

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listImages` | ManyToMany | `File` | N/A (Unidirectional) | A list of image files associated with the championship. |

# Entity: Result

**File:** `src/RFC/CoreBundle/Entity/Result.php`

**Description:** Represents a single result for a user in a specific session. It links a user to a session and associates a rule, which determines the points awarded.

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the result. |
| `comments` | `text` | `comments` | Not Null | Any comments or notes regarding this specific result (e.g., penalties, incidents). |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp automatically set when the entity is created. (from `TimestampableEntity` trait) |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp automatically set when the entity is updated. (from `TimestampableEntity` trait) |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `user` | ManyToOne | `User` | N/A | The user who achieved this result. Can be null. |
| `rule` | ManyToOne | `Rule` | N/A | The rule that applies to this result, which determines the points awarded. |
| `session` | ManyToOne | `Session` | Inversed by `listResults` | The session in which this result was achieved. |

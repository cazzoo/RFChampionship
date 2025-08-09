# Entity: Registration

**File:** `src/RFC/CoreBundle/Entity/Registration.php`

**Description:** Represents a user's registration for a specific championship. It links a user to a championship and can also associate them with a team and vehicle.

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the registration. |
| `type` | `integer` | `type` | Not Null | The type of driver (e.g., 1 for Main, 2 for Secondary). |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp automatically set when the entity is created. (from `TimestampableEntity` trait) |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp automatically set when the entity is updated. (from `TimestampableEntity` trait) |

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `championship` | ManyToOne | `Championship` | Inversed by `listRegistrations` | The championship the user is registered for. |
| `user` | ManyToOne | `User` | Inversed by `listRegistrations` | The user who is registered. |
| `team` | ManyToOne | `Team` | N/A | The team the user is registered with (if applicable). |
| `vehicle` | ManyToOne | `Vehicle` | N/A | The vehicle the user has selected for the championship. |

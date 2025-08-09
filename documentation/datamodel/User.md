# Entity: User

**File:** `src/RFC/UserBundle/Entity/User.php`

**Description:** Represents a user of the application. This entity stores profile information, credentials, and relationships to other parts of the system.

**Extends:** `FOS\UserBundle\Model\User as BaseUser`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the user. |
| `firstName` | `string(255)` | `firstName` | Nullable | The user's first name. |
| `lastName` | `string(255)` | `lastName` | Nullable | The user's last name. |
| `age` | `integer` | `age` | Nullable | The user's age. |
| `avatarUrl` | `string(255)`| `avatarUrl` | Nullable | A URL to the user's avatar image. |
| `steamId` | `string(255)`| `steamId` | Nullable | The user's Steam ID. |
| `favoriteNumber`| `integer` | `favoriteNumber`| Nullable, Unique | The user's preferred racing number. |
| `locale` | `string(5)` | `locale` | Not Null | The user's preferred language for the application (e.g., `en_UK`). |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp automatically set when the entity is created. (from `TimestampableEntity` trait) |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp automatically set when the entity is updated. (from `TimestampableEntity` trait) |

### Inherited Fields
*From `FOS\UserBundle\Model\User`*

This entity inherits many fields from the `BaseUser` class. Key inherited fields include:
- `username`
- `usernameCanonical`
- `email`
- `emailCanonical`
- `enabled`
- `salt`
- `password`
- `lastLogin`
- `confirmationToken`
- `passwordRequestedAt`
- `roles` (array of user roles)

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `listPreferences` | ManyToMany | `Property` | N/A (Unidirectional) | A list of user-specific preferences. |
| `listCrewRequests` | OneToMany | `CrewRequest` | Mapped by `requester` | A list of requests this user has made to join crews. |
| `listChampionships` | ManyToMany | `Championship` | Mapped by `listUsers` | The championships this user is a participant in. |
| `listRegistrations` | OneToMany | `Registration` | Mapped by `user` | A list of all championship registrations for this user. |

# Entity: Vote

**File:** `src/RFC/CoreBundle/Entity/Vote.php`

**Description:** Represents a user's vote (e.g., upvote/downvote) on a comment. This entity is part of the `FOSCommentBundle` integration.

**Extends:** `FOS\CommentBundle\Entity\Vote`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the vote. |

### Inherited Fields
*From `FOS\CommentBundle\Entity\Vote`*

This entity inherits its fields from the `BaseVote` class. These likely include:
- `value`: The value of the vote (e.g., +1 for an upvote, -1 for a downvote).
- `createdAt`: The creation timestamp.

---

## Relationships

### Inherited Relationships
*From `FOS\CommentBundle\Entity\Vote`*

- `comment`: The `Comment` that was voted on.
- `voter`: The `User` who cast the vote.

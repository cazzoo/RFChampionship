# Entity: Comment

**File:** `src/RFC/CoreBundle/Entity/Comment.php`

**Description:** Represents a single comment made by a user. This entity is part of the `FOSCommentBundle` integration.

**Extends:** `FOS\CommentBundle\Entity\Comment`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the comment. |

### Inherited Fields
*From `FOS\CommentBundle\Entity\Comment`*

This entity inherits most of its fields from the `BaseComment` class provided by `FOSCommentBundle`. These likely include:
- `body`: The text content of the comment.
- `ancestors`: Part of the nested set implementation for comment threading.
- `depth`: The nesting level of the comment.
- `createdAt`: The creation timestamp.
- `state`: The moderation state of the comment (e.g., visible, spam).
- `author`: The user who wrote the comment.

---

## Relationships

| Property Name | Relationship | Target Entity | Mapped By/Inversed By | Description |
|---|---|---|---|---|
| `thread` | ManyToOne | `Thread` | N/A | The comment thread this comment belongs to. |

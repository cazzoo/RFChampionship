# Entity: Thread

**File:** `src/RFC/CoreBundle/Entity/Thread.php`

**Description:** Represents a comment thread. `FOSCommentBundle` uses threads to attach comment sections to any other entity in the application (e.g., a specific `Championship` or `Event`).

**Extends:** `FOS\CommentBundle\Entity\Thread`

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `string` | `id` | **Primary Key** | A unique identifier for the comment thread. By convention, this is often a combination of the entity type and its ID (e.g., "Championship_123"). |

### Inherited Fields
*From `FOS\CommentBundle\Entity\Thread`*

This entity inherits most of its fields from the `BaseThread` class. These likely include:
- `isCommentable`: A boolean flag to enable or disable commenting on the thread.
- `numComments`: A count of the comments in the thread.
- `lastCommentAt`: A timestamp of the last comment.
- `permalink`: The URL to the page where the comment thread is displayed.

# Entity: File

**File:** `src/RFC/CoreBundle/Entity/File.php`

**Description:** Represents an uploaded file, typically an image, that can be associated with other entities.

---

## Fields

| Property Name | Data Type | Column Name | Constraints | Description |
|---|---|---|---|---|
| `id` | `integer` | `id` | **Primary Key**, Auto-generated | The unique identifier for the file. |
| `path` | `string(255)`| `path` | Not Null | The path to the file on the server. |
| `name` | `string(255)`| `name` | Not Null | The name of the file. |
| `createdAt` | `datetime` | `created_at` | Not Null | Timestamp for creation. |
| `updatedAt` | `datetime` | `updated_at` | Not Null | Timestamp for the last update. |

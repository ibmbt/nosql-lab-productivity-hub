# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** — authentication credentials and profile data for all users
- **projects** — goals or folders created by users to group related tasks. Tracks name, description, and archive status.
- **tasks** — items belonging to a project and owner. Track progress like status, priority, tags, subtasks.
- **notes** — text entries by user. They can be linked to project and are searchable by tags.

---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  ownerId: ObjectId (required),
  name: string (required),
  description: string (optional),
  archived: boolean (required, default: false),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  ownerId: ObjectId (required),
  projectId: ObjectId (required),
  title: string (required),
  priority: number (optional, default: 1),
  status: string (required, default: "todo"),
  tags: array of strings (optional, default: []),
  subtasks: array of objects [ { title: string, done: boolean } ] (optional, default: []),
  createdAt: Date (required)
}
```

### notes
```
{
  _id: ObjectId,
  ownerId: ObjectId (required),
  projectId: ObjectId (optional),
  content: string (required),
  tags: array of strings (optional, default: []),
  createdAt: Date (required)
}
```

---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship                       | Embed or Reference? | Why? |
|-----------------------------------|---------------------|------|
| Subtasks inside a task            |  embedded   | subtasks related to tasks, without them there is no subtasks, strongly related  |
| Tags on a task                    |  embedded   | tags only exit for a task, if no task there can not be a tag for that  |
| Project → Task ownership          |  referenced | tasks can be large in number you can store them seperately and reference them, they need ot be filtered searched seperately so kept seperate  |
| Note → optional Project link      |  referenced | Notes can be standalone independent of project |

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

> MongoDB allows flexible schemas, so not every document needs the same fields. This is useful because if a note isn’t linked to a project, we can simply leave out the projectId field instead of storing a null value, keeping the data cleaner and more efficient.

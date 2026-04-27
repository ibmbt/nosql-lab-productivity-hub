// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  console.log('Inserting users...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const usersResult = await db.collection('users').insertMany([
    { email: 'hadi@gmail.com', passwordHash, name: 'Hadi', createdAt: new Date() },
    { email: 'jaffar@gmail.com', passwordHash, name: 'Jaffar', createdAt: new Date() }
  ]);

  const hadiId = usersResult.insertedIds[0];
  const jaffarId = usersResult.insertedIds[1];

  console.log('Inserting projects...');
  const projectsResult = await db.collection('projects').insertMany([
    { ownerId: hadiId, name: 'Redis', description: 'Rebuilding a mini redis from scratch', archived: false, createdAt: new Date() },
    { ownerId: hadiId, name: 'DSA', archived: false, createdAt: new Date() },

    { ownerId: jaffarId, name: 'ADBMS', description: 'Advanced NoSQL Lab Work', archived: false, createdAt: new Date() },
    { ownerId: jaffarId, name: 'OOP', description: 'Object-Oriented Design Patterns', archived: true, createdAt: new Date() }
  ]);

  const redisId = projectsResult.insertedIds[0];
  const dsaId = projectsResult.insertedIds[1];
  const adbmsId = projectsResult.insertedIds[2];
  const oopId = projectsResult.insertedIds[3];

  console.log('Inserting tasks...');
  await db.collection('tasks').insertMany([
    {
      ownerId: hadiId, projectId: redisId,
      title: "Implement event loop",
      status: "in-progress", priority: 3,
      tags: ["c", "core", "networking"],
      subtasks: [
        { title: "Setup epoll", done: true },
        { title: "Handle client connections", done: false }
      ],
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 86400000)
    },
    {
      ownerId: hadiId, projectId: redisId,
      title: "Write custom memory allocator",
      status: "todo", priority: 2,
      tags: ["memory"],
      subtasks: [],
      createdAt: new Date()
    },
    {
      ownerId: hadiId, projectId: dsaId,
      title: "Implement Red-Black Trees",
      status: "done", priority: 1,
      tags: ["trees", "hard"],
      subtasks: [
        { title: "Insertion logic", done: true },
        { title: "Rebalancing rotations", done: true }
      ],
      createdAt: new Date()
    },
    {
      ownerId: jaffarId, projectId: adbmsId,
      title: "Design MongoDB Aggregation Pipeline",
      status: "in-progress",
      tags: ["nosql", "lab"],
      subtasks: [{ title: "Lookup syntax", done: false }],
      createdAt: new Date()
    },
    {
      ownerId: jaffarId, projectId: oopId,
      title: "Refactor Inheritance Tree",
      status: "todo", priority: 2,
      tags: ["cpp", "refactoring"],
      subtasks: [{ title: "Remove multiple inheritance", done: false }],
      createdAt: new Date()
    }
  ]);

  console.log('Inserting notes...');
  await db.collection('notes').insertMany([
    { ownerId: hadiId, projectId: redisId, body: "saara redis to ma khud hi bna lu ga.", tags: ["reminder", "epoll"], createdAt: new Date() },
    { ownerId: hadiId, projectId: dsaId, body: "ofs file system.", tags: ["files", "trees"], createdAt: new Date() },
    { ownerId: jaffarId, projectId: adbmsId, body: "need to complete the lab in time please.", tags: ["mongodb", "tips"], createdAt: new Date() },

    { ownerId: hadiId, body: "Need to clean my laptop.", tags: ["personal", "hardware"], createdAt: new Date() },
    { ownerId: jaffarId, body: "Email butt bhai.", tags: ["career", "todos"], createdAt: new Date() }
  ]);

  console.log('Database seeded successfully!');
  process.exit(0);
})();

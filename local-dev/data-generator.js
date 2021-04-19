const { v4: uuid } = require("uuid");
const db = require("./db");
const faker = require("faker");

const MAX_FILES = 100000;
const MAX_FILES_TO_ASSOCIATE = 1000;
const MAX_USERS = 10000;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

async function testConnection() {
  try {
    const userCount = await db.query(`SELECT COUNT(*) FROM users`, []);
    console.log(userCount);
    return userCount;
  } catch (error) {
    console.error(`Error connecting: ${error}`);
  }
}

async function generateFiles() {
  try {
    for (let file = 0; file < MAX_FILES; file++) {
      console.log(`Create File: ${file}`);
      await db.query(`INSERT INTO files(filename) VALUES ($1) RETURNING *`, [
        uuid(),
      ]);
    }
  } catch (error) {
    console.log(error);
  } finally {
    return;
  }
}

async function generateUsers() {
  try {
    for (let user = 0; user < MAX_USERS; user++) {
      console.log(`Create User: ${user}`);
      await db.query(
        `INSERT INTO users(first_name, last_name) VALUES ($1, $2) RETURNING *`,
        [faker.name.firstName(), faker.name.lastName()]
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function generateUserToFileRelationship() {
  try {
    for (let user = 1; user < MAX_USERS; user++) {
      const numFilesToAssociate = getRandomInt(0, MAX_FILES_TO_ASSOCIATE);
      console.log(`user: ${user}, Total Files: ${numFilesToAssociate}`);

      for (let file = 0; file < numFilesToAssociate; file++) {
        await db.query(
          `INSERT INTO files_security(user_id, file_id) VALUES ($1,$2) RETURNING *`,
          [user, getRandomInt(0, MAX_FILES)]
        );
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    return;
  }
}

async function main() {
  await testConnection();
  await generateUsers();
  await generateFiles();
  await generateUserToFileRelationship();
}

main()
  .then(() => {
    console.error("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error: %s", err);
    console.error("Error: %s", err.stack);
    process.exit(1);
  });

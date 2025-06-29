import readline from "node:readline/promises";
import connectMongoose from "./lib/connectMongoose.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Chance from "chance";
import "dotenv/config";

const connection = await connectMongoose();
console.log(`Connected to MongoDB ${connection.name}`);

const answer = await ask(
  "Are you sure you want to initialize the database? (n)"
);
if (answer.toLowerCase() !== "y") {
  console.log("Process aborted.");
  process.exit();
}

const users = await initUsers();
await initDBNodepop(users);

const allUsers = await User.find();
for (const user of allUsers) {
  const count = await Product.countDocuments({ owner: user._id });
  console.log(`User: "${user.name}" has ${count} products.`);
}

await connection.close();

async function initDBNodepop(users) {
  const chance = new Chance();
  const products = await Product.deleteMany();
  console.log(`Delete ${products.deletedCount} products.`);

  const availableTags = Product.getTags();
  const newProduct = Array.from({ length: 50 }, () => ({
    name: chance.word(),
    price: chance.floating({ min: 1, max: 3000 }).toFixed(2),
    tags: chance.pickset(
      availableTags,
      chance.integer({ min: 1, max: availableTags.length })
    ),
    owner: chance.pickone(users)._id,
  }));
  const insertProduct = await Product.insertMany(newProduct);
  console.log(
    `Insert ${insertProduct} products. \nTotal products insert ${insertProduct.length}.`
  );
}

async function initUsers() {
  const users = await User.deleteMany();
  console.log(`Delete ${users.deletedCount} users.`);

  const insertUsers = await User.insertMany([
    {
      name: "Admin",
      email: "admin@example.com",
      password: await User.hashPassword("1234"),
    },
    {
      name: "User",
      email: "user@example.com",
      password: await User.hashPassword("1234"),
    },
  ]);
  console.log(`Insert ${insertUsers.length} users.`);
  return insertUsers;
}

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const askResult = await rl.question(question + " ");
  rl.close();
  return askResult;
}

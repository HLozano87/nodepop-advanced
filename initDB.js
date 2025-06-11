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

const userId = await initUsers();
await initDBNodepop(userId);
await connection.close();

async function initDBNodepop(userId) {
  const chance = new Chance();
  const products = await Product.deleteMany();
  console.log(`Delete ${products.deletedCount} products.`);

  const availableTags = ["Work", "LifeStyle", "Motor", "Mobile"];
  const newProduct = Array.from({ length: 10 }, () => ({
    name: chance.word(),
    price: chance.integer({ min: 1, max: 3000 }),
    image: `https://picsum.photos/id/${Math.floor(
      Math.random() * 1084
    )}/300/200`,
    tags: chance.pickset(
      availableTags,
      chance.integer({ min: 1, max: availableTags.length })
    ),
    owner: userId,
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
    { email: "user@example.com", password: await User.hashPassword("1234") },
  ]);
  console.log(`Insert ${insertUsers.length} users.`);
  return insertUsers[0]._id;
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

# Nodepop

### After cloning the repository:

Access the project in windows with:

```sh
cd /project_path/nodepop
```

Once inside the path run the command ```code .``` this will open the vscode to the **"nodepop ”** folder and from the windows console run the following command for install dependencies with:

```sh
npm install

or

npm i
```

This will install all the dependencies needed to start the project.

## Run MongoDB on MacOS or Linux:

```sh
./bin/mongod --dbpath ./data
```

# First deployment app Nodepop

First rename file env_tmp to .env and follow instructions this file.

On first deploy you can use the next command to initialize the database:

```sh
node initDB.js
```
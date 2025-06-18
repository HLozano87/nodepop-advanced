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

#### Install [MongoDB](!https://www.mongodb.com) from official page.

### Install MongoDB with Homebrew

```zsh
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
```

### Run MongoDB on MacOS or Linux:

Start Services mongodb

```sh
brew services start mongodb-community@8.0
```

Stop Services mongodb

```sh
brew services stop mongodb-community@8.0
```

```sh
./bin/mongod --dbpath ./data
```

### Run services using Docker

```sh
docker run --name mongodb -d -p 27017:27017 -v ~/data/db:/data/db mongo:8.0
```

## First deployment app Nodepop

First rename file env_tmp to .env and follow instructions this file.

On first deploy you can use the next command to initialize the database:

```sh
node initDB.js
```

### Run Nodepop

Development:

```sh
npm run dev
```

Start:

```sh
npm run start
```
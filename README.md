# Conjugarden

*Forked from [hghwng](https://github.com/hghwng/conjugarden)*

## Introduction

Learn Spanish conjugation the easy way.

## Dependencies

* Python 3: build the dictionary
* Node.js: main application

## Setup

Copy the config file:

```bash
cp config.js.example config.js
```

Create a database in mysql to use, and then edit config.js with the connection details.
(example sql to create the database and a user:)

```sql
CREATE USER 'conjugarden_user'@'localhost' IDENTIFIED BY 'some_password';
CREATE DATABASE conjugarden;
GRANT ALL ON conjugarden.* TO 'conjugarden_user'@'localhost';
```

Install node dependencies:

```bash
npm install
```

Initialize the database schema & data

```bash
node site/initialize_database.js
```

Build the dictionary:

```bash
cd data && ./process.py
```

The build script writes the processed dictionary to `site/data.json`

Start the server:

```bash
cd site && node app.js
```

The server listens on port 8080 by default.

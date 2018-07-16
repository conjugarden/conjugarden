# Conjugarden

*Forked from [hghwng](https://github.com/hghwng/conjugarden)*

## Introduction

Learn Spanish conjugation the easy way.

## Dependencies

* Python 3: build the dictionary
* Node.js: main application

## Setup

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

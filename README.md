# Node.js Boilerplate with TypeScript

Install `yarn`:

```
   brew update
   brew install yarn
```

Run `yarn` after cloning this repository. The project provides the following scripts:

- `yarn development` will start the server in development mode. It uses **nodemon** to watch for changes and restart the server.
  It will run **tslint** over the source files after every restart, but errors will not stop the server from running.
  TypeScript files are compiled on-the-fly using **ts-node**.

- `yarn migration:generate` will generate the missing migrations

- `yarn migration:run` will run the generated migrations

- `yarn elasticsearch-sync` will sync the postgres db to the elasticsearch cluster

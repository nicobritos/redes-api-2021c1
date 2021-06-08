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

- `yarn debug` will start the server in development mode with debugging available on port `5858`.

- `yarn run prod` will start the server in production mode. Files are still compiled with **ts-node** but are not linted or monitored by **nodemon**.

- `yarn run lint` will run **tslint** on all source files.
  The *tslint.json* file should be configured to your preferred coding style.

- `yarn test` will run the pre-configured **tape** tests, but can be replaced with your preferring testing framework.

- `yarn elasticsearch` will run the elastic search cluster

- `yarn migration:generate` will generate the missing migrations

- `yarn migration:run` will run the generated migrations

- `yarn elasticsearch-sync` will sync the postgres db to the elasticsearch cluster

## Main Libraries

- [Express](http://expressjs.com/) - web framework
- [InversifyJS](https://github.com/inversify/InversifyJS) - TypeScript DI/IoC framework
- [Iridium](https://github.com/SierraSoftworks/Iridium) - TypeScript Mongo ODM
- [TypeORM](https://github.com/typeorm/typeorm) - TypeScript ORM (uses sqlite as an example)
- [winston](https://github.com/winstonjs/winston) - logging framework

## CORS

For CORS to work correctly add 'api.latinbox.com' to hosts file. In order for it to work with window's hosts file please check [this stack overflow answer](https://stackoverflow.com/a/36646749).

## Run migrations

Remember to run migrations to get the db up to date with schema changes.


## ENV

The following env params are needed for the application to work. Preferably put them in /secret/config.env.
Note that new lines need to be inside double quotes `"` and they are encoded as `\n`


```dotenv
# Recomended size: 2048b of entropy
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"

# Recomended size: 2048b of entropy
XSRF_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
XSRF_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"

PAYPAL_SECRET="..."
PAYPAL_CLIENT="..."
PAYPAL_ACCOUNT="...@personal.example.com"
PAYPAL_URL="https://api-m.sandbox.paypal.com/"
PAYPAL_LOGIN_PATH="/v1/oauth2/token"
PAYPAL_ONBOARD_SELLER_RETURN_URL="http://latinbox.com"
PAYPAL_MERCHANT_ID=""

GOOGLE_STORAGE_PROJECT_ID="latinbox"
GOOGLE_STORAGE_BUCKET_PUBLIC_LISTINGS="..."
GOOGLE_STORAGE_BUCKET_REVIEW_LISTINGS="..."
GOOGLE_STORAGE_BUCKET_DRAFT_LISTINGS="..."

REDIS_QUEUE_URL="0.0.0.0:6379"
REDIS_RECENTLY_DATA_URL="0.0.0.0:6380"
REDIS_RECENTLY_DATA_LISTINGS_VIEWED_SET="listings_recently_viewed"
REDIS_RECENTLY_DATA_LISTINGS_SEARCHED_SET="listings_recently_searched"

ELASTIC_SEARCH_URL="http://127.0.0.1:9200"
ELASTIC_SEARCH_LISTINGS_ACTIVE_INDEX="listings_active"
ELASTIC_SEARCH_LISTINGS_PAUSED_INDEX="listings_paused"

CASSANDRA_HOST="127.0.0.1:9042"

EXPRESS_PORT=8000
EXPRESS_CORS_ORIGINS="admin.latinbox.com,www.latinbox.com,latinbox.com"
GRAPHQL_PATH="/graphql"
```

### Google Storage

The Google Storage library doesn't use env params, so you need to download the .json provided by Google Cloud Storage in /secret/google-storage.json

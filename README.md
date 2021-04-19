## Containers

### GraphQL

A Serverless project to create an API Gateway and Lambda function to access the Hasura API via a _/graphql_ endpoint. The Lambda currently adds a couple Hasura specific headers and passes the request directly to Hasura.

TODO: 

- Use code-gen for specific user roles
- Add schema validation based on user

### Dev-Container

This is a work horse container, it has access to generate dummy data and post it directly to the database.

### GraphQL-Engine

A Hasura container.

### Postgres

A Postgres DB container.


### Getting started

#### Making requests

POST `http://0.0.0.0:3000/dev/graphql`

_Example GraphQL Request:

```graphql
query MyQuery {
  files(order_by: {created_at: asc}, limit: 100) {
    id
    filename
  }
}
```

### Handy SQL Commands for debugging and resetting data

Remove all data, reset Auto-Increment ID:

```sql
TRUNCATE <table name> RESTART IDENTITY;
```

Get the total count of rows :

```sql
SELECT COUNT(*) FROM <table name>;
```

Exporting Database Schema:

```bash
pg_dump -c -v -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB > example.sql
```

**OR**

```bash
pg_dump -c -v postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/$POSTGRES_DB > example.sql
```
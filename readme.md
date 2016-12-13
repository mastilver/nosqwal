# nosqwal [![Build Status](https://travis-ci.org/mastilver/nosqwal.svg?branch=master)](https://travis-ci.org/mastilver/nosqwal) [![Coverage Status](https://coveralls.io/repos/github/mastilver/nosqwal/badge.svg?branch=master)](https://coveralls.io/github/mastilver/nosqwal?branch=master)

> Low level ODM library


## Install

```
$ npm install --save nosqwal-memory
```

## Adapters

- [In memory](https://www.npmjs.com/package/nosqwal-memory)
- [Couchbase](https://github.com/mastilver/nosqwal-couchbase)
- [OrientDb](https://github.com/mastilver/nosqwal-orientdb)

## Usage

```js
const nosqwal = require('nosqwal-memory');
const db = nosqwal();

const userCollection = db.defineCollection('user');

userCollection.create({
    username: 'Alice',
    password: '*****'
})
.then(alice => {
    return userCollection.query(
        where: {
            username: {
                $eq: 'Alice'
            }
        },
        limit: 1
    });
})
.then(users => {
    console.log(users[0].username);
    //=> 'Alice'
});
```


## API


### const db = nosqwal([options])

#### options

Type: `Object`<br>
Default: `{}`

Options needed to customize your nosqwal instance, they are different for each nosqwal adapters


### const collection = db.defineCollection(collectionName)

#### collectionName

Type: `string`

Name of the collection

### collection.create(document);

Retuns a Promise that resolve to the newly created document
The property `id` is added to that document

#### document

Type: `Object`<br>

The document that will be created


### collection.get(documentId)

Returns a Promise that resolve to the requested document

#### documentId

The unique identifier of the document to retrieve

### collection.update(document)

Returns a Promise that resolve to the updated document

Type: `string`

#### document

The object that will replace the current document stored in the database

##### document.id

The unique identifier of the document to update


### collection.query({ where, orderBy, limit, offset })

Returns a Promise that resolve in an array of the requested document

#### where

Type: `Object`

##### where[key] = whereClause

###### key

Type: `string`

Key or path of field to match

Key could also be one of the following for more complex query:
- `$not`
- `$and`
- `$or`

###### whereClause

Type: `object`

WhereClause define the where clause for a field. WhereClause can also be the same as `where` for more complex query.

###### whereClause[operator] = value

Operator can be:

| operator | description | `value` type | data type |
|----------|-------------|--------------|-----------|
| `$eq` | equal to | `any` | `any` |
| `$ne` | not equal to | `any` | `any` |
| `$gt` | gretter than | `string`,`number`,`Date` | `string`,`number`,`Date` |
| `$gte` | gretter or equal to | `string`,`number`,`Date` | `string`,`number`,`Date` |
| `$lt` | lower than | `string`,`number`,`Date` | `string`,`number`,`Date` |
| `$lte` | lower or equal to | `string`,`number`,`Date` | `string`,`number`,`Date` |
| `$contains` | string contains substring | `string` | `string` |
| `$in` | array contains value | `any` | `Array` |
| `$nin` | array do not contains value | `any` | `Array` |
| `$len` | array length equal | `number` | `Array` |

#### orderBy

Type: `array`<br>
Default: []

##### orderBy[][0]

Type: `string`<br>

Path / key to order

##### orderBy[][1]

Is ascending

Type: `bool`<br>
Default: `true`

#### limit

Type: `number`<br>
Default: `undefined`

How many documents will be returned

#### offset

Type: `number`<br>
Default: `0`

## License

MIT © [Thomas Sileghem](http://mastilver.com)

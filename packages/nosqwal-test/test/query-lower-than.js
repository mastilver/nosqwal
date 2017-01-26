import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('query with $lt condition using numbers', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob',
        age: 23
    });

    await userCollection.create({
        name: 'alice',
        age: 24
    });

    await userCollection.create({
        name: 'carlos',
        age: 25
    });

    const users = await userCollection.query({
        where: {
            age: {$lt: 24}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'bob'));
});

test('query with $lte condition using numbers', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob',
        age: 23
    });

    await userCollection.create({
        name: 'alice',
        age: 24
    });

    await userCollection.create({
        name: 'carlos',
        age: 25
    });

    const users = await userCollection.query({
        where: {
            age: {$lte: 24}
        }
    });

    t.is(users.length, 2);
    t.truthy(users.find(x => x.name === 'bob'));
    t.truthy(users.find(x => x.name === 'alice'));
});

test('query with $lt condition using strings', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'aaa'
    });

    await userCollection.create({
        name: 'aab'
    });

    await userCollection.create({
        name: 'bbb'
    });

    const users = await userCollection.query({
        where: {
            name: {$lt: 'aab'}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'aaa'));
});

test('query with $lte condition using strings', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'aaa'
    });

    await userCollection.create({
        name: 'aab'
    });

    await userCollection.create({
        name: 'bbb'
    });

    const users = await userCollection.query({
        where: {
            name: {$lte: 'aab'}
        }
    });

    t.is(users.length, 2);
    t.truthy(users.find(x => x.name === 'aaa'));
    t.truthy(users.find(x => x.name === 'aab'));
});

test('query with $lt condition using Date', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob',
        birthday: new Date(1995, 10, 10)
    });

    await userCollection.create({
        name: 'alice',
        birthday: new Date(1994, 10, 10)
    });

    await userCollection.create({
        name: 'carlos',
        birthday: new Date(1993, 10, 10)
    });

    const users = await userCollection.query({
        where: {
            birthday: {$lt: new Date(1994, 10, 10)}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'carlos'));
});

test('query with $lte condition using Date', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob',
        birthday: new Date(1995, 10, 10)
    });

    await userCollection.create({
        name: 'alice',
        birthday: new Date(1994, 10, 10)
    });

    await userCollection.create({
        name: 'carlos',
        birthday: new Date(1993, 10, 10)
    });

    const users = await userCollection.query({
        where: {
            birthday: {$lte: new Date(1994, 10, 10)}
        }
    });

    t.is(users.length, 2);
    t.truthy(users.find(x => x.name === 'carlos'));
    t.truthy(users.find(x => x.name === 'alice'));
});

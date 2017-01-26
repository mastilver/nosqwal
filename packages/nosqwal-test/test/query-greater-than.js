import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('query with $gt condition using numbers', async t => {
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
            age: {$gt: 24}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'carlos'));
});

test('query with $gte condition using numbers', async t => {
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
            age: {$gte: 24}
        }
    });

    t.is(users.length, 2);
    t.truthy(users.find(x => x.name === 'carlos'));
    t.truthy(users.find(x => x.name === 'alice'));
});

test('query with $gt condition using strings', async t => {
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
            name: {$gt: 'aab'}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'bbb'));
});

test('query with $gte condition using strings', async t => {
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
            name: {$gte: 'aab'}
        }
    });

    t.is(users.length, 2);
    t.truthy(users.find(x => x.name === 'bbb'));
    t.truthy(users.find(x => x.name === 'aab'));
});

test('query with $gt condition using Date', async t => {
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
            birthday: {$gt: new Date(1994, 10, 10)}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'bob'));
});

test('query with $gte condition using Date', async t => {
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
            birthday: {$gte: new Date(1994, 10, 10)}
        }
    });

    t.is(users.length, 2);
    t.truthy(users.find(x => x.name === 'bob'));
    t.truthy(users.find(x => x.name === 'alice'));
});

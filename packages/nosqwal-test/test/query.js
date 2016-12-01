import test from 'ava';

const noSqwal = global.noSqwalAdaptor;

test('query all documents', async t => {
    const db = noSqwal();
    const userCollection = db.defineCollection('user');

    await userCollection.create({
        name: 'bob'
    });

    await userCollection.create({
        name: 'alice'
    });

    const users = await userCollection.query();

    t.is(users.length, 2);
    t.truthy(users.find(x => x.name === 'bob'));
    t.truthy(users.find(x => x.name === 'alice'));
});

test('query with eq condition', async t => {
    const db = noSqwal();
    const userCollection = db.defineCollection('user');

    await userCollection.create({
        name: 'bob'
    });

    await userCollection.create({
        name: 'alice'
    });

    const users = await userCollection.query({
        where: {
            name: {$eq: 'alice'}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'alice'));
});

test('query with ascending sorting', async t => {
    const db = noSqwal();
    const userCollection = db.defineCollection('user');

    await userCollection.create({
        name: 'bob'
    });

    await userCollection.create({
        name: 'alice'
    });

    const users = await userCollection.query({
        orderBy: [
            ['name', true]
        ]
    });

    t.is(users.length, 2);
    t.is(users[0].name, 'alice');
    t.is(users[1].name, 'bob');
});

test('query with descending sorting', async t => {
    const db = noSqwal();
    const userCollection = db.defineCollection('user');

    await userCollection.create({
        name: 'bob'
    });

    await userCollection.create({
        name: 'alice'
    });

    const users = await userCollection.query({
        orderBy: [
            ['name', false]
        ]
    });

    t.is(users.length, 2);
    t.is(users[0].name, 'bob');
    t.is(users[1].name, 'alice');
});

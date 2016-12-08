import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('query all documents', async t => {
    const userCollection = getCollection();

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
    const userCollection = getCollection();

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

test('query with ascending ordering', async t => {
    const userCollection = getCollection();

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

test('query with descending ordering', async t => {
    const userCollection = getCollection();

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

test('query only the first 10 documents', async t => {
    const userCollection = getCollection();

    await Promise.all([...Array(100)].map((_, i) => {
        return userCollection.create({
            name: `user-${i < 10 ? '0' + i : i}`
        });
    }));

    const users = await userCollection.query({
        limit: 10,
        orderBy: [
            ['name']
        ]
    });

    t.is(users.length, 10);
    t.is(users[0].name, 'user-00');
    t.is(users[9].name, 'user-09');
});

test('query only 10 documents using offset', async t => {
    const userCollection = getCollection();

    await Promise.all([...Array(100)].map((_, i) => {
        return userCollection.create({
            name: `user-${i < 10 ? '0' + i : i}`
        });
    }));

    const users = await userCollection.query({
        limit: 10,
        offset: 15,
        orderBy: [
            ['name']
        ]
    });

    t.is(users.length, 10);
    t.is(users[0].name, 'user-15');
    t.is(users[9].name, 'user-24');
});

test('query only 10 documents using offset and descending order', async t => {
    const userCollection = getCollection();

    await Promise.all([...Array(100)].map((_, i) => {
        return userCollection.create({
            name: `user-${i < 10 ? '0' + i : i}`
        });
    }));

    const users = await userCollection.query({
        limit: 10,
        offset: 15,
        orderBy: [
            ['name', false]
        ]
    });

    t.is(users.length, 10);
    t.is(users[0].name, 'user-84');
    t.is(users[9].name, 'user-75');
});

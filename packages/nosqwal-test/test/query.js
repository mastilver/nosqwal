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

test('query with multiple conditions', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob',
        surname: 'smith'
    });

    await userCollection.create({
        name: 'bob',
        surname: 'may'
    });

    await userCollection.create({
        name: 'alice',
        surname: 'parks'
    });

    const users = await userCollection.query({
        where: {
            name: {$eq: 'bob'},
            surname: {$eq: 'smith'}
        }
    });

    t.is(users.length, 1);
    t.is(users[0].name, 'bob');
    t.is(users[0].surname, 'smith');
});

test('query using wrong operator', async t => {
    const userCollection = getCollection();

    await t.throws(userCollection.query({
        where: {
            name: 'bob'
        }
    }));
});

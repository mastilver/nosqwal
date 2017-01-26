import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('query with ne condition', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob'
    });

    await userCollection.create({
        name: 'alice'
    });

    const users = await userCollection.query({
        where: {
            name: {$ne: 'alice'}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'bob'));
});

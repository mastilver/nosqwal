import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('using $in operator', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob'
    });

    await userCollection.create({
        name: 'alice'
    });

    await userCollection.create({
        name: 'carlos'
    });

    const users = await userCollection.query({
        where: {
            name: {$in: ['bob', 'alice']}
        }
    });

    t.is(users.length, 2);
    t.truthy(users.find(x => x.name === 'bob'));
    t.truthy(users.find(x => x.name === 'alice'));
});

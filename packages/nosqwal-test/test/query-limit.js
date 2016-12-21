import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('query only 5 items', async t => {
    const userCollection = getCollection();

    await Promise.all([...Array(10)].reduce(arr => {
        return arr.concat([
            userCollection.create({
                name: `bob`
            }),
            userCollection.create({
                name: `alice`
            })
        ]);
    }, []));

    const users = await userCollection.query({
        where: {
            name: {$eq: 'alice'}
        },
        limit: 15
    });

    t.is(users.length, 10);
    t.falsy(users.find(x => x.name === 'bob'));
});

import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('create, get, update, delete', async t => {
    const userCollection = getCollection();

    const savedUser = await userCollection.create({
        name: 'alice'
    });

    const user = await userCollection.get(savedUser.id);

    t.is(user.id, savedUser.id);
    t.is(user.name, 'alice');

    user.name = 'bob';

    const notUpdatedUser = await userCollection.get(user.id);

    t.is(notUpdatedUser.name, 'alice');

    await userCollection.update(user);
    const updatedUser = await userCollection.get(user.id);

    t.is(updatedUser.name, 'bob');

    await userCollection.delete(user.id);

    await t.throws(userCollection.get(user.id));
});

test('create should override id', async t => {
    const userCollection = getCollection();

    const savedUser = await userCollection.create({
        id: 'user-1',
        name: 'alice'
    });

    t.not(savedUser.id, 'user-1');

    const user = await userCollection.get(savedUser.id);

    t.not(user.id, 'user-1');
    t.is(user.name, 'alice');
});

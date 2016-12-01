import test from 'ava';

const noSqwal = global.noSqwalAdaptor;

test('create, get, update, delete', async t => {
    const db = noSqwal();
    const userCollection = db.defineCollection('user');

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

    console.log(updatedUser);

    t.is(updatedUser.name, 'bob');

    await userCollection.delete(user.id);

    await t.throws(userCollection.get(user.id));
});

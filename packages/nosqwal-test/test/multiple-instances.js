import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

test('perform actions accross muliple instance of the same collection', async t => {
    const db = noSqwal();
    const name = cuid();

    const instance1 = db.defineCollection(name);
    const instance2 = db.defineCollection(name);

    const savedUser = await instance1.create({
        name: 'alice'
    });

    const user = await instance2.get(savedUser.id);

    t.is(user.name, 'alice');
});

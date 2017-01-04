import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

test('perform actions accross muliple instance of the same collection', async t => {
    const db = noSqwal();
    const name = cuid();

    const instance1 = db.defineCollection(name);
    const instance2 = db.defineCollection(name);

    const savedUser1 = await instance1.create({
        name: 'alice'
    });

    const savedUser2 = await instance2.create({
        name: 'bob'
    });

    t.is((await instance2.get(savedUser1.id)).name, 'alice');
    t.is((await instance1.get(savedUser2.id)).name, 'bob');
});

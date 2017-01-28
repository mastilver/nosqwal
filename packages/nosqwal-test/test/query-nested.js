import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('query on nested property', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob',
        level1: {
            level2: {
                level3: {
                    value: 1
                }
            }
        }
    });

    await userCollection.create({
        name: 'alice',
        level1: {
            level2: {
                level3: {
                    value: 2
                }
            }
        }
    });

    await userCollection.create({
        name: 'carlos',
        level1: {
            level2: {
                level3: {
                    value: 3
                }
            }
        }
    });

    const users = await userCollection.query({
        where: {
            'level1.level2.level3.value': {$eq: 1}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'bob'));
});

test('query on array', async t => {
    const userCollection = getCollection();

    await userCollection.create({
        name: 'bob',
        obj: {
            arr: [
                {
                    arr: [
                        {
                            value: 1
                        }
                    ]
                },
                {
                    arr: [
                        {
                            value: 2
                        }
                    ]
                }
            ]
        }
    });

    await userCollection.create({
        name: 'alice',
        obj: {
            arr: []
        }
    });

    await userCollection.create({
        name: 'carlos',
        obj: {
            arr: [
                {
                    arr: [
                        {
                            value: 3
                        }
                    ]
                }
            ]
        }
    });

    const users = await userCollection.query({
        where: {
            'obj.arr[].arr[].value': {$eq: 2}
        }
    });

    t.is(users.length, 1);
    t.truthy(users.find(x => x.name === 'bob'));
});

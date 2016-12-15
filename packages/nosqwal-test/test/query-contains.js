import test from 'ava';
import cuid from 'cuid';

const noSqwal = global.noSqwalAdaptor;

function getCollection() {
    const db = noSqwal();
    return db.defineCollection(cuid());
}

test('using $in operator', async t => {
    const raceCollection = getCollection();

    await raceCollection.create({
        location: 'le mans',
        riders: [
            'Marc Marquez',
            'Jorge Lorenzo',
            'Valentino ROSSI'
        ]
    });

    await raceCollection.create({
        location: 'silverstone',
        riders: [
            'Jorge LORENZO',
            'Dani Pedrosa',
            'Valentino ROSSI'
        ]
    });

    const races = await raceCollection.query({
        where: {
            riders: {$contains: 'Marc Marquez'}
        }
    });

    t.is(races.length, 1);
    t.truthy(races.find(x => x.location === 'le mans'));
});

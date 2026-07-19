import syncDB from '../../tasks/sync-db.js';

describe('Pruebas en SyncDB', () => {
    test('Debe de ejecutar 2 veces', () => {

        syncDB();
        const times = syncDB();
        console.log("Se llamo: ", times);

        expect(times).toBe(2);
    });
});
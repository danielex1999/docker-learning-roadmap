import cron from 'node-cron';
import syncDB from './tasks/sync-db.js';

let times = 0;

console.log('Inicio');

cron.schedule('1-59/5 * * * * *', syncDB);
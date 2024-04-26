import { handler } from './index.mjs';
import fs from 'fs';

fs.readFile('./mocks/sns_notification.json', 'utf8', (err, data) => {
  if (err) {
    console.error('ERROR READING JSON', e);
  } else {
    let json = JSON.parse(data);
    handler(json).then(console.log).catch (console.error);
  }
})

import { DateTime } from 'luxon' // uncomment `declare module 'luxon'` in index.d.ts

const dt = DateTime.local()
  .plus({hours: 3, minutes: 2})
  .minus({days: 7})
  .startOf('day')
  .endOf('hour');

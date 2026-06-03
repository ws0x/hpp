import * as migration_20260603_101216 from './20260603_101216';

export const migrations = [
  {
    up: migration_20260603_101216.up,
    down: migration_20260603_101216.down,
    name: '20260603_101216'
  },
];

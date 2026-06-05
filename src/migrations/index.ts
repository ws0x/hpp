import * as migration_20260603_101216 from './20260603_101216';
import * as migration_20260605_092753_add_recommendations_usecases_clientlogos from './20260605_092753_add_recommendations_usecases_clientlogos';

export const migrations = [
  {
    up: migration_20260603_101216.up,
    down: migration_20260603_101216.down,
    name: '20260603_101216',
  },
  {
    up: migration_20260605_092753_add_recommendations_usecases_clientlogos.up,
    down: migration_20260605_092753_add_recommendations_usecases_clientlogos.down,
    name: '20260605_092753_add_recommendations_usecases_clientlogos'
  },
];

import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import {
  ENV,
  LOCAL_DB_NAME,
  MY_PROFILES_COLLECTION,
} from 'react-native-dotenv';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

import localProfileSchema from '../db/schema/my-profiles.rxdb';

if (!LOCAL_DB_NAME) {
  throw new Error('LOCAL_DB_NAME not defined');
}

if (!MY_PROFILES_COLLECTION) {
  throw new Error('MY_PROFILES_COLLECTION not defined');
}

export const profileCollectionName = MY_PROFILES_COLLECTION;

const isDevelopment = ENV === 'development';

const initLocalDb = async () => {
  if (isDevelopment) {
    await addRxPlugin(RxDBDevModePlugin);
  }

  let db;

  try {
    console.log('Initializing database...');
    db = await createRxDatabase({
      name: LOCAL_DB_NAME,
      storage: getRxStorageMemory(),
      multiInstance: false,
      ignoreDuplicate: true,
    });
    console.log('Database initialized!');
  } catch (err) {
    console.log('ERROR CREATING DATABASE', err);
  }

  try {
    console.log('Adding collections...');
    // @ts-ignore - shema definition is not typed correctly
    await db.addCollections({
      [profileCollectionName]: {
        schema: localProfileSchema,
      },
    });
    console.log('Collection added!');
  } catch (err) {
    console.log('ERROR CREATING COLLECTION', err);
  }

  return db;
};

export default initLocalDb;

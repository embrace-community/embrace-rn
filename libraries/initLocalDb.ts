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
import { Polybase } from '@polybase/client';

if (!LOCAL_DB_NAME) {
  throw new Error('LOCAL_DB_NAME not defined');
}

if (!MY_PROFILES_COLLECTION) {
  throw new Error('MY_PROFILES_COLLECTION not defined');
}

export const profileCollectionName = MY_PROFILES_COLLECTION;

const isDevelopment = ENV === 'development';

const initLocalDb = async (polybase: Polybase) => {
  console.log('Initializing local database...');
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

  try {
    const pbProfileCollection = polybase.collection('Profile');

    db[profileCollectionName].insert$.subscribe((changeEvent) => {
      console.log('INSERTED TO PROFILE');
      console.log(changeEvent);

      // We don't sync to Polybase here, as we only want to sync once the metadataCid is available
    });
    db[profileCollectionName].update$.subscribe(async (changeEvent) => {
      console.log('UPDATE TO PROFILE');
      console.log(changeEvent.documentData);

      const document = changeEvent.documentData;

      try {
        // We must have a metadata CID before syncing to Polybase
        if (document && document.metadataUri) {
          const profile = await pbProfileCollection
            .record(document.handle)
            .get();

          if (profile.exists()) {
            const updateData = [document.displayName, document.metadataUri];

            if (document.avatarUri) {
              updateData.push(document.avatarUri);
            }

            profile
              .call('update', updateData)
              .then(() => {
                console.log(
                  'Profile updated in Polybase',
                  document.handle,
                  updateData,
                );
              })
              .catch((err) => {
                console.log('ERROR UPDATING PROFILE IN POLYBASE', err);
              });
          } else {
            const newProfile = pbProfileCollection.create([
              document.handle,
              document.displayName,
              document.metadataUri,
              document.avatarUri,
            ]);

            console.log('Profile created in Polybase', newProfile);
          }
        } else {
          console.log('Profile metadata CID not available yet');
        }
      } catch (err) {
        console.log('ERROR SYNCING PROFILE TO POLYBASE', err);
      }
    });
    db[profileCollectionName].remove$.subscribe((changeEvent) => {
      console.log('DELETE FROM PROFILE');
      console.log(changeEvent);
    });
  } catch (err) {
    console.log('ERROR SUBSCRIBING Profile', err);
  }

  return db;
};

export default initLocalDb;

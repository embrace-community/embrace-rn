import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import {
  ENV,
  DEV_ACCOUNT_ADDRESS,
  LOCAL_DB_NAME,
  MY_PROFILES_COLLECTION,
} from 'react-native-dotenv';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

import localProfileSchema from './schema/my-profiles.rxdb';
import { Polybase } from '@polybase/client';
import { isMnemonicSet } from '../libraries/Account';

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

    // During development - if profiles is empty, add a default profile (if a mnemonic is available)
    if (ENV === 'development') {
      const profiles = await db[profileCollectionName].find().exec();
      const _isMnemonicSet = isMnemonicSet();

      if (profiles.length === 0 && _isMnemonicSet) {
        await db[profileCollectionName].insert({
          handle: 'martinopensky',
          displayName: 'Martin',
          address: DEV_ACCOUNT_ADDRESS,
          localAvatarUri:
            'file:///var/mobile/Containers/Data/Application/DA0645CD-BD87-4CE4-B6DF-438E1E6EE24F/Library/Caches/ExponentExperienceData/%2540martinopensky%252Fembrace-rn/ImageManipulator/9634E974-E12A-4B5B-9F0C-15743F393BA0.jpg',
        });
      }
    }

    console.log('Collection added!');
  } catch (err) {
    console.log('ERROR CREATING COLLECTION', err);
  }

  try {
    const pbProfileCollection = polybase.collection('Profile');

    db[profileCollectionName].insert$.subscribe((changeEvent) => {
      console.log('INSERTED TO PROFILE');
      // console.log(changeEvent);

      // We don't sync to Polybase here, as we only want to sync once the metadataCid is available
    });
    db[profileCollectionName].update$.subscribe(async (changeEvent) => {
      console.log('UPDATE TO PROFILE');
      // console.log(changeEvent.documentData);

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

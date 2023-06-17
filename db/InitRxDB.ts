import { RxDatabase, addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import {
  ENV,
  DEV_ACCOUNT_ADDRESS,
  LOCAL_DB_NAME,
  LOCAL_DB_COLLECTION_MY_PROFILES,
} from 'react-native-dotenv';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

import localProfileSchema from './schema/my-profiles.rxdb';
import { Polybase } from '@polybase/client';
import { isMnemonicSet } from '../libraries/Account';
import { createProfile } from '../libraries/contracts/ProfileContract';
import {
  setTokenId,
  updateProfile,
} from '../libraries/polybase/ProfileCollection';

if (!LOCAL_DB_NAME) {
  throw new Error('LOCAL_DB_NAME not defined');
}

if (!LOCAL_DB_COLLECTION_MY_PROFILES) {
  throw new Error('LOCAL_DB_COLLECTION_MY_PROFILES not defined');
}

export const profileCollectionName = LOCAL_DB_COLLECTION_MY_PROFILES;

const isDevelopment = ENV === 'development';

let rxDb: RxDatabase;
let polybase: Polybase;

const initLocalDb = async (_polybase: Polybase) => {
  console.log('Initializing local database...');
  if (isDevelopment) {
    await addRxPlugin(RxDBDevModePlugin);
  }

  try {
    console.log('Initializing database...');

    rxDb = await createRxDatabase({
      name: LOCAL_DB_NAME,
      storage: getRxStorageMemory(),
      multiInstance: false,
      ignoreDuplicate: true,
    });

    polybase = _polybase;
    console.log('Database initialized!');
  } catch (err) {
    console.log('ERROR CREATING DATABASE', err);
  }

  try {
    console.log('Adding collections...');

    if (!rxDb[profileCollectionName]) {
      // @ts-ignore - shema definition is not typed correctly
      await rxDb.addCollections({
        [profileCollectionName]: {
          schema: localProfileSchema,
        },
      });
    } else {
      console.log('Profile Collection already exists');
    }

    console.log('Collection added!');
  } catch (err) {
    console.log('ERROR CREATING COLLECTION', err);
  }

  subscribeToEvents();

  return rxDb;
};

const subscribeToEvents = async () => {
  try {
    console.log('Subscribing to events...');

    rxDb[profileCollectionName].insert$.subscribe((changeEvent) => {
      console.log('INSERTED TO PROFILE');
    });

    rxDb[profileCollectionName].update$.subscribe(async (changeEvent) => {
      console.log('UPDATE TO PROFILE');

      const document = changeEvent.documentData;

      // We must have a metadata CID before syncing to Polybase & minting NFT
      if (document && document.metadataUri && !document.tokenId) {
        try {
          // Mint profile NFT
          createProfile(
            document.handle,
            document.metadataUri.replace('ipfs://', ''),
          ).then(() => {
            console.log(
              'Profile created:',
              document.handle,
              document.metadataUri.replace('ipfs://', ''),
            );
          });

          // Sync to Polybase
          updateProfile(polybase, document);
        } catch (err) {
          console.log('ERROR SYNCING PROFILE TO POLYBASE', err);
        }
      } else {
        console.log('Profile metadata CID not available yet');
      }

      // Now we have the tokenId, we can sync to Polybase
      if (document && document.metadataUri && document.tokenId) {
        setTokenId(polybase, document.handle, document.tokenId);
      }
    });
  } catch (err) {
    console.log('ERROR SUBSCRIBING Profile', err);
  }
};

export default initLocalDb;

/*

// During development - if profiles is empty, add a default profile (if a mnemonic is available)
    if (ENV === 'development') {
      const profiles = await rxDb[profileCollectionName].find().exec();
      const _isMnemonicSet = isMnemonicSet();

      // Should only run if there are no profiles and a mnemonic has been set to storage
      if (profiles.length === 0 && _isMnemonicSet) {
        console.log('InitRxDB: Creating default profile...');
        await rxDb[profileCollectionName].insert({
          account: {
            number: 1,
            address: DEV_ACCOUNT_ADDRESS,
          },
          handle: 'martinopensky',
          displayName: 'Martin',
          localAvatarUri:
            'file:///var/mobile/Containers/Data/Application/DA0645CD-BD87-4CE4-B6DF-438E1E6EE24F/Library/Caches/ExponentExperienceData/%2540martinopensky%252Fembrace-rn/ImageManipulator/9634E974-E12A-4B5B-9F0C-15743F393BA0.jpg',
        });
      }
    }*/

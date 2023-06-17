import React, { useContext, useEffect, useState } from 'react';
import { getActiveAccount } from '../libraries/Account';
import { RxDbContext } from '../db/RxDbProvider';

import { LOCAL_DB_COLLECTION_MY_PROFILES } from 'react-native-dotenv';

type AccountProfile = {
  address: string;
  avatarUri: string;
  displayName: string;
  handle: string;
};

export default function useActiveProfile() {
  const rxDb = useContext(RxDbContext);
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountProfile, setAccountProfile] = useState<AccountProfile>(null);

  useEffect(() => {
    async function _getActiveAccount() {
      const _activeAccount = await getActiveAccount();
      setAccountAddress(_activeAccount.address);
    }

    _getActiveAccount();
  }, []);

  useEffect(() => {
    async function accountProfile() {
      if (!rxDb || !accountAddress) return;

      const _profile = await rxDb[LOCAL_DB_COLLECTION_MY_PROFILES].findOne({
        selector: {
          ['account.address']: {
            $eq: accountAddress,
          },
        },
      }).exec();

      console.log('Profile', _profile, accountAddress);

      setAccountProfile(_profile);
    }

    accountProfile();
  }, [rxDb, accountAddress]);

  return accountProfile;
}

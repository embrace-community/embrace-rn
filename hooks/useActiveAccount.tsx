import React, { useContext, useEffect, useState } from 'react';
import { getActiveAccount } from '../libraries/Wallet';
import { LocalDbContext } from '../libraries/LocalDbProvider';

import { MY_PROFILES_COLLECTION } from 'react-native-dotenv';

type AccountProfile = {
  address: string;
  avatarUri: string;
  displayName: string;
  handle: string;
};

export default function useActiveAccount() {
  const localDb = useContext(LocalDbContext);
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountProfile, setAccountProfile] = useState<AccountProfile>(null);

  useEffect(() => {
    async function getActiveAccountAsync() {
      const _accountAddress = await getActiveAccount();
      setAccountAddress(_accountAddress);
    }

    getActiveAccountAsync();
  }, []);

  useEffect(() => {
    async function accountProfile() {
      if (!localDb || !accountAddress) return;

      const _profile = await localDb[MY_PROFILES_COLLECTION].findOne({
        selector: {
          address: accountAddress,
        },
      }).exec();

      console.log('Profile', _profile, accountAddress);

      setAccountProfile(_profile);
    }

    accountProfile();
  }, [localDb, accountAddress]);

  return accountProfile;
}

// Imports for polybase
import { Polybase } from '@polybase/client';
import { POLYBASE_NAMESPACE } from 'react-native-dotenv';
import { ethPersonalSign } from '@polybase/eth';
import { WalletKeys } from './Wallet';

// TODO: Use MMKV Instead https://github.com/mrousavy/react-native-mmkv
import * as SecureStore from 'expo-secure-store';

export default function initPolybase() {
  console.log('Initializing polybase...', POLYBASE_NAMESPACE);

  const polybase = new Polybase({
    defaultNamespace: POLYBASE_NAMESPACE ?? null,
  });

  polybase.signer(async (data: string) => {
    const currentAccount = 0; // Should be read from state
    const accountKey = WalletKeys.ACCOUNT.replace(
      '%s',
      currentAccount.toString(),
    );

    console.log('accountKey', accountKey);

    const privateKey: any = await SecureStore.getItemAsync(accountKey);

    if (!privateKey) {
      console.log('No privateKey found');
      return;
    }

    return {
      h: 'eth-personal-sign',
      sig: ethPersonalSign(privateKey, data),
    };
  });

  return polybase;
}

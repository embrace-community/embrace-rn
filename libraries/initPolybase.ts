// Imports for polybase
import { Polybase } from '@polybase/client';
import { POLYBASE_NAMESPACE } from 'react-native-dotenv';
import { ethPersonalSign } from '@polybase/eth';

// TODO: Use MMKV Instead https://github.com/mrousavy/react-native-mmkv
import * as SecureStore from 'expo-secure-store';

export default function initPolybase() {
  const polybase = new Polybase({
    defaultNamespace: POLYBASE_NAMESPACE ?? null,
  });

  polybase.signer(async (data: string) => {
    const privateKey: any = await SecureStore.getItemAsync('wallet.privateKey');
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

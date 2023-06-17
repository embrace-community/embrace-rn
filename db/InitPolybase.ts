// Imports for polybase
import { Polybase } from '@polybase/client';
import { POLYBASE_NAMESPACE } from 'react-native-dotenv';
import { ethPersonalSign } from '@polybase/eth';
import { getAccountPrivateKey } from '../libraries/Account';

export default function initPolybase() {
  console.log('Initializing polybase...', POLYBASE_NAMESPACE);

  const polybase = new Polybase({
    defaultNamespace: POLYBASE_NAMESPACE ?? null,
  });

  polybase.signer(async (data: string) => {
    const privateKey: string | boolean = await getAccountPrivateKey();

    if (!privateKey) {
      console.log('InitPolybase: No privateKey found');
      return;
    }

    return {
      h: 'eth-personal-sign',
      sig: ethPersonalSign(privateKey, data),
    };
  });

  return polybase;
}

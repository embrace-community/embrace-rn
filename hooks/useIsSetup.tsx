import { useEffect, useState } from 'react';
import { isMnemonicSet } from '../libraries/Account';

export default function useIsSetup() {
  const [isSetup, setIsSetup] = useState<boolean>(null);

  // This is used to see whether an account has already been setup
  useEffect(() => {
    async function checkIfSetup() {
      const setup = await isMnemonicSet();

      console.log('Setup', setup);

      setIsSetup(setup);
    }

    checkIfSetup();
  }, []);

  return isSetup;
}

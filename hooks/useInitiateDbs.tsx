import { useEffect, useState } from 'react';
import initPolybase from '../libraries/initPolybase';
import initLocalDb from '../libraries/initLocalDb';

export default function useInitiateDbs() {
  const [db, setDb] = useState(null);

  const polybase = initPolybase();

  useEffect(() => {
    const initDb = async function () {
      const _db = await initLocalDb(polybase);
      setDb(_db);
    };

    initDb();
  }, []);

  return { db, polybase };
}

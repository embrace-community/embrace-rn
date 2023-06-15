import { useEffect, useState } from 'react';
import initPolybase from '../db/InitPolybase';
import initRxDb from '../db/InitRxDB';

export default function useInitiateDbs() {
  const [rxDb, setDb] = useState(null);

  const polybase = initPolybase();

  useEffect(() => {
    const _initRxDb = async function () {
      const _db = await initRxDb(polybase);
      setDb(_db);
    };

    _initRxDb();
  }, []);

  return { rxDb, polybase };
}

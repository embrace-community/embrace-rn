import React, { useCallback, useEffect, useState } from 'react';
// Imports for ethers
// TODO: Setup https://github.com/margelo/react-native-quick-crypto
import 'react-native-get-random-values';
import '@ethersproject/shims';

// Imports for react-navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import GettingStarted from './screens/getting-started/GettingStarted';
// import CreateAccount from './screens/getting-started/_CreateAccountPOC';
import CreateAccount from './screens/getting-started/CreateAccount';
import Home from './screens/user/Home';

// Polybase
import { PolybaseProvider } from '@polybase/react';
import initPolybase from './libraries/initPolybase';

import { LocalDbProvider } from './libraries/LocalDbProvider';
import initLocalDb from './libraries/initLocalDb';

const Stack = createNativeStackNavigator();

export default function App() {
  const [db, setDb] = useState(null);
  const polybase = initPolybase();

  const initDB = useCallback(async () => {
    const _db = await initLocalDb();
    setDb(_db);
  }, [setDb]);

  useEffect(() => {
    initDB();
  }, [initDB]);

  return (
    <LocalDbProvider localDb={db}>
      <PolybaseProvider polybase={polybase}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="GettingStarted" component={GettingStarted} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </PolybaseProvider>
    </LocalDbProvider>
  );
}

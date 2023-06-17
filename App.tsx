import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';

// Imports for ethers
// TODO: Setup https://github.com/margelo/react-native-quick-crypto
import 'react-native-get-random-values';
import '@ethersproject/shims';

// Imports for react-navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// DBs
import { PolybaseProvider } from '@polybase/react';
import { RxDbProvider } from './db/RxDbProvider';

import useInitiateDbs from './hooks/useInitiateDbs';

import { resetAccount } from './libraries/Account';
import MainStackScreen from './navigation/MainStack';
import SetupStackScreen from './navigation/SetupStack';
import useIsSetup from './hooks/useIsSetup';

const RootStack = createNativeStackNavigator();

// TODO: Remove - only For testing purposes
//resetAccount();

export default function App() {
  const { rxDb, polybase } = useInitiateDbs();
  const isSetup = useIsSetup();

  if (isSetup === null) return null;

  return (
    <RxDbProvider rxDb={rxDb}>
      <PolybaseProvider polybase={polybase}>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {isSetup === false && (
              <RootStack.Screen name="Setup" component={SetupStackScreen} />
            )}
            {isSetup === true && (
              <RootStack.Screen name="Main" component={MainStackScreen} />
            )}
          </RootStack.Navigator>
        </NavigationContainer>
      </PolybaseProvider>
    </RxDbProvider>
  );
}

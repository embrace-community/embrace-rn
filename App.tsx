import React from 'react';
// Imports for ethers
// TODO: Setup https://github.com/margelo/react-native-quick-crypto
import 'react-native-get-random-values';
import '@ethersproject/shims';

// Imports for react-navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import GettingStarted from './screens/getting-started/GettingStarted';
import CreateAccount from './screens/getting-started/CreateAccount';

// Polybase
import { PolybaseProvider } from '@polybase/react';
import initPolybase from './libraries/initPolybase';

const Stack = createNativeStackNavigator();

export default function App() {
  const polybase = initPolybase();

  return (
    <PolybaseProvider polybase={polybase}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="GettingStarted" component={GettingStarted} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
        </Stack.Navigator>
      </NavigationContainer>
    </PolybaseProvider>
  );
}

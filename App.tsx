import {
  Text,
  View,
  TouchableOpacity,
  Touchable,
  Button,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
// Imports for ethers
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
// Imports for react-navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  PolybaseProvider,
  usePolybase,
  useDocument,
  useCollection,
} from '@polybase/react';
import { Polybase } from '@polybase/client';

const polybase = new Polybase({
  // defaultNamespace: 'test',
  // baseURL: 'https://testnet.polybase.xyz/',
});

// Example
const isSetup = false;

function HomeScreen({ navigation, route }) {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold text-center text-gray-800">
        Open up App.tsx to start working on your app
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Landing');
        }}
      >
        <Text className="text-black">Back</Text>
      </TouchableOpacity>
    </View>
  );
}
function LandingScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-white p-2 gap-3">
      <Text className="text-2xl font-bold text-center text-gray-800">
        Landing
      </Text>
      <View className="flex items-center justify-center bg-violet-600 rounded-lg p-3 border-violet-100 border-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateAccount');
          }}
        >
          <Text className="text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold text-center text-gray-800">
        Settings
      </Text>
    </View>
  );
}

function CreateDefaultProfileScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <TouchableWithoutFeedback onPress={() => navigation.navigate('')}>
        <Text className="text-2xl font-bold text-center text-gray-800">
          Back
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );
}

function CreateAccountScreen({ navigation }) {
  const [wallet, setWallet] = useState(null);
  const [profile, setProfile] = useState(null);

  const createWallet = () => {
    setWallet(null);
    const w = ethers.Wallet.createRandom();
    console.log('address:', w.address);
    console.log('mnemonic:', w.mnemonic.phrase);
    console.log('privateKey:', w.privateKey);

    setWallet(w);
  };

  useEffect(() => {
    setTimeout(() => {
      createWallet();
    }, 500);
  }, []);

  const polybase = usePolybase();

  const { data, error, loading } = useDocument(
    polybase
      .collection('demo/social/users')
      .record('0x6b96f1a8d65ede8ad688716078b3dd79f9bd7323'),
  );

  if (error) {
    console.error('Polybase ERROR', error);
  }

  if (!loading && !error && data) {
    console.log('Polybase DATA', data?.data?.name);

    // setProfile(data.);
    // data.data.forEach((doc) => {
    //   console.log('Polybase DOC', doc);
    // });
  }

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      {!wallet ? (
        <Text className="text-2xl font-bold text-center text-gray-800">
          <ActivityIndicator size="small" color="#0000ff" />
        </Text>
      ) : (
        <Text className="text-2xl font-bold text-center text-gray-800">
          Account Created {wallet.address}
        </Text>
      )}

      {profile && (
        <Text className="text-2xl font-bold text-center text-gray-800">
          Profile {profile}
        </Text>
      )}
    </View>
  );
}

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PolybaseProvider polybase={polybase}>
      <NavigationContainer>
        {!isSetup ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
            />
            <Stack.Screen
              name="CreateDefaultProfile"
              component={CreateDefaultProfileScreen}
            />
          </Stack.Navigator>
        ) : (
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </PolybaseProvider>
  );
}

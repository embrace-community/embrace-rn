import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
// Imports for ethers
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
// Imports for react-navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PolybaseProvider, usePolybase } from '@polybase/react';
import { Polybase } from '@polybase/client';
import { DEV_PK } from 'react-native-dotenv';
import { ethPersonalSign } from '@polybase/eth';

const polybase = new Polybase({
  defaultNamespace:
    'pk/0x5cc781bd8fd60bfbfa01419fab101daa47db1964866f04e6e86a1b963d6ed28f003a51b1867296ae00fde14c5bc160cf0d20d3656f9597cfba32a9ca9883d83a/embrace-dev',
});

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
  const polybase = usePolybase();
  const [wallet, setWallet] = useState(null);
  const [profile, setProfile] = useState(null);
  const usersCollection = polybase.collection('User');

  const createWallet = () => {
    setWallet(null);

    if (DEV_PK) {
      const w = new ethers.Wallet(DEV_PK);
      console.log('address:', w.address);
      console.log('privateKey:', w.privateKey);
      setWallet(w);
      return;
    }

    const w = ethers.Wallet.createRandom();
    console.log('address:', w.address);
    console.log('mnemonic:', w.mnemonic.phrase);
    console.log('privateKey:', w.privateKey);
    setWallet(w);
  };

  const readProfile = useCallback(async () => {
    if (!wallet) return;

    const user = await usersCollection.record(wallet.address).get();

    if (user) {
      console.log('User', user);
      setProfile(user.data?.name);
    }
  }, [polybase, wallet]);

  const createProfile = useCallback(async () => {
    console.log('Creating profile');

    const user = await usersCollection.record(wallet.address).get();

    if (!user.exists()) {
      await usersCollection.create([wallet.address, 'John Doe']).catch((e) => {
        console.log('Error', e);
      });
    } else {
      console.log('User already exists');
    }

    console.log('User', user);
  }, [polybase, wallet]);

  const setProfileData = useCallback(async () => {
    console.log('Setting profile', wallet.address);
    const user = await usersCollection
      // .record(wallet.address)
      .record('0xdf7bF51177d1635e565B7Af469F5B20E555fA10B')
      .call('setUser', ['Me Myself and I TESTING'])
      .then((res) => {
        console.log('res', res);
      })
      .catch((e) => {
        console.log('Error', e);
      });

    readProfile();
  }, [polybase, wallet]);

  useEffect(() => {
    if (!wallet?.address) return;
    polybase.signer(async (data: string) => {
      return {
        h: 'eth-personal-sign',
        sig: ethPersonalSign(wallet.privateKey, data),
      };
    });
  }, [wallet]);

  useEffect(() => {
    setTimeout(() => {
      createWallet();
    }, 500);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      {!wallet ? (
        <Text className="text-2xl font-bold text-center text-gray-800">
          <ActivityIndicator size="small" color="#0000ff" />
        </Text>
      ) : (
        <>
          <Text className="text-2xl font-bold text-center text-gray-800">
            Account Created {wallet.address}
          </Text>
        </>
      )}

      {profile && (
        <Text className="text-md font-bold text-center text-gray-800">
          Profile {profile}
        </Text>
      )}

      <TouchableOpacity onPress={() => createProfile()}>
        <Text className="text-md m-4 font-bold text-center text-gray-800">
          Create
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setProfileData()}>
        <Text className="text-md m-4 font-bold text-center text-gray-800">
          Set Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
        <Text className="text-md font-bold text-center text-gray-800">
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PolybaseProvider polybase={polybase}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen
            name="CreateDefaultProfile"
            component={CreateDefaultProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PolybaseProvider>
  );
}

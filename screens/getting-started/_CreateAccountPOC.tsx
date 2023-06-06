import { useCallback, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ethers } from 'ethers';
import { usePolybase } from '@polybase/react';
import { DEV_PK } from 'react-native-dotenv';
// TODO: Use MMKV Instead https://github.com/mrousavy/react-native-mmkv
import * as SecureStore from 'expo-secure-store';

export default function CreateAccountScreen({ navigation }) {
  const polybase = usePolybase();
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const usersCollection = polybase.collection('User');

  const createWallet = async () => {
    setAccount(null);
    let w = null;

    if (DEV_PK) {
      w = new ethers.Wallet(DEV_PK);
    } else {
      w = ethers.Wallet.createRandom();
      await SecureStore.setItemAsync('wallet.mnemonic', w.mnemonic.phrase);
      console.log('mnemonic:', w.mnemonic.phrase);
    }

    if (w) {
      await SecureStore.setItemAsync('wallet.privateKey', w.privateKey);
      await SecureStore.setItemAsync('wallet.address', w.address);

      console.log('address:', w.address);
      console.log('privateKey:', w.privateKey);
      setAccount(w.address);
    }
  };

  const readProfile = useCallback(async () => {
    if (!account) return;

    const user = await usersCollection.record(account).get();

    if (user) {
      console.log('User', user);
      setProfile(user.data?.name);
    }
  }, [polybase, account]);

  const createProfile = useCallback(async () => {
    console.log('Creating profile');

    const user = await usersCollection.record(account).get();

    if (!user.exists()) {
      await usersCollection.create([account, 'John Doe']).catch((e) => {
        console.log('Error', e);
      });
    } else {
      console.log('User already exists');
    }

    console.log('User', user);
  }, [polybase, account]);

  const setProfileData = useCallback(async () => {
    console.log('Setting profile', account);
    await usersCollection
      .record(account)
      .call('setUser', ['Hello World'])
      .then((res) => {
        console.log('res', res);
      })
      .catch((e) => {
        console.log('Error', e);
      });

    readProfile();
  }, [polybase, account]);

  useEffect(() => {
    setTimeout(() => {
      createWallet();
    }, 500);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      {!account ? (
        <Text className="text-2xl font-bold text-center text-gray-800">
          <ActivityIndicator size="small" color="#0000ff" />
        </Text>
      ) : (
        <>
          <Text className="text-2xl font-bold text-center text-gray-800">
            Account Created {account}
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

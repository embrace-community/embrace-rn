import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

const logo = require('../../assets/images/logo.png');

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function Home({ navigation }: Props) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const getAccount = async () => {
      const account = await SecureStore.getItemAsync('wallet.address');
      setAccount(account);
    };

    getAccount();
  }, []);

  return (
    <SafeAreaView className="flex flex-1 items-center justify-center gap-3 bg-violet-100">
      <Image source={logo} style={{ width: 200, height: 200 }} />

      <Text className="text-center text-2xl font-bold text-gray-800">Home</Text>
      <Text className="px-8 text-center text-lg text-gray-600">
        Welcome to Embrace! {account}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text className="px-8 text-center text-lg text-gray-600">Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

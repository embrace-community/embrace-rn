import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect, useState } from 'react';
import { LocalDbContext } from '../../libraries/LocalDbProvider';
import { MY_PROFILES_COLLECTION } from 'react-native-dotenv';
import { FlatList } from 'react-native-gesture-handler';

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function Home({ navigation }: Props) {
  const [account, setAccount] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const localDb = useContext(LocalDbContext);

  useEffect(() => {
    async function localProfiles() {
      if (!localDb) return;

      const _profiles = await localDb[MY_PROFILES_COLLECTION].find().exec();

      console.log('profiles', _profiles);
      setProfiles(_profiles);
    }

    localProfiles();
  }, [localDb]);

  return (
    <SafeAreaView className="flex flex-1 items-center justify-center gap-3 bg-slate-100">
      <FlatList
        className="w-full flex-1 gap-3 px-5 py-8"
        data={profiles}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              await SecureStore.setItemAsync('activeProfile', item.address);
              navigation.navigate('Main', {
                screen: 'Account',
              });
            }}
          >
            <View className="h-24 justify-center rounded-xl border-slate-200 bg-white p-3">
              <Text className="px-8 text-center text-lg text-gray-600">
                {item.displayName}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.handle}
        ListEmptyComponent={() => (
          <Text className="px-8 text-center text-lg text-gray-600">
            No profiles found
          </Text>
        )}
      />

      {/* <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <Text className="px-8 text-center text-lg text-gray-600">
          To Account Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Community')}>
        <Text className="px-8 text-center text-lg text-gray-600">
          To Community
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

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
import { RxDbContext } from '../../db/RxDbProvider';
import { MY_PROFILES_COLLECTION } from 'react-native-dotenv';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function Home({ navigation }: Props) {
  const [profiles, setProfiles] = useState(null);
  const rxDb = useContext(RxDbContext);

  useEffect(() => {
    async function localProfiles() {
      if (!rxDb) return;

      const _profiles = await rxDb[MY_PROFILES_COLLECTION].find().exec();

      console.log('profiles', _profiles);
      setProfiles(_profiles);
    }

    localProfiles();
  }, [rxDb]);

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
            <View className="mx-2 h-36 flex-row items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-6">
              <View className="mr-1 h-28 w-28 items-center justify-center rounded-full text-center text-lg">
                {item.localAvatarUri ? (
                  <Image
                    className="h-28 w-28 rounded-full"
                    source={{
                      uri: item.localAvatarUri,
                    }}
                  />
                ) : (
                  <FontAwesome name="user" size={36} color={'grey'} />
                )}
              </View>
              <View className="h-full flex-1 items-start justify-center rounded-lg p-1">
                <Text className="px-4 text-center text-lg text-gray-600">
                  {item.displayName}
                </Text>
                <Text className="text-md px-4 text-center text-gray-600">
                  {item.handle}
                </Text>
              </View>
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
    </SafeAreaView>
  );
}

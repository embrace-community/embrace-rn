import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import { Text, SafeAreaView } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { RxDbContext } from '../../db/RxDbProvider';
import { LOCAL_DB_COLLECTION_MY_PROFILES } from 'react-native-dotenv';
import { FlatList } from 'react-native-gesture-handler';
import AccountCard from '../../components/AccountCard';

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function Home({ navigation }: Props) {
  const [profiles, setProfiles] = useState(null);
  const rxDb = useContext(RxDbContext);

  useEffect(() => {
    async function localProfiles() {
      if (!rxDb) return;

      const _profiles = await rxDb[
        LOCAL_DB_COLLECTION_MY_PROFILES
      ].find().exec();

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
          <AccountCard profile={item} navigation={navigation} />
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

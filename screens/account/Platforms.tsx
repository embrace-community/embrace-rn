import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';

import useActiveAccount from '../../hooks/useActiveAccount';
import Layout from './Layout';

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function Platforms({ navigation }: Props) {
  const profile = useActiveAccount();

  console.log('profile', profile);

  return (
    <Layout navigation={navigation} profile={profile}>
      <View className="flex flex-1 items-center gap-3 bg-slate-100">
        <Text className="px-8 text-center text-lg text-gray-600">
          Platforms page
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('Community')}>
          <Text className="px-8 text-center text-lg text-gray-600">
            Community Home
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import { Text, View, TouchableOpacity } from 'react-native';
import Layout from './Layout';

type NativeStackNavigationHelpersUpdate = NativeStackNavigationHelpers & {
  setOptions: (options: any) => void;
};

type Props = {
  navigation: NativeStackNavigationHelpersUpdate;
};

export default function Communities({ navigation }: Props) {
  return (
    <Layout navigation={navigation}>
      <View className="flex flex-1 items-center gap-3 bg-slate-100">
        <Text className="px-8 text-center text-lg text-gray-600">
          Communities page
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

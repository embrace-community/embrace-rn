import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';

const logo = require('../../assets/images/logo.png');

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function GettingStarted({ navigation }: Props) {
  return (
    <SafeAreaView className="flex flex-1 items-center justify-center bg-violet-100 gap-3">
      <Image source={logo} style={{ width: 200, height: 200 }} />

      <Text className="text-2xl font-bold text-center text-gray-800">
        Embrace Community
      </Text>
      <Text className="text-xl font-bold text-center text-gray-800">
        Your Platform, Your Community
      </Text>
      <Text className="text-lg text-center text-gray-800 px-12 mb-8 hidden">
        Enabling you to take ownership of your content & connect directly with
        your community.
      </Text>
      <Text className="text-lg text-center text-gray-800 px-12 mb-8">
        Empowering Creators to build their own communities.
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreateAccount');
        }}
      >
        <View className="items-center justify-center bg-violet-600 rounded-lg p-3 h-16 border-violet-100 drop-shadow-2xl border-2 mx-12 mt-10">
          <Text className="text-white">Get Started</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

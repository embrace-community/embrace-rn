import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import { Text, View, TouchableOpacity } from 'react-native';

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function GettingStarted({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-white p-2 gap-3">
      <Text className="text-2xl font-bold text-center text-gray-800">
        Landing
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreateAccount');
        }}
      >
        <View className="flex items-center justify-center bg-violet-600 rounded-lg p-3 border-violet-100 border-2">
          <Text className="text-white">Next</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

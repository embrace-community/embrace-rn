import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePolybase } from '@polybase/react';
import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function CreateAccount({ navigation }: Props) {
  // const polybase = usePolybase();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center p-2 pt-12 gap-3">
        <Text className="text-2xl font-bold">Create Account</Text>
        <TouchableOpacity onPress={() => navigation.navigate('GettingStarted')}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationHelpers;
  children: React.ReactNode;
  profile: any;
};

export default function Layout({ navigation, children, profile }: Props) {
  return (
    <SafeAreaView className="flex flex-1 gap-3 bg-white">
      <View className="flex w-full flex-row items-center bg-white">
        <TouchableOpacity
          className="absolute left-3 top-0 z-50"
          onPress={() => navigation.navigate('Root', { screen: 'User' })}
        >
          <View>
            <Text>
              <AntDesign name="close" size={24} color="black" />
            </Text>
          </View>
        </TouchableOpacity>
        {profile ? (
          <Text className="h-8 flex-1 text-center text-lg font-semibold">
            {profile?.displayName} ({profile?.handle})
          </Text>
        ) : (
          <Text className="h-8 flex-1 text-center text-lg font-semibold"></Text>
        )}
      </View>

      <View className="flex flex-1 items-center justify-center gap-3 bg-slate-100">
        {children}
      </View>
    </SafeAreaView>
  );
}

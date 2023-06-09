import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { setActiveAccount } from '../libraries/Account';

type Props = {
  profile: any;
  navigation: any;
};

export default function AccountCard({ profile, navigation }: Props) {
  return (
    <TouchableOpacity
      onPress={async () => {
        setActiveAccount(profile.account);
        navigation.navigate('Main', {
          screen: 'Account',
        });
      }}
    >
      <View className="mx-2 h-36 flex-row items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-6">
        <View className="mr-1 h-28 w-28 items-center justify-center rounded-full text-center text-lg">
          {profile.localAvatarUri ? (
            <Image
              className="h-28 w-28 rounded-full"
              source={{
                uri: profile.localAvatarUri,
              }}
            />
          ) : (
            <FontAwesome name="user" size={36} color={'grey'} />
          )}
        </View>
        <View className="h-full flex-1 items-start justify-center rounded-lg p-1">
          <Text className="px-4 text-center text-lg text-gray-600">
            {profile.displayName}
          </Text>
          <Text className="text-md px-4 text-center text-gray-600">
            {profile.handle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

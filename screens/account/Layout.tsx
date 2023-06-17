import { View, SafeAreaView } from 'react-native';
import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import useActiveProfile from '../../hooks/useActiveProfile';
import { useLayoutEffect } from 'react';

type NativeStackNavigationHelpersUpdate = NativeStackNavigationHelpers & {
  setOptions: (options: any) => void;
};

type Props = {
  navigation: NativeStackNavigationHelpersUpdate;
  children: React.ReactNode;
};

export default function Layout({ navigation, children }: Props) {
  const accountProfile = useActiveProfile();

  useLayoutEffect(() => {
    if (!accountProfile) return;

    navigation.setOptions({
      title: `${accountProfile?.displayName} (${accountProfile?.handle})`,
    });
  }, [accountProfile]);

  return (
    <SafeAreaView className="flex flex-1 gap-3 bg-white">
      <View className="flex flex-1 items-center justify-center gap-3 bg-slate-100">
        {children}
      </View>
    </SafeAreaView>
  );
}

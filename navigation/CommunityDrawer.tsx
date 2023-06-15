import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';

const CommunityDrawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="< Back to Communities"
        onPress={() =>
          props.navigation.navigate('Main', {
            screen: 'Account',
            params: { screen: 'Communities' },
          })
        }
        style={{ borderBottomColor: '#cacaca', borderBottomWidth: 1 }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function CommunityDrawerScreen() {
  return (
    <CommunityDrawer.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <Pressable onPress={navigation.toggleDrawer} className="ml-2 p-2">
            <FontAwesome name="navicon" size={24} color="black" />
          </Pressable>
        ),
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <CommunityDrawer.Screen name="Home" component={CommunityHome} />
      <CommunityDrawer.Screen name="Profile" component={EmptyScreen} />
      <CommunityDrawer.Screen name="Settings" component={EmptyScreen} />
    </CommunityDrawer.Navigator>
  );
}

type Props = {
  navigation: NativeStackNavigationHelpers;
};

function CommunityHome({ navigation }: Props) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Main', { screen: 'Account' })}
      >
        <Text>Go to Account</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmptyScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Empty Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Community')}>
        <Text>Community</Text>
      </TouchableOpacity>
    </View>
  );
}

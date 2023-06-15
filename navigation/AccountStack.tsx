import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, Text } from 'react-native';
import { AntDesign, FontAwesome, Fontisto } from '@expo/vector-icons';
import classNames from 'classnames';

import AccountHomeScreen from '../screens/account/Home';
import AccountPlatformsScreen from '../screens/account/Platforms';
import AccountCommunitiesScreen from '../screens/account/Communities';

const AccountStack = createBottomTabNavigator();

export default function AccountStackScreen() {
  return (
    <AccountStack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        tabBarShowLabel: false,
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.navigate('Main', { screen: 'User' })}
            className="ml-2 p-2"
          >
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
        ),
      })}
    >
      <AccountStack.Screen
        name="Home"
        component={AccountHomeScreen}
        options={() => ({
          tabBarIcon: ({ focused }) => (
            <Text
              className={classNames({
                'text-purple-700': focused,
              })}
            >
              <FontAwesome name="user" size={24} />
            </Text>
          ),
        })}
      />
      <AccountStack.Screen
        name="Platforms"
        component={AccountPlatformsScreen}
        options={() => ({
          tabBarIcon: ({ focused }) => (
            <Text
              className={classNames({
                'text-purple-700': focused,
              })}
            >
              <FontAwesome name="connectdevelop" size={24} />
            </Text>
          ),
        })}
      />
      <AccountStack.Screen
        name="Communities"
        component={AccountCommunitiesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text
              className={classNames({
                'text-purple-700': focused,
              })}
            >
              <Fontisto name="tent" size={24} />
            </Text>
          ),
        }}
      />
    </AccountStack.Navigator>
  );
}

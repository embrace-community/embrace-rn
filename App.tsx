import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';

// Imports for ethers
// TODO: Setup https://github.com/margelo/react-native-quick-crypto
import 'react-native-get-random-values';
import '@ethersproject/shims';

// Imports for react-navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import GettingStarted from './screens/getting-started/GettingStarted';
// import CreateAccount from './screens/getting-started/_CreateAccountPOC';
import CreateAccount from './screens/getting-started/CreateAccount';
import UserHome from './screens/user/Home';
import Platforms from './screens/account/Platforms';
import AccountHome from './screens/account/Home';
import Communities from './screens/account/Communities';

// Polybase
import { PolybaseProvider } from '@polybase/react';
import initPolybase from './libraries/initPolybase';

import { LocalDbProvider } from './libraries/LocalDbProvider';
import initLocalDb from './libraries/initLocalDb';
import { isMnemonicSet, resetAccount } from './libraries/Wallet';

import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Fontisto } from '@expo/vector-icons';
import classNames from 'classnames';
import { ENV } from 'react-native-dotenv';

const Stack = createNativeStackNavigator();

export default function App() {
  const [db, setDb] = useState(null);
  const [isSetup, setIsSetup] = useState(null);
  const polybase = initPolybase();

  // useEffect(() => {
  //   if (ENV === 'development') {
  //     resetAccount();
  //   }
  // }, []);

  // This is used to see whether an account has already been setup
  useEffect(() => {
    async function checkIfSetup() {
      const setup = await isMnemonicSet();

      console.log('Setup', setup);

      setIsSetup(setup);
    }

    checkIfSetup();
  }, []);

  useEffect(() => {
    const initDb = async function () {
      const _db = await initLocalDb(polybase);
      setDb(_db);
    };

    initDb();
  }, []);

  if (isSetup === null) {
    console.log('isSetup is null');
    return null;
  }

  const Tab = createBottomTabNavigator();

  function User({ navigation }: any) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Accounts" component={UserHome} />
      </Stack.Navigator>
    );
  }

  function Account({ navigation }: any) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={AccountHome}
          options={({ route }) => ({
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
        <Tab.Screen
          name="Platforms"
          component={Platforms}
          options={({ route }) => ({
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
        <Tab.Screen
          name="Communities"
          component={Communities}
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
      </Tab.Navigator>
    );
  }

  function CommunityHome({ navigation }: any) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Root', { screen: 'Account' })}
        >
          <Text>Go to Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function EmptyScreen({ navigation }) {
    return (
      <View>
        <Text>Empty Screen</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Community')}>
          <Text>Community</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Drawer = createDrawerNavigator();

  function Community({ navigation }) {
    return (
      <Drawer.Navigator
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <Pressable onPress={navigation.toggleDrawer} className="ml-2 p-2">
              <FontAwesome name="navicon" size={24} color="black" />
            </Pressable>
          ),
        })}
      >
        <Drawer.Screen name="CommunityHome" component={CommunityHome} />
        <Drawer.Screen name="CommunityProfile" component={EmptyScreen} />
        <Drawer.Screen name="CommunitySettings" component={EmptyScreen} />
      </Drawer.Navigator>
    );
  }

  function Root() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="User" component={User} />
        <Tab.Screen name="Account" component={Account} />
        <Stack.Screen name="Community" component={Community} />
      </Stack.Navigator>
    );
  }

  return (
    <LocalDbProvider localDb={db}>
      <PolybaseProvider polybase={polybase}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isSetup === false && (
              <>
                <Stack.Screen
                  name="GettingStarted"
                  component={GettingStarted}
                />
                <Stack.Screen name="CreateAccount" component={CreateAccount} />

                <Stack.Screen name="Root" component={Root} />
              </>
            )}
            {isSetup === true && <Stack.Screen name="Root" component={Root} />}
          </Stack.Navigator>
        </NavigationContainer>
      </PolybaseProvider>
    </LocalDbProvider>
  );
}

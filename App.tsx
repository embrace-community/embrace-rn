import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const isSetup = true;

type RootStackParamList = {
  Home: undefined;
  Landing: undefined;
};

function HomeScreen({ navigation, route }) {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold text-center text-gray-800">
        Open up App.tsx to start working on your app!
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Landing');
        }}
      >
        <Text className="text-black">Back</Text>
      </TouchableOpacity>
    </View>
  );
}
function LandingScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-white p-2 gap-3">
      <Text className="text-2xl font-bold text-center text-gray-800">
        Landing
      </Text>
      <View className="flex items-center justify-center bg-violet-600 rounded-lg p-3 border-violet-100 border-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}
        >
          <Text className="text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold text-center text-gray-800">
        Settings
      </Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {!isSetup ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

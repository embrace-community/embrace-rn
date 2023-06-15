import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GettingStartedScreen from '../screens/getting-started/GettingStarted';
import CreateAccountScreen from '../screens/getting-started/CreateAccount';
import MainStackScreen from './MainStack';

const SetupStack = createNativeStackNavigator();

export default function SetupStackScreen() {
  return (
    <SetupStack.Navigator screenOptions={{ headerShown: false }}>
      <SetupStack.Screen
        name="GettingStarted"
        component={GettingStartedScreen}
      />
      <SetupStack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <SetupStack.Screen name="Main" component={MainStackScreen} />
    </SetupStack.Navigator>
  );
}

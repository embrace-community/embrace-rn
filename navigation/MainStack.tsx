import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserStackScreen from './UserStack';
import AccountStackScreen from './AccountStack';
import CommunityDrawerScreen from './CommunityDrawer';

const MainStack = createNativeStackNavigator();

export default function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="User" component={UserStackScreen} />
      <MainStack.Screen name="Account" component={AccountStackScreen} />
      <MainStack.Screen name="Community" component={CommunityDrawerScreen} />
    </MainStack.Navigator>
  );
}

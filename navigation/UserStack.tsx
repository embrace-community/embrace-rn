import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserAccounts from '../screens/user/Accounts';

const UserStack = createNativeStackNavigator();

export default function UserStackScreen() {
  return (
    <UserStack.Navigator screenOptions={{ headerBackVisible: false }}>
      <UserStack.Screen name="Accounts" component={UserAccounts} />
    </UserStack.Navigator>
  );
}

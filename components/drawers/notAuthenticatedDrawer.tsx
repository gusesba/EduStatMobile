import Index from '@/app/index';
import Login from '@/app/login';
import Register from '@/app/register';
import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

export default function NotAuthenticatedDrawer(){
    return (
        
          <Drawer.Navigator>
          <Drawer.Screen name="index" component={Index} options={{headerShown:false,drawerItemStyle: { display: 'none' }}}/>
          <Drawer.Screen name="register" component={Register} options={{headerShown:false,drawerItemStyle: { display: 'none' } }}/>
          <Drawer.Screen name="login" component={Login} options={{headerShown:false,drawerItemStyle: { display: 'none' } }}/>
          </Drawer.Navigator>
       
      )
}
import Index from '@/app/index';
import Educhat from '@/app/educhat';
import Experiments from '@/app/experiments';
import Login from '@/app/login';
import Potentiostat from '@/app/potentiostat';
import Register from '@/app/register';
import Settings from '@/app/settings';
import Simulation from '@/app/simulation';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Teams from '@/app/teams';
const Drawer = createDrawerNavigator();

export default function AuthenticatedDrawer(){
    return (
        
        <Drawer.Navigator>
        <Drawer.Screen name="index" component={Index} options={{headerShown:false,drawerItemStyle: { display: 'none' }}}/>
        <Drawer.Screen name="register" component={Register} options={{headerShown:false,drawerItemStyle: { display: 'none' } }}/>
        <Drawer.Screen
          name="potentiostat"
          component={Potentiostat}
          options={{
            title: "Potentiostat",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="flask-outline" color={color} size={size} />
              // or use <MaterialCommunityIcons name="chart-line" color={color} size={size} />
            ),
          }}
        />
        

      <Drawer.Screen name="experiments" component={Experiments} options={{title:'Experiments', drawerIcon:({color,size})=> (
          <Ionicons name="beaker-outline" color={color} size={size} />
        )}}/>
      
        <Drawer.Screen name="educhat" component={Educhat} options={{ title:'EduChat',drawerIcon: ({ color, size }) => (
          <Ionicons name="chatbubbles-outline" color={color} size={size} />)}}
        />
        <Drawer.Screen name="simulation" component={Simulation} options={{title:'Simulation', drawerIcon:({color,size})=> (
          <Ionicons name="cube-outline" color={color} size={size} />
        )}}/>
          <Drawer.Screen name="settings" component={Settings} options={{ title:'Settings', drawerIcon:({color,size})=>(
             <Ionicons name="settings-outline" color={color} size={size} />
          )}}/>
           <Drawer.Screen name="teams" component={Teams} options={{ title:'Teams', drawerIcon:({color,size})=>(
             <Ionicons name="people-outline" color={color} size={size} />
          )}}/>
        <Drawer.Screen name="login" component={Login} options={{headerShown:false, title:'Logout', drawerIcon:({color,size})=>(
           <Ionicons name="arrow-back-circle-outline" color={color} size={size} />
        )}}/>
        
      </Drawer.Navigator>
       
      )
}
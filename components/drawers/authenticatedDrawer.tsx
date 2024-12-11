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
import Chatbot from '@/app/chatbot';
const Drawer = createDrawerNavigator();

export default function AuthenticatedDrawer(){
    return (
        
        <Drawer.Navigator>
        <Drawer.Screen name="index" component={Index} options={{unmountOnBlur:true,headerShown:false,drawerItemStyle: { display: 'none' }}}/>
        <Drawer.Screen name="register" component={Register} options={{unmountOnBlur:true,headerShown:false,drawerItemStyle: { display: 'none' } }}/>
        <Drawer.Screen
          name="potentiostat"
          component={Potentiostat}
          options={{unmountOnBlur:true,
            title: "Potentiostat",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="flask-outline" color={color} size={size} />
              // or use <MaterialCommunityIcons name="chart-line" color={color} size={size} />
            ),
          }}
        />
        

      <Drawer.Screen name="experiments" component={Experiments} options={{unmountOnBlur:true,title:'Experiments', drawerIcon:({color,size})=> (
          <Ionicons name="beaker-outline" color={color} size={size} />
        )}}/>
      
        <Drawer.Screen name="educhat" component={Chatbot} options={{ unmountOnBlur:true, title:'EduChat',drawerIcon: ({ color, size }) => (
          <Ionicons name="chatbubbles-outline" color={color} size={size} />)}}
        />
        <Drawer.Screen name="simulation" component={Simulation} options={{unmountOnBlur:true,title:'Simulation', drawerIcon:({color,size})=> (
          <Ionicons name="cube-outline" color={color} size={size} />
        )}}/>
          <Drawer.Screen name="settings" component={Settings} options={{unmountOnBlur:true, title:'Settings', drawerIcon:({color,size})=>(
             <Ionicons name="settings-outline" color={color} size={size} />
          )}}/>
           <Drawer.Screen name="teams" component={Teams} options={{unmountOnBlur:true, title:'Teams', drawerIcon:({color,size})=>(
             <Ionicons name="people-outline" color={color} size={size} />
          )}}/>
        <Drawer.Screen name="login" component={Login} options={{unmountOnBlur:true,headerShown:false, title:'Logout', drawerIcon:({color,size})=>(
           <Ionicons name="arrow-back-circle-outline" color={color} size={size} />
        )}}/>
        {/* <Drawer.Screen name="chatbot" component={Chatbot} options={{title:'Chatbot', drawerIcon:({color,size})=>(
           <Ionicons name="arrow-back-circle-outline" color={color} size={size} />
        )}}/> */}
        
      </Drawer.Navigator>
       
      )
}
import './gesture-handler';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import { useEffect, useState } from 'react';
import NotAuthenticatedDrawer from '@/components/drawers/notAuthenticatedDrawer';
import AuthenticatedDrawer from '@/components/drawers/authenticatedDrawer';
import { getValueForStore } from './libs/secureStore';


const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
  },
};

export default function RootLayout() {
  useEffect(()=> {
    getValueForStore('user_token').then((result)=> {
      if(result)
        setIsAuthenticated(true);
      else
        setIsAuthenticated(true);
    })
  },[])
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  if(!isAuthenticated) {
    return (
      <PaperProvider theme={theme}>
        <NotAuthenticatedDrawer/>
      </PaperProvider>
    )
  }
  return (
    <PaperProvider theme={theme}>
        <AuthenticatedDrawer/>
      {/* </Stack> */}
    </PaperProvider>
  );
}

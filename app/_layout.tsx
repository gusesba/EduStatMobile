import './gesture-handler';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import { useState } from 'react';
import NotAuthenticatedDrawer from '@/components/drawers/notAuthenticatedDrawer';
import AuthenticatedDrawer from '@/components/drawers/authenticatedDrawer';
import { requestPermissions } from '@/hooks/useBle';


const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
  },
};

requestPermissions();

export default function RootLayout() {
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

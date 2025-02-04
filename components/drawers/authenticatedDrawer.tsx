import Educhat from "@/app/educhat";
import Experiments from "@/app/experiments";
import Login from "@/app/login";
import Potentiostat from "@/app/potentiostat";
import Register from "@/app/register";
import Settings from "@/app/settings";
import Simulation from "@/app/simulation";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Teams from "@/app/teams";
import Chatbot from "@/app/chatbot";
import Main from "@/app/main";
import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { ResizeMode, Video } from "expo-av"; // Importando o player de vídeo
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
const Drawer = createDrawerNavigator();

type RootStackParamList = {
  main: undefined;
  register: undefined;
  help: { videoSource: any }; // Definindo que a tela 'help' espera o parâmetro 'videoSource'
  potentiostat: undefined;
  experiments: undefined;
  educhat: undefined;
  simulation: undefined;
  settings: undefined;
  teams: undefined;
  login: undefined;
};

const videoSources = {
  chat: require("@/assets/videos/chat.mp4"),
  experiments: require("@/assets/videos/experiments.mp4"),
  potentiostat: require("@/assets/videos/potentiostat.mp4"),
  simulation: require("@/assets/videos/simulation.mp4"),
  teams: require("@/assets/videos/teams.mp4"),

  // Adicione outros vídeos conforme necessário
};

function HelpVideoScreen({ route }: { route: any }) {
  const { videoSource } = route.params; // Recebe o caminho do vídeo via parâmetros
  const isFocused = useIsFocused();

  // Cria uma referência para o componente de vídeo
  const videoRef = useRef(null);

  // Função para reiniciar o vídeo
  const handleReplay = () => {
    // @ts-ignore
    videoRef.current?.replayAsync(); // Reinicia o vídeo
  };

  useEffect(() => {
    if (isFocused) {
      handleReplay();
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Video
        ref={videoRef} // Atribui a referência ao componente Video
        source={videoSource} // Usa o caminho do vídeo passado como parâmetro
        style={{ width: "100%", height: "100%" }}
        useNativeControls={true} // Mostra controles do player
        resizeMode={ResizeMode.CONTAIN} // Ajusta o vídeo para caber na tela
        shouldPlay={true}
      />
    </View>
  );
}

function HelpButton({ videoKey }: { videoKey: keyof typeof videoSources }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("help", {
          videoSource: videoSources[videoKey], // Usando o mapa para obter o caminho do vídeo
        })
      }
      style={{ marginRight: 15 }}
    >
      <Ionicons name="help-circle-outline" size={24} color="black" />
    </TouchableOpacity>
  );
}

export default function AuthenticatedDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="main"
        component={Main}
        options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="register"
        component={Register}
        options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="help"
        component={HelpVideoScreen} // Componente da tela de ajuda
        initialParams={{ videoSource: require("@/assets/videos/help.mp4") }}
        options={{
          title: "Help Video",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="potentiostat"
        component={Potentiostat}
        options={{
          title: "Potentiostat",
          headerRight: () => <HelpButton videoKey="potentiostat" />,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flask-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="experiments"
        component={Experiments}
        options={{
          title: "Experiments",
          headerRight: () => <HelpButton videoKey="experiments" />,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="beaker-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="educhat"
        component={Chatbot}
        options={{
          title: "EduChat",
          headerRight: () => <HelpButton videoKey="chat" />,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="simulation"
        component={Simulation}
        options={{
          title: "Simulation",
          headerRight: () => <HelpButton videoKey="simulation" />,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        component={Settings}
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="teams"
        component={Teams}
        options={{
          title: "Teams",
          headerRight: () => <HelpButton videoKey="teams" />,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="login"
        component={Login}
        options={{
          headerShown: false,
          title: "Logout",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="arrow-back-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

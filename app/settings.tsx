import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Divider, Text, TextInput } from "react-native-paper";
import { isUserLogged, profile } from "./libs/login";
import { useIsFocused } from "@react-navigation/native";
import NotLogged from "@/components/NotLogged";
import { getTeamExperiments } from "./libs/experiments";
import { getTeams } from "./libs/teams";
import { ScrollView } from "react-native-gesture-handler";

export default function Settings() {
  const [userLogged, setUserLogged] = useState<string | null | undefined>(null);
  const isFocused = useIsFocused();

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [teams, setTeams] = useState<{ name: string; id: string }[]>([]);
  const [teamsExp, setTeamsExp] = useState(0);

  useEffect(() => {
    if(userLogged)
      handleSetUser();
  }, [userLogged]);

  useEffect(() => {
    isUserLogged().then((a) => {
      setUserLogged(a);
    });
  }, [isFocused]);

  const handleSetUser = async () => {
    const [data, _] = await profile();
    setUser(data.name);
    setEmail(data.email);
  };

  const getTeamsHandler = async () => {
    const [teams, status] = await getTeams();

    if (status == 200) {
      setTeams(teams);
    } else alert("Error Getting Teams!");
  };

  useEffect(() => {
    if (userLogged) {
      getTeamsHandler();
    }
  }, [userLogged, isFocused]);

  useEffect(() => {
    if(userLogged)
      setTeamsExp(teams.length);
  }, [teams]);

  if (!userLogged) return <NotLogged />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="User Profile" />
        <Card.Content>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.label}>Teams</Text>
          <Text style={styles.value}>{teamsExp}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  card: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: "#ddd",
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
});

import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation, Text } from "react-native-paper";
import { getTeams } from "./libs/teams";
import { isUserLogged } from "./libs/login";
import NotLogged from "@/components/NotLogged";
import { useIsFocused } from "@react-navigation/native";
import TeamsTab from "@/components/teams/TeamsTab";
import InvitesTab from "@/components/teams/InvitesTab";
import MembersTab from "@/components/teams/MembersTab";
import ExperimentsTab from "@/components/teams/ExperimentsTab";

export default function Teams() {
  const [index, setIndex] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [routes] = useState([
    { key: "teams", title: "My Teams", icon: "account-group" },
    { key: "invites", title: "My Invites", icon: "account-group" },
    { key: "members", title: "Members", icon: "account" },
    { key: "experiments", title: "Experiments", icon: "flask" },
  ]);
  const [userLogged, setUserLogged] = useState<string | null | undefined>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      isUserLogged().then((a) => {
        setUserLogged(a);
      });
      setIndex(0);
      setSelectedTeam("");
    }
  }, [isFocused]);

  // Define what each tab renders
  const renderScene = BottomNavigation.SceneMap({
    teams: () => (
      <TeamsTab selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} />
    ),
    invites: () => <InvitesTab />,
    members: () => <MembersTab selectedTeam={selectedTeam} />,
    experiments: () => <ExperimentsTab selectedTeam={selectedTeam} />,
  });

  if (!userLogged) return <NotLogged />;

  return (
    <>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={false} // Shifting animation for active tabs
      />
    </>
  );
}

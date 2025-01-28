import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import AddTeamModal from "./modals/AddTeamModal";
import { ScrollView } from "react-native-gesture-handler";
import { deleteTeam, deleteUserTeam, getTeams } from "@/app/libs/teams";
import { useIsFocused } from "@react-navigation/native";
import { isUserLogged } from "@/app/libs/login";
import { getValueForStore } from "@/app/libs/secureStore";

interface TeamsTabProps {
  selectedTeam: string;
  setSelectedTeam: Dispatch<SetStateAction<string>>;
}

export default function TeamsTab({
  selectedTeam,
  setSelectedTeam,
}: TeamsTabProps) {
  const [visible, setVisible] = useState(false);
  const [teams, setTeams] = useState<
    { name: string; id: string; role: string }[]
  >([]);
  const [userLogged, setUserLogged] = useState<string | null | undefined>(null);
  const isFocused = useIsFocused();
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
  };

  const handleDelete = async (teamId: string) => {
    const [data, status] = await deleteTeam(teamId);

    if (status != 200) {
      alert("Error");
    } else {
      getTeamsHandler();
      setSelectedTeam("");
    }
  };

  const handleLeftTeam = async (teamId: string) => {
    const userId = await getValueForStore("user_id");
    const [data, status] = await deleteUserTeam(teamId, userId as string);

    if (status != 200) {
      alert("Error");
    } else {
      getTeamsHandler();
      setSelectedTeam("");
    }
  };

  const getTeamsHandler = async () => {
    const [teams, status] = await getTeams();

    if (status == 200) {
      setTeams(teams);
    } else alert("Error Getting Teams!");
  };

  useEffect(() => {
    isUserLogged().then((a) => {
      setUserLogged(a);
    });
    setTeams([]);
  }, [isFocused]);

  useEffect(() => {
    if (userLogged) {
      getTeamsHandler();
    }
  }, [userLogged, isFocused]);

  return (
    <>
      <ScrollView style={{ marginTop: 10 }}>
        {teams.length > 0 ? (
          teams.map((team) => {
            const selected = team.id == selectedTeam;
            return (
              <View
                key={team.id}
                style={selected ? styles.teamNameSelected : styles.teamName}
              >
                <TouchableOpacity
                  onPress={() => setSelectedTeam(team.id)}
                  style={{ padding: 15, width: "70%" }}
                >
                  <Text>{team.name}</Text>
                </TouchableOpacity>
                {team.role == "ADMIN" ? (
                  <IconButton
                    onPress={() => {
                      handleDelete(team.id);
                    }}
                    style={{ height: 20, margin: 0 }}
                    icon="delete"
                  />
                ) : (
                  <IconButton
                    onPress={() => {
                      handleLeftTeam(team.id);
                    }}
                    style={{ height: 20, margin: 0 }}
                    icon="arrow-left"
                  />
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.container2}>
            <Text style={styles.text}>
              No teams available. Create one using the "+" button.
            </Text>
          </View>
        )}
      </ScrollView>
      <Button
        style={styles.addBtn}
        mode="contained"
        labelStyle={styles.plusSign}
        onPress={showModal}
      >
        +
      </Button>
      <AddTeamModal
        getTeamsHandler={getTeamsHandler}
        visible={visible}
        hideModal={hideModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 16, // Spacing between the text and button
    textAlign: "center", // Center the text content
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },

  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
  },
  plusSign: {
    fontSize: 20,
    marginTop: 15,
    fontWeight: "bold",
  },
  teamNameSelected: {
    backgroundColor: "#ddd",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "auto",
    borderRadius: 10,
    marginBottom: 3,
  },
  teamName: {
    backgroundColor: "#eee",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "auto",
    borderRadius: 10,
    marginBottom: 3,
  },
});

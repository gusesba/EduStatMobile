import React, { Dispatch, SetStateAction, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import AddTeamModal from "./modals/AddTeamModal";

interface TeamsTabProps {
  selectedTeam: string;
  teams: { name: string; id: string }[];
  setSelectedTeam: Dispatch<SetStateAction<string>>;
}

export default function TeamsTab({
  selectedTeam,
  teams,
  setSelectedTeam,
}: TeamsTabProps) {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
  };

  return (
    <>
      <View style={styles.tabTeamContent}>
        {teams.length > 0 ? (
          teams.map((team) => {
            if (team.id == selectedTeam)
              return (
                <View key={team.id} style={styles.teamNameSelected}>
                  <Text>{team.name}</Text>
                </View>
              );
            return (
              <View key={team.id} style={{ width: "100%" }}>
                <TouchableOpacity
                  onPress={() => setSelectedTeam(team.id)}
                  style={styles.teamName}
                >
                  <Text>{team.name}</Text>
                </TouchableOpacity>
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
      </View>
      <Button
        style={styles.addBtn}
        mode="contained"
        labelStyle={styles.plusSign}
        onPress={showModal}
      >
        +
      </Button>
      <AddTeamModal visible={visible} hideModal={hideModal} />
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
  teamNameSelected: {
    padding: 15,
    backgroundColor: "#ddd",
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
  teamName: {
    padding: 15,
    backgroundColor: "#eee",
    width: "100%",
  },
  tabTeamContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

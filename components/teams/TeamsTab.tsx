import React, { Dispatch, SetStateAction, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import AddTeamModal from "./modals/AddTeamModal";
import { ScrollView } from "react-native-gesture-handler";

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

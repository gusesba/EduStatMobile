import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import {
  deleteTeamExperiment,
  getTeamExperiments,
} from "@/app/libs/experiments";
import { ScrollView } from "react-native-gesture-handler";

interface ExperimentsTabProps {
  selectedTeam: string;
}

export default function ExperimentsTab({ selectedTeam }: ExperimentsTabProps) {
  const [experiments, setExperiments] = useState<
    { name: string; id: string }[]
  >([]);

  const getTeamExperimentsHandler = async () => {
    const [experiments, status] = await getTeamExperiments(selectedTeam);
    if (status == 200) {
      setExperiments(experiments);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTeamExperiment(id, selectedTeam);

    getTeamExperimentsHandler();
  };

  useEffect(() => {
    if (selectedTeam) getTeamExperimentsHandler();
  }, [selectedTeam]);

  return (
    <>
      <ScrollView style={{ marginTop: 10 }}>
        {experiments.length > 0 ? (
          experiments.map((experiment, index) => {
            return (
              <View key={index} style={styles.teamName}>
                <Text style={{ padding: 15 }}>{experiment.name}</Text>
                <IconButton
                  onPress={() => handleDelete(experiment.id)}
                  style={{ height: 20, margin: 0 }}
                  icon="delete"
                />
              </View>
            );
          })
        ) : (
          <View style={styles.container2}>
            <Text style={styles.text}>
              No experiments available on the team
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  text: {
    marginBottom: 16, // Spacing between the text and button
    textAlign: "center", // Center the text content
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
  tabTeamContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

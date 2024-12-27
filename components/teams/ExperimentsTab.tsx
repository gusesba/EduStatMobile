import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { getTeamExperiments } from "@/app/libs/experiments";

interface ExperimentsTabProps {
  selectedTeam: string;
}

export default function ExperimentsTab({ selectedTeam }: ExperimentsTabProps) {
  const [experiments, setExperiments] = useState<{ name: string }[]>([]);

  const getTeamExperimentsHandler = async () => {
    const [experiments, status] = await getTeamExperiments(selectedTeam);
    if (status == 200) {
      setExperiments(experiments);
    } else alert("Unknown Error!");
  };

  useEffect(() => {
    getTeamExperimentsHandler();
  }, [selectedTeam]);

  return (
    <>
      <View style={styles.tabTeamContent}>
        {experiments.length > 0 ? (
          experiments.map((experiment, index) => {
            return (
              <View key={index} style={styles.teamName}>
                <Text>{experiment.name}</Text>
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
      </View>
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

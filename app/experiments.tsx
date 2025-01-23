import { GraphScreen } from "@/components/graphComponent";
import { useEffect, useState } from "react";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { BottomNavigation, Button, Text } from "react-native-paper";
import { isUserLogged } from "./libs/login";
import { useIsFocused } from "@react-navigation/native";
import ExperimentsTab from "@/components/experiments/ExperimentsTab";
import { TExperiment } from "@/types/experiments";
import GraphTab from "@/components/experiments/GraphTab";

export default function Experiment() {
  const [index, setIndex] = useState(0);
  const [selectedExperiments, setSelectedExperiments] = useState<TExperiment[]>(
    []
  );

  const [routes] = useState([
    { key: "experiments", title: "Experiments", icon: "account-group" },
    { key: "notes", title: "Notes", icon: "account-group" },
    { key: "graph", title: "Graph", icon: "account-group" },
  ]);
  const isFocused = useIsFocused();

  useEffect(() => {
    setIndex(0);
    setSelectedExperiments([]);
  }, [isFocused]);

  const renderScene = BottomNavigation.SceneMap({
    experiments: () => (
      <ExperimentsTab
        selectedExperiments={selectedExperiments}
        setSelectedExperiments={setSelectedExperiments}
      />
    ),
    graph: () => <GraphTab selectedExperiments={selectedExperiments} />,
    notes: () => (
      <>
        <View>
          {selectedExperiments.map((experiment, i) => {
            if (!experiment.notes) return null;
            return (
              <View key={i}>
                <Text style={styles.noteTitle}>{experiment.name}</Text>
                <Text>{experiment.notes}</Text>
              </View>
            );
          })}
        </View>
      </>
    ),
  });

  // Function to calculate the mean graph from a list of TExperiment objects

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

const styles = StyleSheet.create({
  tabTeamContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  teamNameSelected: {
    backgroundColor: "#ddd",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamName: {
    backgroundColor: "#eee",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  expTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  btns: {
    flexDirection: "row",
    gap: 5,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

import { GraphScreen } from "@/components/graphComponent";
import { memo, useCallback, useEffect, useState } from "react";
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

  const handleSetSelectedExperiments = useCallback(
    (experiment: TExperiment, selected: boolean) => {
      setSelectedExperiments((prevSelectedExperiments) => {
        if (selected) {
          return [...prevSelectedExperiments, experiment];
        }
        return prevSelectedExperiments.filter(
          (item) => item.id != experiment.id
        );
      });
    },
    []
  );

  const MemoizedExperimentsTab = memo(
    ExperimentsTab,
    (prevProps, nextProps) => {
      // Verifica se setSelectedExperiments mudou ou se há qualquer outra prop que exija re-renderização
      return (
        prevProps.setSelectedExperiments === nextProps.setSelectedExperiments
      );
    }
  );

  // Aba ExperimentsTab independente (sem dependências)
  const renderExperimentsTab = useCallback(
    () => (
      <MemoizedExperimentsTab
        setSelectedExperiments={handleSetSelectedExperiments}
      />
    ),
    [handleSetSelectedExperiments] // Só depende do callback
  );

  // Aba GraphTab que depende de selectedExperiments
  const renderGraphTab = useCallback(
    () => <GraphTab selectedExperiments={selectedExperiments} />,
    [selectedExperiments] // Depende dos experimentos selecionados
  );

  // Aba Notes que também depende de selectedExperiments
  const renderNotesTab = useCallback(
    () => (
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
    ),
    [selectedExperiments] // Depende dos experimentos selecionados
  );

  // Mapeia as cenas para os callbacks individuais
  const renderScene = BottomNavigation.SceneMap({
    experiments: renderExperimentsTab,
    graph: renderGraphTab,
    notes: renderNotesTab,
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

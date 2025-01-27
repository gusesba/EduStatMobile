import { memo, useCallback, useEffect, useState } from "react";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BottomNavigation, Button, Text } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import ExperimentsTab from "@/components/experiments/ExperimentsTab";
import { TExperiment } from "@/types/experiments";
import GraphTab from "@/components/experiments/GraphTab";
import { ScrollView } from "react-native-gesture-handler";

const Parameter = ({ label, value }: { label: any; value: any }) => (
  <View style={styles.parameter}>
    <Text style={styles.parameterLabel}>{label}:</Text>
    <Text style={styles.parameterValue}>{value}</Text>
  </View>
);

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
      <ScrollView>
        <View style={styles.container}>
          {selectedExperiments.map((experiment, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.title}>{experiment.name}</Text>
              <View style={styles.parametersContainer}>
                <Text style={styles.sectionTitle}>Parameters:</Text>
                <View style={styles.parametersList}>
                  <Parameter
                    label="Max Voltage"
                    value={`${experiment.parameters.maxV} V`}
                  />
                  <Parameter
                    label="Min Voltage"
                    value={`${experiment.parameters.minv} V`}
                  />
                  <Parameter
                    label="Step"
                    value={`${experiment.parameters.step} V`}
                  />
                  <Parameter
                    label="Delay"
                    value={`${experiment.parameters.delay} ms`}
                  />
                  <Parameter
                    label="Time (I-V)"
                    value={`${experiment.parameters.timeIV} s`}
                  />
                  <Parameter
                    label="Cycles"
                    value={experiment.parameters.cyclesNumber}
                  />
                  <Parameter
                    label="Final Voltage"
                    value={`${experiment.parameters.finalVoltage} V`}
                  />
                </View>
              </View>
              {experiment.notes ? (
                <>
                  <Text style={styles.sectionTitle}>Notes:</Text>
                  <View style={styles.parametersList}>
                    <Text style={styles.notes}>{experiment.notes}</Text>
                  </View>
                </>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
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
  container: {
    padding: 16,
    backgroundColor: "#f4f4f5",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
  },
  parametersContainer: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  parametersList: {
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    padding: 12,
  },
  parameter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  parameterValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  notes: {
    fontSize: 14,
    color: "#444",
    marginTop: 8,
  },
});

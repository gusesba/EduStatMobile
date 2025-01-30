import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Modal, Text, TextInput } from "react-native-paper";
import { deleteJsonFile, deleteUserExperiment } from "@/app/libs/experiments";
import { TExperiment } from "@/types/experiments";

interface ExperimentsLineProps {
  experiment: TExperiment;
  setSelectedExperiments: (experiment: TExperiment, selected: boolean) => void;
  handleGetExperiments: () => void;
  handleOpenNotes: (experiment: TExperiment) => void;
  type: string;
}

export default function ExperimentsLine({
  experiment,
  setSelectedExperiments,
  handleGetExperiments,
  handleOpenNotes,
  type,
}: ExperimentsLineProps) {
  const [selected, setSelected] = useState(false);
  const handleDelete = async (id: string, type: string) => {
    if (type == "local") {
      await deleteJsonFile(id);
    } else if (type == "user") {
      await deleteUserExperiment(id);
    }
    handleGetExperiments();
  };

  const handlesetSelected = (experiment: TExperiment) => {
    setSelectedExperiments(experiment, !selected);
    setSelected(!selected);
  };

  return (
    <View style={selected ? styles.teamNameSelected : styles.teamName}>
      <TouchableOpacity
        style={{ padding: 15, width: "70%" }}
        onPress={() => handlesetSelected(experiment)}
      >
        <Text>{experiment.name}</Text>
      </TouchableOpacity>
      <View style={styles.btns}>
        <IconButton
          onPress={() => handleOpenNotes(experiment)}
          style={{ height: 20, margin: 0 }}
          icon="pen"
        />
        {type != "team" && (
          <IconButton
            onPress={() => handleDelete(experiment.id, type)}
            style={{ height: 20, margin: 0 }}
            icon="delete"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
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
  btns: {
    flexDirection: "row",
    gap: 5,
  },
});

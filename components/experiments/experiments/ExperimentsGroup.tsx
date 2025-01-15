import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Modal, Text, TextInput } from "react-native-paper";
import { deleteJsonFile, deleteUserExperiment } from "@/app/libs/experiments";
import { TExperiment } from "@/types/experiments";

interface ExperimentsGroupProps {
  experiments: TExperiment[];
  selectedExperiments: TExperiment[];
  setSelectedExperiments: React.Dispatch<React.SetStateAction<TExperiment[]>>;
  handleOpenNotes: (experiment: TExperiment) => void;
  title: string;
  type: string;
}

export default function ExperimentsGroup({
  experiments,
  selectedExperiments,
  setSelectedExperiments,
  handleOpenNotes,
  title,
  type,
}: ExperimentsGroupProps) {
  const handleDelete = (id: string, type: string) => {
    if (type == "local") {
      deleteJsonFile(id);
    } else if (type == "user") {
      deleteUserExperiment(id);
    } else if (type == "team") {
      alert("Not implemented");
    }
  };

  return (
    <>
      <Text style={styles.expTitle}>{title}</Text>
      {experiments.length > 0 ? (
        experiments.map((experiment) => {
          const isSelected = selectedExperiments.find(
            (x) => x.id == experiment.id
          );
          return (
            <View
              style={isSelected ? styles.teamNameSelected : styles.teamName}
            >
              <TouchableOpacity
                style={{ padding: 15 }}
                onPress={() =>
                  setSelectedExperiments((current) =>
                    isSelected
                      ? current.filter((ex) => ex.id !== experiment.id)
                      : [...current, experiment]
                  )
                }
              >
                <Text>{experiment.name}</Text>
              </TouchableOpacity>
              <View style={styles.btns}>
                <IconButton
                  onPress={() => handleOpenNotes(experiment)}
                  style={{ height: 20, margin: 0 }}
                  icon="pen"
                />
                <IconButton
                  onPress={() => handleDelete(experiment.id, type)}
                  style={{ height: 20, margin: 0 }}
                  icon="delete"
                />
              </View>
            </View>
          );
        })
      ) : (
        <Text style={{ marginLeft: 10 }}>No {title} Available.</Text>
      )}
    </>
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
  btns: {
    flexDirection: "row",
    gap: 5,
  },
});

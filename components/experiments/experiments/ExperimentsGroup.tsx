import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Modal, Text, TextInput } from "react-native-paper";
import { deleteJsonFile, deleteUserExperiment } from "@/app/libs/experiments";
import { TExperiment } from "@/types/experiments";
import ExperimentsLine from "./ExperimentsLine";

interface ExperimentsGroupProps {
  experiments: TExperiment[];
  setSelectedExperiments: (experiment: TExperiment, selected: boolean) => void;
  handleOpenNotes: (experiment: TExperiment) => void;
  title: string;
  type: string;
}

export default function ExperimentsGroup({
  experiments,
  setSelectedExperiments,
  handleOpenNotes,
  title,
  type,
}: ExperimentsGroupProps) {
  return (
    <>
      <Text style={styles.expTitle}>{title}</Text>
      {experiments.length > 0 ? (
        experiments.map((experiment) => {
          return (
            <ExperimentsLine
              key={`${experiment.id}${experiment.name}`}
              experiment={experiment}
              handleOpenNotes={handleOpenNotes}
              setSelectedExperiments={setSelectedExperiments}
              type={type}
            />
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
  btns: {
    flexDirection: "row",
    gap: 5,
  },
});

import React, { Dispatch, SetStateAction, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Modal, Text, TextInput } from "react-native-paper";
import { createTeam } from "@/app/libs/teams";

interface AddTeamModalProps {
  hideModal: () => void;
  visible: boolean;
}

export default function AddTeamModal({
  hideModal,
  visible,
}: AddTeamModalProps) {
  const [teamName, setTeamName] = useState("");

  const handleCreateTeam = async () => {
    if (teamName === "") return;

    const status = await createTeam(teamName);

    if (status === 200) {
      alert("Team created successfully!");
      setTeamName("");
      hideModal();
    } else {
      alert("Error Creating Team!");
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={styles.modalContainer}
    >
      <TextInput
        mode="outlined"
        label="Team Name"
        value={teamName}
        onChangeText={(text) => setTeamName(text)}
      />
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={hideModal} style={styles.modalButton}>
          Close
        </Button>
        <Button
          mode="contained"
          onPress={handleCreateTeam}
          style={styles.modalButton}
        >
          OK
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalButton: {
    width: 100,
  },
});

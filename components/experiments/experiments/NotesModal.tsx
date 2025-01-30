import {
  saveJsonToFile,
  saveTeamNotes,
  saveUserNotes,
} from "@/app/libs/experiments";
import { TExperiment } from "@/types/experiments";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, TextInput } from "react-native-paper";

interface NotesModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  noteExperiment: TExperiment | null;
  handleGetExperiments: () => void;
}

export default function NotesModal({
  modal,
  setModal,
  noteExperiment,
  handleGetExperiments,
}: NotesModalProps) {
  const [note, setNote] = useState("");

  const hideModal = () => {
    setNote("");
    setModal(false);
  };

  const handleSaveNote = async () => {
    console.log("teste");
    if (noteExperiment) {
      if (noteExperiment.userId)
        await saveUserNotes(noteExperiment.id, note + "      ");
      else if (noteExperiment.teamId)
        await saveTeamNotes(
          noteExperiment.id,
          note + "       ",
          noteExperiment.teamId
        );
      else {
        const notes = noteExperiment.notes
          ? `${
              noteExperiment.notes
            }\n[${new Date().toISOString()}] - ${"Local Note"}\n${note}\n---------------------------------\n`
          : `[${new Date().toISOString()}] - ${"Local Note"}\n${note}\n---------------------------------\n`;
        noteExperiment.notes = notes;
        await saveJsonToFile(noteExperiment.name, noteExperiment);
      }
      handleGetExperiments();
    }
  };

  return (
    <Modal
      visible={modal}
      onDismiss={hideModal}
      contentContainerStyle={styles.modalContainer}
    >
      <TextInput
        mode="outlined"
        label="Note"
        multiline={true}
        value={note}
        onChangeText={(text) => setNote(text)}
      />
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={hideModal}>
          Close
        </Button>
        <Button mode="contained" onPress={handleSaveNote}>
          OK
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 40,
  },
});

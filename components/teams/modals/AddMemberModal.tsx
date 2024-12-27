import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Modal, Text, TextInput } from "react-native-paper";
import { sendInvite } from "@/app/libs/teams";
import { Picker } from "@react-native-picker/picker";

interface AddMemberModalProps {
  hideModal: () => void;
  visible: boolean;
  selectedTeam: string;
}

export default function AddMemberModal({
  hideModal,
  visible,
  selectedTeam,
}: AddMemberModalProps) {
  const [selectedRole, setSelectedRole] = useState("VIEWER");
  const [addUserEmail, setAddUserEmail] = useState("");

  const handleAddUser = async () => {
    const [data, status] = await sendInvite(
      addUserEmail,
      selectedRole,
      selectedTeam
    );

    if (status == 200) alert("Invite Sent!");
  };

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={styles.modalContainer}
    >
      <TextInput
        mode="outlined"
        label="User Email"
        value={addUserEmail}
        onChangeText={(text) => setAddUserEmail(text)}
      />

      <Picker
        selectedValue={selectedRole}
        onValueChange={(itemValue) => setSelectedRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="ADMIN" value="ADMIN" />
        <Picker.Item label="ASSISTANT" value="ASSISTANT" />
        <Picker.Item label="VIEWER" value="VIEWER" />
      </Picker>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={hideModal} style={styles.modalButton}>
          Close
        </Button>
        <Button
          mode="contained"
          onPress={handleAddUser}
          style={styles.modalButton}
        >
          Send
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
  picker: {
    height: 50,
    marginBottom: 15,
  },
  modalButton: {
    width: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

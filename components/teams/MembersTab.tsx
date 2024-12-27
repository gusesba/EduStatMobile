import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Text, TextInput } from "react-native-paper";
import { getUsers, sendInvite } from "@/app/libs/teams";
import { Picker } from "@react-native-picker/picker";

interface MembersTabProps {
  selectedTeam: string;
}

export default function MembersTab({ selectedTeam }: MembersTabProps) {
  const [users, setUsers] = useState<{ name: string }[]>([]);
  const [visibleAddMember, setVisibleAddMember] = useState(false);
  const [addUserEmail, setAddUserEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("VIEWER");

  const getTeamUsersHandler = async () => {
    const [users, status] = await getUsers(selectedTeam);
    if (status == 200) {
      setUsers(users);
    } else alert("Unknown Error!");
  };

  useEffect(() => {
    getTeamUsersHandler();
  }, [selectedTeam]);

  const showAddMemberModal = () => setVisibleAddMember(true);
  const hideAddMemberModal = () => {
    setVisibleAddMember(false);
  };

  const handleAddUser = async () => {
    const [data, status] = await sendInvite(
      addUserEmail,
      selectedRole,
      selectedTeam
    );

    if (status == 200) alert("Invite Sent!");
  };

  return (
    <>
      <View style={styles.tabTeamContent}>
        {users.length > 0 ? (
          users.map((user, index) => {
            return (
              <View key={index} style={styles.teamName}>
                <Text>{user.name}</Text>
              </View>
            );
          })
        ) : (
          <View style={styles.container2}>
            <Text style={styles.text}>No users available on the team</Text>
          </View>
        )}
      </View>
      {selectedTeam != "" && (
        <Button
          style={styles.addBtn}
          mode="contained"
          labelStyle={styles.plusSign}
          onPress={showAddMemberModal}
        >
          +
        </Button>
      )}

      <Modal
        visible={visibleAddMember}
        onDismiss={hideAddMemberModal}
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
          <Button
            mode="outlined"
            onPress={hideAddMemberModal}
            style={styles.modalButton}
          >
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
    </>
  );
}

const styles = StyleSheet.create({
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
  tabTeamContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  teamName: {
    padding: 15,
    backgroundColor: "#eee",
    width: "100%",
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  plusSign: {
    fontSize: 20,
    marginTop: 15,
    fontWeight: "bold",
  },
  text: {
    marginBottom: 16, // Spacing between the text and button
    textAlign: "center", // Center the text content
  },
  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 40,
  },
});

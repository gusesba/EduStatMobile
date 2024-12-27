import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { getUsers } from "@/app/libs/teams";
import AddMemberModal from "./modals/AddMemberModal";

interface MembersTabProps {
  selectedTeam: string;
}

export default function MembersTab({ selectedTeam }: MembersTabProps) {
  const [users, setUsers] = useState<{ name: string }[]>([]);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);

    const getTeamUsersHandler = async () => {
      const [users, status] = await getUsers(selectedTeam);
      if (status == 200) {
        setUsers(users);
      } else alert("Unknown Error!");
    };

    useEffect(() => {
      getTeamUsersHandler();
    }, [selectedTeam]);
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
          onPress={showModal}
        >
          +
        </Button>
      )}
      <AddMemberModal
        hideModal={hideModal}
        selectedTeam={selectedTeam}
        visible={visible}
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
    marginBottom: 16,
    textAlign: "center",
  },
  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
  },
});

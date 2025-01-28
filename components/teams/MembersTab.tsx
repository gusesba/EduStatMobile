import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { deleteUserTeam, getUsers } from "@/app/libs/teams";
import AddMemberModal from "./modals/AddMemberModal";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { getValueForStore } from "@/app/libs/secureStore";

interface MembersTabProps {
  selectedTeam: string;
}

export default function MembersTab({ selectedTeam }: MembersTabProps) {
  const [users, setUsers] = useState<
    { name: string; role: string; you: boolean; id: string }[]
  >([]);
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>("");
  const isFocused = useIsFocused();

  const isAdmin = users.filter((user) => user.id == userId)[0]?.role == "ADMIN";

  const fetchUserId = async () => {
    setUserId(await getValueForStore("user_id"));
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserId();
    }
  }, [isFocused]);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
  };

  const handleDelete = async (userId: string) => {
    const [data, status] = await deleteUserTeam(selectedTeam, userId);

    if (status != 200) {
      alert("Error");
    } else {
      getTeamUsersHandler();
    }
  };

  const getTeamUsersHandler = async () => {
    const [users, status] = await getUsers(selectedTeam);
    if (status == 200) {
      setUsers(users);
    } else alert("Error Getting TeamUsers!");
  };

  useEffect(() => {
    getTeamUsersHandler();
  }, [selectedTeam]);

  return (
    <>
      <ScrollView style={{ marginTop: 10 }}>
        {users.length > 0 ? (
          users.map((user, index) => {
            return (
              <View key={index} style={styles.teamName}>
                <Text
                  style={
                    user.you
                      ? { padding: 15, fontWeight: 700 }
                      : { padding: 15 }
                  }
                >
                  {user.name} - {user.role}
                </Text>
                {isAdmin && user.role != "ADMIN" && (
                  <IconButton
                    onPress={() => {
                      handleDelete(user.id);
                    }}
                    style={{ height: 20, margin: 0 }}
                    icon="delete"
                  />
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.container2}>
            <Text style={styles.text}>No users available on the team</Text>
          </View>
        )}
      </ScrollView>
      {selectedTeam != "" && isAdmin && (
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
    backgroundColor: "#eee",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "auto",
    borderRadius: 10,
    marginBottom: 3,
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

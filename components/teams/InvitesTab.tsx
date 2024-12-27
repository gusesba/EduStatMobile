import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { acceptInvite, getInvites } from "@/app/libs/teams";

interface InvitesTabProps {}

export default function InvitesTab({}: InvitesTabProps) {
  const [invites, setInvites] = useState<
    {
      id: string;
      role: string;
      Team: {
        name: string;
      };
    }[]
  >([]);

  const getInvitesHandler = async () => {
    const [invites, status] = await getInvites();
    if (status == 200) {
      setInvites(invites);
    } else alert("Unknown Error!");
  };

  const handleAcceptInvite = async (id: string) => {
    const [_, status] = await acceptInvite(id);
    if (status == 200) {
      getInvitesHandler();
    } else alert("Unknown Error!");
  };

  useEffect(() => {
    getInvitesHandler();
  }, []);

  return (
    <>
      <View style={styles.tabTeamContent}>
        {invites.length > 0 ? (
          invites.map((invite, index) => {
            return (
              <View key={index} style={styles.inviteRow}>
                <Text style={styles.inviteText}>{invite.Team.name}</Text>
                <Button
                  mode="contained"
                  onPress={() => handleAcceptInvite(invite.id)}
                  style={styles.acceptButton}
                >
                  Accept
                </Button>
              </View>
            );
          })
        ) : (
          <View style={styles.container2}>
            <Text style={styles.text}>You have no invites</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabTeamContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#eee",
    width: "100%",
    marginBottom: 10,
    borderRadius: 5,
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  acceptButton: {
    flexShrink: 0,
  },
  inviteText: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  text: {
    marginBottom: 16, // Spacing between the text and button
    textAlign: "center", // Center the text content
  },
});

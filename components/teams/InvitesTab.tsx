import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { acceptInvite, declineInvite, getInvites } from "@/app/libs/teams";
import { ScrollView } from "react-native-gesture-handler";

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
    } else alert("Error Getting Invites!");
  };

  const handleAcceptInvite = async (id: string) => {
    const [_, status] = await acceptInvite(id);
    if (status == 200) {
      getInvitesHandler();
    } else alert("Error Accepting Invites!");
  };

  const handleDeclineInvite = async (id: string) => {
    const [_, status] = await declineInvite(id);
    if (status == 200) {
      getInvitesHandler();
    } else alert("Error Declining Invites!");
  };

  useEffect(() => {
    getInvitesHandler();
  }, []);

  return (
    <>
      <ScrollView style={{ marginTop: 10 }}>
        {invites.length > 0 ? (
          invites.map((invite, index) => {
            return (
              <View key={index} style={styles.inviteRow}>
                <Text style={styles.inviteText}>{invite.Team.name}</Text>
                <Button
                  mode="contained"
                  onPress={() => handleDeclineInvite(invite.id)}
                  style={styles.acceptButton}
                >
                  Decline
                </Button>
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
      </ScrollView>
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
    width: "90%",
    borderRadius: 10,
    marginBottom: 3,
    margin: "auto",
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
    marginLeft: 10,
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

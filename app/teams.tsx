import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Modal, TextInput, BottomNavigation, Text } from 'react-native-paper';
import { createTeam, getInvites, getTeams, getUsers, sendInvite } from './libs/teams';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

export default function Teams() {
  const [teamName, setTeamName] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleAddMember, setVisibleAddMember] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState("")
  const [addUserEmail, setAddUserEmail] = useState("")
  const [routes] = useState([
    { key: 'teams', title: 'My Teams', icon: 'account-group' },
    {key: 'invites', title:'My Invites', icon: 'account-group'},
    { key: 'members', title: 'Members', icon: 'account' },
    { key: 'experiments', title: 'Experiments', icon: 'flask' },
  ]);
  const [teams,setTeams] = useState<{name:string,id:string}[]>([])
  const [users,setUsers] = useState<{name:string}[]>([])
  const [invites,setInvites] = useState<{id:string,role:string,Team:{
    name:string
  }}[]>([])
  const [selectedRole, setSelectedRole] = useState('VIEWER');



  useEffect(() => {
    getTeamsHandler()
    getInvitesHandler()
  },[])
  useEffect(()=>{
    getTeamUsersHandler()
  },[selectedTeam])

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setTeamName("");
    setVisible(false);
  };

  const showAddMemberModal = () => setVisibleAddMember(true);
  const hideAddMemberModal = () => {
    setVisibleAddMember(false);
  };

  const handleAddUser = async () => {
    const [data,status] = await sendInvite(addUserEmail, selectedRole, selectedTeam)

    if(status==200)
      alert("Invite Sent!")
  }

  const handleCreateTeam = async () => {
    if (teamName === "") return;

    const status = await createTeam(teamName);

    if (status === 200) {
      alert("Team created successfully!");
      setTeamName("");
      hideModal();
    } else {
      alert("Unknown Error!");
    }
  };

  const getTeamsHandler = async () => {
    const [teams, status] = await getTeams()
    
    if(status == 200)
    {
      setTeams(teams)
    }
    else
      alert("Unknown Error!")
  }

  const getTeamUsersHandler = async () => {
    const [users,status] = await getUsers(selectedTeam)
    if(status == 200)
      {
        setUsers(users)
      }
      else
        alert("Unknown Error!")
  }

  const getInvitesHandler = async () => {
    const [invites,status] = await getInvites()
    if(status == 200)
      {
        setInvites(invites)
      }
      else
        alert("Unknown Error!")
  }

  // Define what each tab renders
  const renderScene = BottomNavigation.SceneMap({
    teams: () => (
      <>
      <View style={styles.tabTeamContent}>
        {teams.length > 0 ? (
          teams.map((team) => {
            if(team.id == selectedTeam)
              return <View key={team.id} style={styles.teamNameSelected}><Text>{team.name}</Text></View>
            return <View key={team.id} style={{width:"100%"}}><TouchableOpacity onPress={()=>setSelectedTeam(team.id)} style={styles.teamName}><Text>{team.name}</Text></TouchableOpacity></View>
          })
        ) : (
          <Text>No teams available. Create one using the "+" button.</Text>
        )}
      </View>
      <Button
      style={styles.addBtn}
      mode="contained"
      labelStyle={styles.plusSign}
      onPress={showModal}
      >
        +
      </Button>
    </>
    ),
    invites: () => (
      <View style={styles.tabTeamContent}>
      {invites.length > 0 ? (
        invites.map((invite,index) => {
          return <View key={index} style={styles.teamName}><Text>{invite.id}</Text></View>
        })
      ) : (
        <Text>You have no invites</Text>
      )}
    </View>
    ),
    members: () => (
      <>
      <View style={styles.tabTeamContent}>
      {users.length > 0 ? (
        users.map((user,index) => {
          return <View key={index} style={styles.teamName}><Text>{user.name}</Text></View>
        })
      ) : (
        <Text>No users available on the team</Text>
      )}
    </View>
    {selectedTeam != "" &&
    <Button
    style={styles.addBtn}
    mode="contained"
    labelStyle={styles.plusSign}
    onPress={showAddMemberModal}
    >
      +
    </Button>
  }
    </>
    ),
    experiments: () => (
      <View style={styles.tabContent}>
        {selectedTeam == "" ? (<Text>No team selected.</Text>):(<Text>Experiments information will show up here.</Text>)}
        
      </View>
    ),
  });

  return (
    <>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={false} // Shifting animation for active tabs
      />
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
        <TextInput
          mode="outlined"
          label="Team Name"
          value={teamName}
          onChangeText={text => setTeamName(text)}
        />
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={hideModal} style={styles.modalButton}>
            Close
          </Button>
          <Button mode="contained" onPress={handleCreateTeam} style={styles.modalButton}>
            OK
          </Button>
        </View>
      </Modal>

      <Modal visible={visibleAddMember} onDismiss={hideAddMemberModal} contentContainerStyle={styles.modalContainer}>
        <TextInput
          mode="outlined"
          label="User Email"
          value={addUserEmail}
          onChangeText={text => setAddUserEmail(text)}
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
          <Button mode="outlined" onPress={hideAddMemberModal} style={styles.modalButton}>
            Close
          </Button>
          <Button mode="contained" onPress={handleAddUser} style={styles.modalButton}>
            Send
          </Button>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
  },
  plusSign: {
    fontSize: 20,
    marginTop: 15,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    width: 100,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabTeamContent: {
    flex: 1,
    justifyContent:'flex-start',
    alignItems: 'flex-start',
  },
  teamName: {
    padding:15,
    backgroundColor: '#eee',
    width: '100%'
  },
  teamNameSelected: {
    padding:15,
    backgroundColor: '#ddd',
    width: '100%'
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },

});

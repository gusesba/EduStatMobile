import { GraphScreen } from "@/components/graphComponent";
import { useEffect, useState } from "react";
import { deleteJsonFile, deleteUserExperiment, getTeamExperiments, getUserExperiments, readEdsJsonFiles, saveJsonToFile, saveTeamNotes, saveUserNotes } from "./libs/experiments";
import { Dimensions, StyleSheet, View } from "react-native";
import { BottomNavigation, Button, IconButton, Modal, Text, TextInput } from "react-native-paper";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { isUserLogged } from "./libs/login";
import { useIsFocused } from "@react-navigation/native";
import { getTeams } from "./libs/teams";

export type TExperiment = {
  id: string,
  name: string,
  graphData: {
    points: { x: number, y: number }[]
  }
  parameters: {
    maxV: number,
    minv: number,
    step: number,
    delay: number
  },
  notes: string,
  teamId: string,
  userId: string
}


export default function Experiment() {
  const [index, setIndex] = useState(0);
  const [noteExperiment, setNoteExperiment] = useState<TExperiment | null>(null);
  const [modal, setModal] = useState(false);
  const [note, setNote] = useState("")
  const [selectedExperiments, setSelectedExperiments] = useState<TExperiment[]>([])
  const [selectedNoiseExperiments, setSelectedNoiseExperiments] = useState<TExperiment[]>([])
  const [meanExperiments, setMeanExperiments] = useState<TExperiment[]>([])
  const [routes] = useState([
    { key: 'experiments', title: 'Experiments', icon: 'account-group' },
    { key: 'notes', title: 'Notes', icon: 'account-group' },
    { key: 'graph', title: 'Graph', icon: 'account-group' },
  ]);
  const [experiments, setExperiments] = useState<TExperiment[]>([]);
  const [localExperiments, setLocalExperiments] = useState<TExperiment[]>([]);
  const [teamExperiments, setTeamExperiments] = useState<TExperiment[]>([]);
  const [teams,setTeams] = useState<{name:string,id:string}[]>([])
  const [noise,setNoise] = useState(false);
  const [addNote, setAddNote] = useState(false);

  const [userLogged, setUserLogged] = useState<string | null | undefined>(null);

  const isFocused = useIsFocused();

  const removeNoise = (experiment: TExperiment): TExperiment => {
    if (!experiment.graphData || !experiment.graphData.points) return experiment;
  
    const points = [...experiment.graphData.points]; // Preserva a imutabilidade
    const length = points.length;
  
    if (length === 0) return experiment;
  
    // Soma acumulada para otimização
    let cumulativeSum = 0;
  
    // Suavização para os primeiros 9 pontos
    for (let i = 0; i < Math.min(9, length); i++) {
      cumulativeSum += points[i].y;
      points[i] = { ...points[i], y: cumulativeSum / (i + 1) };
    }
  
    // Suavização para os pontos restantes
    for (let i = 9; i < length; i++) {
      cumulativeSum += points[i].y - (points[i - 10]?.y || 0);
      points[i] = { ...points[i], y: cumulativeSum / 10 };
    }
  
    return {
      ...experiment,
      graphData: { ...experiment.graphData, points },
    };
  };
  

  useEffect(()=>{
    const noNoiseExp = selectedExperiments.map((exp)=>removeNoise(exp))
    setSelectedNoiseExperiments(noNoiseExp);
  },[selectedExperiments])

  const handleOpenNotes = (experiment: TExperiment) => {
    setNoteExperiment(experiment)
    setModal(true);
  }

  const hideModal = () => {
    setNote("")
    setModal(false);
  }

  useEffect(() => {
      if(userLogged){
        getTeamsHandler()
      }
    },[userLogged,isFocused, addNote])

  useEffect(()=> {
    Promise.all(
      teams.map(async (team) => {
        return await getTeamExperiments(team.id);
      })
    ).then((x)=>setExperiments(x.flat()));
  },[teams])

  const getTeamsHandler = async () => {
      const [teams, status] = await getTeams()
      
      if(status == 200)
      {
        setTeams(teams)
      }
      else
        alert("Unknown Error!")
    }

  const width = Dimensions.get('window').width;
  useEffect(() => {
    //setExperiments([])
    isUserLogged().then((a) => {
      setUserLogged(a);
    })
    setTeamExperiments([])
    setNote("")
    setModal(false)
    setNoteExperiment(null)
    setIndex(0)
    setSelectedExperiments([])
    setSelectedNoiseExperiments([])
    setMeanExperiments([])
    setLocalExperiments([])
    setTeams([])
  }, [isFocused,addNote])

  const handleDeleteLocal = (id: string) => {
    deleteJsonFile(id).then(() => handleGetLocalExperiments());
  }

  const handleDeleteUser = async (id: string) => {
    const [data, status] = await deleteUserExperiment(id);
    handleGetUserExperiments();
  }

  const update = ()=> setAddNote((note)=>!note)

  const handleSaveNote = () => {
    if(noteExperiment)
    {
      if(noteExperiment.userId)
        saveUserNotes(noteExperiment.id, note+"      ").then(update)
      else if(noteExperiment.teamId)
        saveTeamNotes(noteExperiment.id,note+"       ",noteExperiment.teamId).then(update)
      else {
        const notes = noteExperiment.notes
                ? `${noteExperiment.notes}\n[${new Date().toISOString()}] - ${"Local Note"}\n${note}\n---------------------------------\n`
                : `[${new Date().toISOString()}] - ${"Local Note"}\n${note}\n---------------------------------\n`
        noteExperiment.notes = notes
        saveJsonToFile(noteExperiment.name,noteExperiment).then(update)
      }
    }

    setAddNote((note)=>!note);
   
  }


  const renderScene = BottomNavigation.SceneMap({
    experiments: () => (
      <>
        <View style={styles.tabTeamContent}>
          <ScrollView>
          <Text style={styles.expTitle}>Local Experiments</Text>
          {localExperiments.length > 0 ? (
            localExperiments.map((experiment) => {
              if (selectedExperiments.find((x) => x.id == experiment.id))
                return <View key={experiment.id} style={styles.teamNameSelected}><TouchableOpacity style={{ padding: 15 }} onPress={() => { setSelectedExperiments((experiments) => experiments.filter((ex) => ex.id != experiment.id)) }}><Text>{experiment.name}</Text></TouchableOpacity><View style={styles.btns}><IconButton onPress={() => handleOpenNotes(experiment)} style={{ height: 20, margin: 0 }} icon="pen" /><IconButton onPress={() => handleDeleteLocal(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View></View>
              return <View key={experiment.id} style={styles.teamName}><TouchableOpacity style={{ padding: 15 }} onPress={() => setSelectedExperiments((experiments) => [...experiments, experiment])}><Text>{experiment.name}</Text></TouchableOpacity><View style={styles.btns}><IconButton onPress={() => handleOpenNotes(experiment)} style={{ height: 20, margin: 0 }} icon="pen" /><IconButton onPress={() => handleDeleteLocal(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View></View>
            })
          ) : (
            <Text style={{ marginLeft: 10 }}>No Local Experiments Available.</Text>
          )}
          <Text style={styles.expTitle}>User Experiments</Text>
          {experiments.length > 0 ? (
            experiments.map((experiment) => {
              if (selectedExperiments.find((x) => x.id == experiment.id))
                return <View key={experiment.id} style={styles.teamNameSelected}><TouchableOpacity style={{ padding: 15 }} onPress={() => { setSelectedExperiments((experiments) => experiments.filter((ex) => ex.id != experiment.id)) }}><Text>{experiment.name}</Text></TouchableOpacity><View style={styles.btns}><IconButton onPress={() => handleOpenNotes(experiment)} style={{ height: 20, margin: 0 }} icon="pen" /><IconButton onPress={() => handleDeleteUser(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View></View>
              return <View key={experiment.id} style={styles.teamName}><TouchableOpacity style={{ padding: 15 }} onPress={() => setSelectedExperiments((experiments) => [...experiments, experiment])} ><Text>{experiment.name}</Text></TouchableOpacity><View style={styles.btns}><IconButton onPress={() => handleOpenNotes(experiment)} style={{ height: 20, margin: 0 }} icon="pen" /><IconButton onPress={() => handleDeleteUser(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View></View>
            })
          ) : (
            <Text style={{ marginLeft: 10 }}>No User Experiments Available.</Text>
          )}
          <Text style={styles.expTitle}>Teams Experiments</Text>
          {teamExperiments.length > 0 ? (
            teamExperiments.map((experiment) => {
              if (selectedExperiments.find((x) => x.id == experiment.id))
                return <View key={experiment.id} style={styles.teamNameSelected}><TouchableOpacity style={{ padding: 15 }} onPress={() => { setSelectedExperiments((experiments) => experiments.filter((ex) => ex.id != experiment.id)) }}><Text>{experiment.name}</Text></TouchableOpacity><View style={styles.btns}><IconButton onPress={() => handleOpenNotes(experiment)} style={{ height: 20, margin: 0 }} icon="pen" /><IconButton onPress={() => handleDeleteLocal(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View></View>
              return <View key={experiment.id} style={styles.teamName}><TouchableOpacity style={{ padding: 15 }} onPress={() => setSelectedExperiments((experiments) => [...experiments, experiment])}><Text>{experiment.name}</Text></TouchableOpacity><View style={styles.btns}><IconButton onPress={() => handleOpenNotes(experiment)} style={{ height: 20, margin: 0 }} icon="pen" /><IconButton onPress={() => handleDeleteLocal(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View></View>
            })
          ) : (
            <Text style={{ marginLeft: 10 }}>No Team Experiments Available.</Text>
          )}
          </ScrollView>
        </View>
      </>
    ),
    graph: () => {
      return <View className="m-16" >{noise ? <GraphScreen width_height={width * 0.9} actual={false} experiments={selectedNoiseExperiments.concat(meanExperiments)} /> :<GraphScreen width_height={width * 0.9} actual={false} experiments={selectedExperiments.concat(meanExperiments)} />}{selectedExperiments.filter((exp)=>exp.graphData!=null).length>0 && <><Button onPress={handleCalculateMean}>Mean</Button><Button onPress={()=>setNoise((noise)=>!noise)} >{noise ? "Remove Noise" : "Add Noise"}</Button></>}</View>
    },
    notes: () => (
      <>
        <View>
          {selectedExperiments.map((experiment) => {
            if (!experiment.notes) return null
            return <View key={experiment.id}><Text style={styles.noteTitle}>{experiment.name}</Text><Text>{experiment.notes}</Text></View>
          })}
        </View>
      </>
    )
  })

  const handleCalculateMean = () => {
    var meanPoints:{x:number,y:number}[] | null = [] 
    if(!noise) meanPoints = calculateMeanGraphFromExperiments(selectedExperiments);
    else meanPoints = calculateMeanGraphFromExperiments(selectedNoiseExperiments)
    if(meanPoints)
      setMeanExperiments([{ name: 'mean', graphData: { points: meanPoints } } as TExperiment])
  }

  useEffect(() => {
    setMeanExperiments([])
  }, [selectedExperiments])

  function interpolateY(points: { x: number; y: number }[], x: number): number {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (x >= p1.x && x <= p2.x) {
        // Linear interpolation formula
        return p1.y + ((x - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x);
      }
    }
    // If x is out of bounds, return the nearest y-value
    return x < points[0].x ? points[0].y : points[points.length - 1].y;
  }

  // Function to calculate the mean graph from a list of TExperiment objects
  function calculateMeanGraphFromExperiments(experiments: TExperiment[]): { x: number; y: number }[] | null {
    if (!experiments || experiments.length === 0) {
      return null
    }

    experiments = experiments.filter((exp)=>{
      return exp.graphData && exp.graphData.points && exp.graphData.points.length>0
    })

    const len = experiments[0].graphData.points.length

    for(var exp of experiments){
      if(exp.graphData.points.length != len)
      {
        alert('Experiments should have the same parameters')
        return null;
      }
    }

    for(var i = 0; i<len; i++){
      var x = experiments[0].graphData.points[i].x
      for(var exp of experiments){
        if(exp.graphData.points[i].x != x){
          alert('Experiments should have the same parameters')
          return null;
        }
      }
    }
    var points:{x:number,y:number}[] = [];
    for(var i = 0; i<len; i++){
      var total = 0;
      for(var exp of experiments)
        total += exp.graphData.points[i].y
      points = [...points, {x:experiments[0].graphData.points[i].x,y:total/experiments.length}]
    }
    return points;
  }

  useEffect(() => {
    if (userLogged) {
      handleGetUserExperiments();
    } else {
      setExperiments([])
    }
  }, [userLogged, isFocused, addNote])

  useEffect(() => {
    handleGetLocalExperiments();
  }, [isFocused])
  const handleGetUserExperiments = async () => {
    const [data, status] = await getUserExperiments();

    if (status == 200) {
      setExperiments(data);
    }
  }

  const handleGetLocalExperiments = async () => {
    const exp = await readEdsJsonFiles();
    setLocalExperiments(exp);
  }

  return (
    <>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={false} // Shifting animation for active tabs
      />
      <Modal visible={modal} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
        <TextInput
          mode="outlined"
          label="Note"
          multiline={true}
          value={note}
          onChangeText={text => setNote(text)}
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
    </>
  )
}

const styles = StyleSheet.create({
  tabTeamContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  teamNameSelected: {
    backgroundColor: '#ddd',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    backgroundColor: '#eee',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  expTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10
  },
  btns: {
    flexDirection: 'row',
    gap: 5
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
})
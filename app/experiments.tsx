import { GraphScreen } from "@/components/graphComponent";
import { useEffect, useState } from "react";
import { deleteJsonFile, getUserExperiments, readEdsJsonFiles, saveJsonToFile } from "./libs/experiments";
import { StyleSheet, View } from "react-native";
import { BottomNavigation, IconButton, Text } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { isUserLogged } from "./libs/login";

export type TExperiment = {
  id:string,
  name:string,
  graphData:{
    points:{x:number,y:number}[]
  }
  parameters:{
    maxV:number,
    minv:number,
    step:number,
    delay:number
  },
  notes:string,
  teamId:string,
  userId:string
}

export default function Experiment(){
  const [index, setIndex] = useState(0);
  const [selectedExperiments, setSelectedExperiments] = useState<TExperiment[]>([])
  const [routes] = useState([
    { key: 'experiments', title: 'Experiments', icon: 'account-group' },
    { key: 'notes', title: 'Notes', icon: 'account-group' },
    { key: 'graph', title: 'Graph', icon: 'account-group' },
  ]);
  const [experiments,setExperiments] = useState<TExperiment[]>([]);
  const [localExperiments,setLocalExperiments] = useState<TExperiment[]>([]);

  const [userLogged, setUserLogged] = useState<string|null|undefined>(null);

  useEffect(()=>{
    isUserLogged().then((a)=>{
      setUserLogged(a);
    })
  },[])

  const handleDeleteLocal = (id:string) => {
    deleteJsonFile(id).then(()=>handleGetLocalExperiments());
  }

  const renderScene = BottomNavigation.SceneMap({
    experiments: () => (
      <>
      <View style={styles.tabTeamContent}>
        <Text style={styles.noteTitle}>Local Experiments</Text>
        {localExperiments.length > 0 ? (
          localExperiments.map((experiment) => {
             if(selectedExperiments.find((x)=>x.id==experiment.id))
               return <View key={experiment.id} style={styles.teamNameSelected}><TouchableOpacity style={{padding:15}} onPress={()=>{setSelectedExperiments((experiments)=>experiments.filter((ex)=>ex.id!=experiment.id))}}><Text>{experiment.name}</Text></TouchableOpacity><IconButton onPress={()=>handleDeleteLocal(experiment.id)} style={{height:20,margin:0}} icon="delete"/></View>
            return <View key={experiment.id} style={styles.teamName}><TouchableOpacity style={{padding:15}} onPress={()=>setSelectedExperiments((experiments)=>[...experiments,experiment])}><Text>{experiment.name}</Text></TouchableOpacity><IconButton onPress={()=>handleDeleteLocal(experiment.id)} style={{height:20,margin:0}} icon="delete"/></View>
          })
        ) : (
          <Text>No Local Experiments Available.</Text>
        )}
        <Text style={styles.noteTitle}>User Experiments</Text>
        {experiments.length > 0 ? (
          experiments.map((experiment) => {
             if(selectedExperiments.find((x)=>x.id==experiment.id))
               return <View key={experiment.id} style={styles.teamNameSelected}><TouchableOpacity onPress={()=>{setSelectedExperiments((experiments)=>experiments.filter((ex)=>ex.id!=experiment.id))}}><Text>{experiment.name}</Text></TouchableOpacity></View>
            return <View key={experiment.id} style={{width:"100%"}}><TouchableOpacity onPress={()=>setSelectedExperiments((experiments)=>[...experiments,experiment])} style={styles.teamName}><Text>{experiment.name}</Text></TouchableOpacity></View>
          })
        ) : (
          <Text>No User Experiments Available.</Text>
        )}
      </View>
    </>
    ),
  graph: () => {
    return <GraphScreen experiments={selectedExperiments}/>
  },
  notes: () => (
    <>
    <View>
      {selectedExperiments.map((experiment)=>{
        if(!experiment.notes) return null
        return <View key={experiment.id}><Text style={styles.noteTitle}>{experiment.name}</Text><Text>{experiment.notes}</Text></View>
      })}
    </View>
    </>
  )
})

  useEffect(()=>{
    if(userLogged){
      handleGetUserExperiments();
    }
  },[userLogged])

  useEffect(()=>{
    handleGetLocalExperiments();
  },[])
  const handleGetUserExperiments = async () => {
    const [data,status] = await getUserExperiments();

    if(status == 200)
    {
      setExperiments(data);
    }
  }

  const handleGetLocalExperiments = async () => {
    const exp = await readEdsJsonFiles();
    setLocalExperiments(exp);
  }

  return <BottomNavigation
  navigationState={{ index, routes }}
  onIndexChange={setIndex}
  renderScene={renderScene}
  shifting={false} // Shifting animation for active tabs
/>
}

const styles = StyleSheet.create({
  tabTeamContent: {
    flex: 1,
    justifyContent:'flex-start',
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
  noteTitle:{
    fontSize:20,
    fontWeight:'bold'
  },
})
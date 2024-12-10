import { GraphScreen } from "@/components/graphComponent";
import { useEffect, useState } from "react";
import { getUserExperiments } from "./libs/experiments";
import { StyleSheet, View } from "react-native";
import { BottomNavigation, Text } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

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

  const renderScene = BottomNavigation.SceneMap({
    experiments: () => (
      <>
      <View style={styles.tabTeamContent}>
        {experiments.length > 0 ? (
          experiments.map((experiment) => {
             if(selectedExperiments.find((x)=>x.id==experiment.id))
               return <View key={experiment.id} style={styles.teamNameSelected}><TouchableOpacity onPress={()=>{setSelectedExperiments((experiments)=>experiments.filter((ex)=>ex.id!=experiment.id))}}><Text>{experiment.name}</Text></TouchableOpacity></View>
            return <View key={experiment.id} style={{width:"100%"}}><TouchableOpacity onPress={()=>setSelectedExperiments((experiments)=>[...experiments,experiment])} style={styles.teamName}><Text>{experiment.name}</Text></TouchableOpacity></View>
          })
        ) : (
          <Text>No Experiments Available.</Text>
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
    handleGetUserExperiments();
  },[])
  const handleGetUserExperiments = async () => {
    const [data,status] = await getUserExperiments();

    if(status == 200)
    {
      setExperiments(data);
    }
  }

  return <BottomNavigation
  navigationState={{ index, routes }}
  onIndexChange={setIndex}
  renderScene={renderScene}
  shifting={false} // Shifting animation for active tabs
/>
  if(experiments.length == 0) return <View></View>
  return <GraphScreen experiments={experiments}/>
}

const styles = StyleSheet.create({
  tabTeamContent: {
    flex: 1,
    justifyContent:'flex-start',
    alignItems: 'flex-start',
  },
  teamNameSelected: {
    padding:15,
    backgroundColor: '#ddd',
    width: '100%'
  },
  teamName: {
    padding:15,
    backgroundColor: '#eee',
    width: '100%'
  },
  noteTitle:{
    fontSize:20,
    fontWeight:'bold'
  }
})
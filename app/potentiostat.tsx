import { router } from 'expo-router';
import { useState } from 'react';
import { View, StyleSheet} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import { getValueForStore } from './libs/secureStore';

export default function Potentiostat() {
  const [isConnected,setIsConnected] = useState(false);
  const [maxVoltage, setMaxVoltage] = useState('');
  const [minVoltage, setMinVoltage] = useState('');

  return (  
    <View>
      <View style={styles.connectBtnView}>
          <Button style={styles.connectBtn} mode='contained' onPress={()=>setIsConnected(!isConnected)}>{!isConnected? "Connect" : "Disconnect"}</Button>
          {isConnected ? <Text>Battery: 40%</Text>: null}
      </View>
      
      {/* <View style={styles.container}>
        <View style={styles.inputs}>
          <Button mode='contained' onPress={()=>setIsConnected(!isConnected)}>{!isConnected? "Connect" : "Disconnect"}</Button>
          {isConnected ? <Text>Battery: 40%</Text>: null}
        </View>
      </View>{
        isConnected?(
      <View style={styles.experimentView}>
        <View style={styles.inputs}>
          <TextInput
            mode='outlined'
            label="Min Voltage"
            value={minVoltage}
            onChangeText={minVoltage => setMinVoltage(minVoltage)}
          />
          <TextInput
            mode='outlined'
            label="Max Voltage"
            onChangeText={maxVoltage => setMaxVoltage(maxVoltage)}
          />
        </View>
        <Button mode='contained' onPress={()=>getValueForStore("user_token")}>Start Experiment</Button>
      </View>):<View style={styles.experimentView}><Text>The potentiostat is not connected</Text></View>} */}
    </View>
  );
}

const styles = StyleSheet.create({
  connectBtnView:{
    alignSelf:'center',
    marginTop:20,
    alignItems:'center',
    gap:5
  },
  connectBtn:{
    width:200
  }
  
});

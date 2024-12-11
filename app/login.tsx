import { router} from 'expo-router';
import {  useState } from 'react';
import { View, StyleSheet} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import { login } from './libs/login';
import { removeStore } from './libs/secureStore';

export default function Login() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");


  const loginHandler = async () => {
    const status = await login(text,password);

    if(status == 201)
    {
      router.navigate('/potentiostat')
    }
    else if(status == 400)
    {
      alert("User or Password invalid!")
    }
    else
    {
      alert("Unknown Error!")
    }

  }

  const handleLocalUse = async () => {
    await removeStore('user_token')
    await removeStore('user_id')
    router.navigate('/potentiostat')
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='displayLarge'>Sign In</Text>
      <View style={styles.inputs}>
        <TextInput
          mode='outlined'
          label="Email"
          value={text}
          onChangeText={text => setText(text)}
        />
        <TextInput
          mode='outlined'
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={password => setPassword(password)}
        />
      </View>
      <View style={styles.buttons}>
        <Button mode='contained' style={styles.button} onPress={loginHandler}>Sign In</Button>
        <Text variant='labelSmall' style={{alignSelf:'center', marginBottom:-10}}>First time?</Text>
        <Button onPress={()=>router.navigate('/register')} mode='contained-tonal' style={styles.button}>Sign Up</Button>
        <Text variant='labelSmall' style={{alignSelf:'center', marginBottom:-10}}>No connection?</Text>
        <Button onPress={handleLocalUse} mode='contained-tonal' style={styles.button}>Local Use</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    gap:30
  },
  title:{
    alignSelf:'center'
  },
  text: {
    fontSize: 50,
    color: '#fff',
  },
  buttons: {
    flex: 1,
    flexDirection: 'column', // Default, items stack vertically

    alignItems: 'center', // Center items horizontally
    gap: 20,
  },
  button: {
    width: 200
  },
  inputs: {
    marginHorizontal: 20,
    gap:10
  }

  
});

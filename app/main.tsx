import { Link, router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { removeStore } from './libs/secureStore';

export default function Main() {

  const handleLocalUse = async () => {
    await removeStore('user_token')
    await removeStore('user_id')
    router.navigate('/potentiostat')
  }

  return (
    <View style={styles.container}>
      <Text variant='displayLarge'>EduStat</Text>
      <View style={styles.buttons}>
        <Button onPress={() => router.navigate("/login")} mode='contained' style={styles.button}>Login</Button>
        <Button onPress={handleLocalUse} mode='contained-tonal' style={styles.button}>Local Use</Button>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100

  },
  text: {
    fontSize: 50,
    color: '#fff',
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    gap: 20
  },
  button: {
    width: 200
  }

});

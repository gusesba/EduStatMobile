import { Text, View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edustat</Text>
      <View style={styles.buttons}>
        <Button mode='elevated'>Login</Button>
        <Button mode='outlined'>Home</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    paddingTop: 100

  },
  text: {
    fontSize: 50,
    color: '#fff',
  },
  buttons: {
    flex: 1,
    justifyContent:'center',
    gap: 10
  }
  
});

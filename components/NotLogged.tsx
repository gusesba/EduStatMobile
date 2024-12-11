import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const NotLogged = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You need to be logged in to see this page</Text>
      <Button
        onPress={() => router.navigate('/login')}
        mode="contained-tonal"
        style={styles.button}
      >
        Sign In
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // Optional: add padding for better spacing
  },
  text: {
    marginBottom: 16, // Spacing between the text and button
    textAlign: 'center', // Center the text content
  },
  button: {
    width: 200, // Optional: set a fixed width for the button
  },
});

export default NotLogged;

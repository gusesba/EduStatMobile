import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';


export default function Educhat() {
  const [text, setText] = useState("");


  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text variant="headlineLarge" style={styles.title}>
          How can I help?
        </Text>
        <Text variant="labelMedium" style={styles.subtitle}>
          Ask something about the app, or something related to electrochemistry.
        </Text>
      </View>

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Send a message to EduChat"
        value={text}
        onChangeText={(text) => setText(text)}
        right={<TextInput.Icon icon="arrow-right-bold-circle-outline" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  textContainer: {
    marginTop: 50,
    alignItems: "center",
    width: "80%", // Define um limite comum para o título e subtítulo
    alignSelf: "center", // Centraliza o container
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignSelf: "center",
  },
});

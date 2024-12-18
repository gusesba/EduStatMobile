import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';
import { baseUrl } from './libs/config';
import { getValueForStore } from './libs/secureStore';
import NotLogged from '@/components/NotLogged';
import { useIsFocused } from '@react-navigation/native';
import { isUserLogged } from './libs/login';

export default function Chatbot() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [userLogged, setUserLogged] = useState<string | null | undefined>(null);

  const isFocused = useIsFocused();

  const fetchUserId = async () => {
    return getValueForStore('user_id');
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const userId = await fetchUserId();
        if (userId) {
          const savedMessages = await AsyncStorage.getItem(`chatMessages_${userId}`);
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    isUserLogged().then((a) => {
      setUserLogged(a);
    })

    loadMessages()
    setMessage("")
    setLoading(false)
  }, [isFocused]);

  useEffect(() => {
    const saveMessages = async () => {
      try {
        const userId = await fetchUserId();
        if (userId) {
          await AsyncStorage.setItem(`chatMessages_${userId}`, JSON.stringify(messages));
        }
      } catch (error) {
        console.error('Erro ao salvar mensagens:', error);
      }
    };

    saveMessages();
  }, [messages]);

  const fetchChat = async () => {

    try {
      setLoading(true);

      const url = `${baseUrl}/send-chatbot-message`;

      const response = await axios.post(
        url,
        { message },
      );

      setMessages([...messages, { role: 'user', content: message }, { role: 'bot', content: response.data.content }]);
      setMessage('');
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  };

  if (!userLogged)
    return <NotLogged />

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.chatContainer}>
        {messages.map((message, index) => (
          <View key={index} style={message.role === 'user' ? styles.userMessage : styles.botMessage}>
            {message.role === 'user' ? (
              <Text style={styles.messageText}>{message.content}</Text>
            ) : (
              <Markdown style={styles.messageText}>{message.content}</Markdown>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          value={message}
          onChangeText={setMessage}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0066cc" style={styles.loading} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={fetchChat}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    width: '100%',
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1f5fe',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  messageText: {
    //fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loading: {
    marginLeft: 10,
  },
});
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
import { Button, ButtonText } from '@/components/ui/button';
import { B } from '@expo/html-elements';
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';


import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContentText,
  AccordionIcon,
  AccordionContent,
} from "@/components/ui/accordion"
import { Divider } from "@/components/ui/divider"
import { ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon"

export default function Chatbot() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [presetQuestionsState, setPresetQuestionsState] = useState<boolean>(false);
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
  const questions = [
    {
      "item": "a",
      "question": "What is a potentiostat?",
      "answer": "A potentiostat is an electronic device used to control the potential difference between a working electrode and a reference electrode in an electrochemical system."
    },
    {
      "item": "b",
      "question": "What is the purpose of a potentiostat?",
      "answer": "It is used to perform electrochemical experiments, such as cyclic voltammetry and chronoamperometry, allowing the study of redox reactions and material properties."
    },
    {
      "item": "c",
      "question": "What is cyclic voltammetry (CV)?",
      "answer": "Cyclic voltammetry is an electrochemical technique where the voltage applied to the working electrode is varied cyclically while recording the resulting current, enabling the analysis of redox reactions."
    },
    {
      "item": "d",
      "question": "What kind of reactions can be studied with cyclic voltammetry?",
      "answer": "Cyclic voltammetry is used to study oxidation-reduction (redox) reactions, electron transfer kinetics, and the electrochemical behavior of materials."
    },
    {
      "item": "e",
      "question": "What are the main components of a potentiostat system?",
      "answer": "A potentiostat system typically includes: a working electrode (WE) where the reaction of interest occurs, a reference electrode (RE) to maintain a stable reference potential, and a counter electrode (CE) to complete the electrical circuit."
    },
    {
      "item": "f",
      "question": "How does a potentiostat work?",
      "answer": "The potentiostat applies a controlled voltage between the working and reference electrodes while measuring the current flow between the working and counter electrodes."
    },
    {
      "item": "g",
      "question": "What are the advantages of cyclic voltammetry?",
      "answer": "Cyclic voltammetry provides information about reaction kinetics, electrochemical reversibility, and the presence of redox-active species in a sample."
    },
    {
      "item": "h",
      "question": "What is the difference between cyclic voltammetry and linear sweep voltammetry?",
      "answer": "In cyclic voltammetry, the voltage is applied in a cyclic manner, while in linear sweep voltammetry, the voltage is applied in a single direction."
    },
    {
      "item": "i",
      "question": "What is the purpose of the reference electrode in a potentiostat?",
      "answer": "The reference electrode provides a stable and known potential to ensure accurate voltage control in the system."
    },
    {
      "item": "j",
      "question": "What are common materials used for working electrodes?",
      "answer": "Common materials include glassy carbon, platinum, and gold, depending on the type of electrochemical study."
    },
    {
      "item": "k",
      "question": "What is an oxidation peak in cyclic voltammetry?",
      "answer": "An oxidation peak appears when a species loses electrons (oxidation), generating a current response in the voltammogram."
    },
    {
      "item": "l",
      "question": "What is a reduction peak in cyclic voltammetry?",
      "answer": "A reduction peak occurs when a species gains electrons (reduction), also generating a current response in the voltammogram."
    },
    {
      "item": "m",
      "question": "What does the shape of a cyclic voltammogram indicate?",
      "answer": "The shape provides insights into reaction kinetics, reversibility, and diffusion-controlled or adsorption-controlled processes."
    },
    {
      "item": "n",
      "question": "What is the difference between reversible and irreversible electrochemical reactions?",
      "answer": "Reversible reactions exhibit well-defined oxidation and reduction peaks with small separation, while irreversible reactions show a large separation between peaks or a lack of one peak."
    },
    {
      "item": "o",
      "question": "How can cyclic voltammetry be used in battery research?",
      "answer": "Cyclic voltammetry helps study charge-discharge behavior, redox processes, and the stability of electrode materials in battery systems."
    },
    {
      "item": "p",
      "question": "How is cyclic voltammetry used in biosensors?",
      "answer": "It is used to detect biomolecules through redox reactions, often combined with modified electrodes containing enzymes, nanoparticles, or other active materials."
    },
    {
      "item": "q",
      "question": "What is scan rate in cyclic voltammetry, and why is it important?",
      "answer": "Scan rate is the speed at which the potential is varied. Faster scan rates provide information about reaction kinetics, while slower scan rates help in studying diffusion-controlled processes."
    },
    {
      "item": "r",
      "question": "What is electrochemical impedance spectroscopy (EIS), and how does it differ from cyclic voltammetry?",
      "answer": "EIS measures the impedance of an electrochemical system over a range of frequencies, while cyclic voltammetry measures current as a function of voltage."
    },
    {
      "item": "s",
      "question": "How can cyclic voltammetry be used in corrosion studies?",
      "answer": "It helps analyze the corrosion behavior of materials by measuring redox reactions and identifying protective coatings’ effectiveness."
    },
    {
      "item": "t",
      "question": "What are some real-world applications of cyclic voltammetry?",
      "answer": "Cyclic voltammetry is used in battery research, biosensors, corrosion analysis, drug development, environmental monitoring, and electrocatalysis studies."
    }
  ]
  if (!userLogged)
    return <NotLogged />

  if (!presetQuestionsState) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='bg-[#f8f8f8]'
      >
        <View style={styles.container} className="ml-8 mr-8 mb-20 bg-[#f8f8f8]">
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.chatContainer} className='bg-[#f8f8f8]'>
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
            <Button onPress={() => { setPresetQuestionsState(true) }} size="lg" className="mr-1">
              <ButtonText>?</ButtonText>
            </Button>
            <TextInput
              style={styles.input}
              placeholder="Write your question..."
              value={message}
              onChangeText={setMessage}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#0066cc" style={styles.loading} />
            ) : (
              <TouchableOpacity style={styles.button} onPress={fetchChat}>
                <Text style={styles.buttonText}>Ask</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <View className="items-center ml-8 mr-8 mb-16">
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          <Accordion
            size="md"
            variant="filled"
            type="single"
            isCollapsible={true}
            isDisabled={false}
            className="m-5 w-[90%] border border-outline-200"
          >
            {questions.map(({ item, question, answer }) => (
              <React.Fragment key={item}>
                <AccordionItem value={item}>
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }) => (
                        <>
                          <AccordionTitleText>{question}</AccordionTitleText>
                          {isExpanded ? (
                            <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                          ) : (
                            <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                          )}
                        </>
                      )}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>
                    <AccordionContentText>{answer}</AccordionContentText>
                  </AccordionContent>
                </AccordionItem>
                <Divider />
              </React.Fragment>
            ))}
          </Accordion>
          <Button
            onPress={() => {
              setPresetQuestionsState(false);
            }}
            className="w-1/2 justify-center items-center"
          >
            <ButtonText>Go Back</ButtonText>
          </Button>
        </ScrollView>
      </View>
    );

  }



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
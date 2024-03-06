import React, {useState, useEffect, useRef} from 'react';
import * as GoogleGenerativeAI from '@google/generative-ai';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {FontAwesome} from 'react-native-vector-icons';

const GeminiGPT = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatlistRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');

  const API_KEY = 'AIzaSyA51nIAtZyxK_JIdiKsctsBaQALekq2I78';

  const sendMessage = async () => {
    setLoading(true);
    const userMessage = {text: userInput, user: true};
    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({model: 'gemini-pro'});
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    setMessages(prevMessages => [
      ...prevMessages,
      userMessage,
      {text, user: false},
    ]);

    setLoading(false);
    setUserInput('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (flatlistRef.current) {
      flatlistRef.current.scrollToEnd({animated: true});
    }
  };

  const selectFromGallery = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        performTextRecognition(imageUri);
      }
    });
  };

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.user ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        onLayout={scrollToBottom}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="black"
        />
        {loading && <ActivityIndicator size="small" color="black" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffff', marginTop: 50},
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 15,
    maxWidth: '100%',
  },
  userMessageContainer: {
    backgroundColor: '#B7C9F2',
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    backgroundColor: '#E8E8E8',
    alignSelf: 'flex-start',
  },
  messageText: {fontSize: 16},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B7C9F2',
  },
});

export default GeminiGPT;

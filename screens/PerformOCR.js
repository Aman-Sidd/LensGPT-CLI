import TextRecognition from '@react-native-ml-kit/text-recognition';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');

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

  const takePhoto = () => {
    launchCamera({}, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
  };

  const performTextRecognition = async uri => {
    try {
      const result = await TextRecognition.recognize(uri);
      console.log('Result: ', result);
      setRecognizedText(result.text);
    } catch (error) {
      console.error('Error performing text recognition:', error);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={selectFromGallery}>
        <Text>Select from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={takePhoto}>
        <Text>Take Photo</Text>
      </TouchableOpacity>

      {selectedImage && (
        <View style={{marginTop: 20}}>
          <Image
            source={{uri: selectedImage}}
            style={{width: 200, height: 200}}
          />
          <Text style={{textAlign: 'center', marginTop: 10}}>
            Recognized Text:
          </Text>
          <Text>{recognizedText}</Text>
        </View>
      )}
    </View>
  );
};

export default App;

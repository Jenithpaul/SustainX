import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext'; // Update theme import path
import { router } from 'expo-router'; // Import the router

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: number;
  image?: string; // Add optional image property
}

type ChatScreenRouteProp = RouteProp<{ params: { itemId: string; itemTitle: string; recipientId: string; recipientName: string } }, 'params'>;

export default function ChatScreen({ 
  route,
  onBack
}: { 
  route: ChatScreenRouteProp,
  onBack?: () => void
}) {
  const { itemId, itemTitle, recipientId, recipientName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const theme = useTheme(); // Access the current theme

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const chatKey = `chat_${itemId}_${recipientId}`;
      const savedMessages = await AsyncStorage.getItem(chatKey);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Initialize with welcome message
        const initialMessage: Message = {
          id: '1',
          text: `Hello! I'm interested in your "${itemTitle}". Is it still available?`,
          sender: 'user',
          timestamp: Date.now(),
        };
        setMessages([initialMessage]);
        await AsyncStorage.setItem(chatKey, JSON.stringify([initialMessage]));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');

    try {
      const chatKey = `chat_${itemId}_${recipientId}`;
      await AsyncStorage.setItem(chatKey, JSON.stringify(updatedMessages));
      
      // Simulate response after a delay
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Yes, it\'s still available! When would you like to meet?',
          sender: 'other',
          timestamp: Date.now() + 1,
        };
        
        const withResponse = [...updatedMessages, responseMessage];
        setMessages(withResponse);
        AsyncStorage.setItem(chatKey, JSON.stringify(withResponse));
      }, 1000);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const sendImage = async (imageUri: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: '',
      sender: 'user',
      timestamp: Date.now(),
      image: imageUri, // Attach the image URI
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      const chatKey = `chat_${itemId}_${recipientId}`;
      await AsyncStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving image message:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      sendImage(result.assets[0].uri); // Send the selected image
    }
  };

  const handleProfilePress = () => {
    router.push({
      pathname: "/(tabs)/Marketplace",
      params: { 
        selectedItem: itemId,
        method: 'viewItem'
      }
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' 
          ? [styles.userMessage, { backgroundColor: theme.primary }] 
          : [styles.otherMessage, { backgroundColor: theme.backgroundPrimary }],
      ]}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.messageImage} />
      ) : (
        <Text style={[
          styles.messageText, 
          { color: item.sender === 'user' ? theme.textOnPrimary : theme.textPrimary }
        ]}>
          {item.text}
        </Text>
      )}
      <Text style={[styles.timestamp, { color: item.sender === 'user' ? theme.textOnPrimary : theme.textSecondary }]}>
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={[styles.header, { backgroundColor: theme.backgroundPrimary, borderBottomColor: theme.border }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          onPress={handleProfilePress}
          style={styles.headerContent}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${recipientName}` }}
            style={styles.profileImage}
          />
          <View>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{recipientName}</Text>
            <Text style={[styles.itemTitle, { color: theme.textSecondary }]}>{itemTitle}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.messagesList, { backgroundColor: theme.background }]}
        inverted={false}
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.backgroundPrimary, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
          <Ionicons name="image" size={24} color={theme.primary} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={theme.textSecondary}
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: inputText.trim() ? theme.primary : theme.backgroundSecondary }]}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
        >
          <Ionicons name="send" size={20} color={inputText.trim() ? theme.textOnPrimary : theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 14,
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});

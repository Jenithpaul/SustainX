import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: number;
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

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userMessage : styles.otherMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.headerTitle}>{recipientName}</Text>
          <Text style={styles.itemTitle}>{itemTitle}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
});
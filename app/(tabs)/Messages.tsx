import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatList from '../../components/ChatList';
import ChatScreen from '../../components/ChatScreen';

interface ChatDetails {
  itemId: string;
  itemTitle: string;
  recipientId: string;
  recipientName: string;
}

export default function Messages() {
  const { recipientId, itemId } = useLocalSearchParams<{ recipientId?: string, itemId?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeChatDetails, setActiveChatDetails] = useState<ChatDetails | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  
  // Load all existing chats from AsyncStorage
  const loadChats = async () => {
    try {
      setIsLoading(true);
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      // Filter only chat keys
      const chatKeys = keys.filter(key => key.startsWith('chat_'));
      
      const chatList = [];
      
      // Process each chat to extract metadata
      for (const chatKey of chatKeys) {
        const chatData = await AsyncStorage.getItem(chatKey);
        if (chatData) {
          const messages = JSON.parse(chatData);
          if (messages && messages.length > 0) {
            // Extract IDs from the chat key
            const [_, itemId, recipientId] = chatKey.split('_');
            
            // Get recipient name from last message metadata or use a default
            let recipientName = 'User ' + recipientId;
            let itemTitle = 'Item ' + itemId;
            
            // Try to get item details if available
            try {
              const marketplaceItems = await AsyncStorage.getItem('marketplaceItems');
              if (marketplaceItems) {
                const items = JSON.parse(marketplaceItems);
                const item = items.find((item: any) => item.id === itemId);
                if (item) {
                  itemTitle = item.title;
                  recipientName = item.username;
                }
              }
            } catch (error) {
              console.log('Error fetching item details:', error);
            }
            
            chatList.push({
              id: recipientId,
              name: recipientName,
              lastMessage: messages[messages.length - 1].text,
              timestamp: messages[messages.length - 1].timestamp,
              itemId,
              itemTitle
            });
          }
        }
      }
      
      setChats(chatList);
      
      // If we have recipientId and itemId from params, open that chat
      if (recipientId && itemId) {
        const chat = chatList.find(c => c.id === recipientId && c.itemId === itemId);
        if (chat) {
          setActiveChatDetails({
            recipientId,
            itemId,
            recipientName: chat.name,
            itemTitle: chat.itemTitle
          });
        }
      }
      
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh chat list when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadChats();
    }, [recipientId, itemId])
  );

  const handleChatSelect = (chatDetails: ChatDetails) => {
    setActiveChatDetails(chatDetails);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activeChatDetails ? (
        <ChatScreen 
          route={{ 
            key: "chat", 
            name: "params", 
            params: activeChatDetails 
          }}
          onBack={() => setActiveChatDetails(null)}
        />
      ) : chats.length > 0 ? (
        <ChatList onChatSelect={handleChatSelect} chats={chats} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubText}>
            Start a conversation from the Marketplace to see messages here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

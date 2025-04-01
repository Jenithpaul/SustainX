import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatList from '../../components/ChatList';
import ChatScreen from '../../components/ChatScreen';
import Header from '../../components/Header';
import { useTheme } from '../../ui/ThemeProvider'; // Import the useTheme hook

interface ChatDetails {
  itemId: string;
  itemTitle: string;
  recipientId: string;
  recipientName: string;
}

export default function Messages() {
  const { recipientId, itemId } = useLocalSearchParams<{ recipientId?: string; itemId?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeChatDetails, setActiveChatDetails] = useState<ChatDetails | null>(null);
  const [chats, setChats] = useState<any[]>([]);

  const theme = useTheme(); // Access the current theme

  // Load all existing chats from AsyncStorage
  const loadChats = async () => {
    try {
      setIsLoading(true);
      const keys = await AsyncStorage.getAllKeys();
      const chatKeys = keys.filter((key) => key.startsWith('chat_'));
      const chatList = [];

      for (const chatKey of chatKeys) {
        const chatData = await AsyncStorage.getItem(chatKey);
        if (chatData) {
          const messages = JSON.parse(chatData);
          if (messages && messages.length > 0) {
            const [_, itemId, recipientId] = chatKey.split('_');
            let recipientName = 'User ' + recipientId;
            let itemTitle = 'Item ' + itemId;

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
              itemTitle,
            });
          }
        }
      }

      setChats(chatList);

      if (recipientId && itemId) {
        const chat = chatList.find((c) => c.id === recipientId && c.itemId === itemId);
        if (chat) {
          setActiveChatDetails({
            recipientId,
            itemId,
            recipientName: chat.name,
            itemTitle: chat.itemTitle,
          });
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Add the Header component */}
      <Header currentTab="Messages" />
      {activeChatDetails ? (
        <ChatScreen
          route={{
            key: 'chat',
            name: 'params',
            params: activeChatDetails,
          }}
          onBack={() => setActiveChatDetails(null)}
        />
      ) : chats.length > 0 ? (
        <ChatList onChatSelect={handleChatSelect} chats={chats} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textPrimary }]}>No messages yet</Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
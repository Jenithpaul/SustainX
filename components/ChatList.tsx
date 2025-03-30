import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: number;
  itemId?: string;
  itemTitle?: string;
}

// Default chats for demonstration if none are provided
const defaultChats: Chat[] = [
  { id: '1', name: 'Person 1', lastMessage: 'Last message...', timestamp: 1634567890123 },
  { id: '2', name: 'Person 2', lastMessage: 'Last message...', timestamp: 1634567890123 },
  { id: '3', name: 'Person 3', lastMessage: 'Last message...', timestamp: 1634567890123 },
  { id: '4', name: 'Person 4', lastMessage: 'Last message...', timestamp: 1634567890123 },
];

export default function ChatList({ 
  onChatSelect, 
  chats = defaultChats 
}: { 
  onChatSelect: (chatDetails: any) => void,
  chats?: Chat[]
}) {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => onChatSelect({ 
        itemId: item.itemId || item.id, 
        itemTitle: item.itemTitle || 'Item Title', 
        recipientId: item.id, 
        recipientName: item.name 
      })}
    >
      <Image 
        source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder profile picture
        style={styles.profilePicture} 
      />
      <View style={styles.chatDetails}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.chatTimestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.id}-${item.itemId || ''}`}
      contentContainerStyle={styles.chatList}
    />
  );
}

const styles = StyleSheet.create({
  chatList: {
    padding: 16,
    backgroundColor: '#f0fdf4', // Lighter green background
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Light gray divider
    backgroundColor: '#ffffff', // White background for chat items (text bubble)
    borderRadius: 8, // Slightly rounded corners
    marginBottom: 16, // Increased space between chat items
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#10b981', // Green border for profile pictures
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46', // Dark green text for chat names
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#047857', // Medium green text
    marginTop: 2,
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#064e3b', // Deep green text
  },
});
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#999',
  },
});
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';

export default function ChatList({ onChatSelect, chats }: { onChatSelect: (chatDetails: any) => void; chats: any[] }) {
  const theme = useTheme();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.chatItem, { 
        backgroundColor: theme.backgroundPrimary, 
        borderBottomColor: theme.border 
      }]}
      onPress={() => onChatSelect({
        itemId: item.itemId,
        itemTitle: item.itemTitle,
        recipientId: item.id,
        recipientName: item.name,
      })}
    >
      <Image
        source={{ uri: 'https://via.placeholder.com/50' }}
        style={[styles.profilePicture, { borderColor: theme.primary }]}
      />
      <View style={styles.chatDetails}>
        <Text style={[styles.chatName, { color: theme.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.chatLastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.lastMessage || "No messages yet"}
        </Text>
      </View>
      <Text style={[styles.chatTimestamp, { color: theme.textSecondary }]}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.id}_${item.itemId}`}
      contentContainerStyle={[styles.chatList, { backgroundColor: theme.background }]}
    />
  );
}

const styles = StyleSheet.create({
  chatList: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatLastMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  chatTimestamp: {
    fontSize: 12,
  },
});
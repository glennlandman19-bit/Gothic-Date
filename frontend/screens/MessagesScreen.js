import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function MessagesScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Fetch conversations from API
    // TODO: Call backend to get user's matches
    const mockConversations = [
      { id: 1, name: 'Raven', lastMessage: 'Hey, how are you?', unread: 2 },
      { id: 2, name: 'Luna', lastMessage: 'Would love to chat!', unread: 0 },
      { id: 3, name: 'Morgana', lastMessage: 'See you soon! 🖤', unread: 1 },
    ];
    setConversations(mockConversations);
  }, []);

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Chat', { conversationId: item.id, name: item.name })}
    >
      <View style={styles.conversationInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  badge: {
    backgroundColor: '#8b008b',
    borderRadius: 10,
    minWidth: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

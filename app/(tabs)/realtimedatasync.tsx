import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { realtimedb as database } from '../../utils/firebase';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';

const RealtimeDataSync = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMessages(messageList);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const addMessage = () => {
    if (newMessage.trim()) {
      const messagesRef = ref(database, 'messages');
      push(messagesRef, {
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.text} - {new Date(item.timestamp).toLocaleString()}</Text>
        )}
      />
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: 'gray', padding: 10 }}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Enter a new message"
        />
        <Button title="Send" onPress={addMessage} />
      </View>
    </View>
  );
};

export default RealtimeDataSync;
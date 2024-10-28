import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { db } from '../../utils/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const FirestoreDataSync = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, 'gradebook_messages_collection');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const addMessage = async () => {
    if (newMessage.trim()) {
      try {
        await addDoc(collection(db, 'gradebook_messages_collection'), {
          text: newMessage,
          timestamp: serverTimestamp(),
        });
        setNewMessage('');
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.text} - {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'Pending...'}</Text>
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

export default FirestoreDataSync;   
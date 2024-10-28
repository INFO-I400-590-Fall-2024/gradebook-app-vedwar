import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';

export default function FirebaseExample() {
  const [items, setItems] = useState<any[]>([]);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'items'));
    const itemsList = [];
    querySnapshot.forEach((doc) => {
      itemsList.push({ id: doc.id, ...doc.data() });
    });
    setItems(itemsList);
  };

  const addItem = async () => {
    if (newItemName.trim() === '') return;

    try {
      const docRef = await addDoc(collection(db, 'items'), { name: newItemName });
      console.log('Document written with ID: ', docRef.id);
      setNewItemName('');
      fetchItems(); // Refresh the list after adding a new item
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Firebase Data</Text>
      {items.map((item) => (
        <Text key={item.id} style={styles.item}>{item.name}</Text>
      ))}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder="Enter new item name"
        />
        <Button title="Add Item" onPress={addItem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
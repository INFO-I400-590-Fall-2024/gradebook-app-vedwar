import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { functions } from '../../utils/firebase'; // Import the functions from your firebase.js file
import { httpsCallable } from 'firebase/functions';

const HelloWorldScreen = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callHelloWorldFunction = async () => {
    setLoading(true);
    setError(null);

    try {
      const helloWorld = httpsCallable(functions, 'helloWorld');
      const result = await helloWorld();
      setMessage(result.data);
    } catch (err) {
      setError('Error calling function: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Function Demo</Text>
      <Button
        title="Call Hello World Function"
        onPress={callHelloWorldFunction}
        disabled={loading}
      />
      {loading && <Text style={styles.loading}>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loading: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HelloWorldScreen;
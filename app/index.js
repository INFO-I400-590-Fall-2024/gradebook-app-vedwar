import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { router } from 'expo-router';

const Auth = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (name, value) => {
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Log input event
    // logEvent(analytics, `${name}_input`);
  };

  const handleAuth = async (action) => {
    const { email, password } = credentials;
    try {
      let userCredential;
      if (action === 'signUp') {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // logEvent(analytics, 'sign_up', { method: 'email' });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        // logEvent(analytics, 'login', { method: 'email' });
        router.push('/(tabs)/realtimedatasync');
      }
      setUser(userCredential.user);
      setError('');
    } catch (error) {
      setError(error.message);
      // logEvent(analytics, `${action}_error`, { error_message: error.message });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <AuthenticatedView user={user} onSignOut={handleSignOut} />
      ) : (
        <UnauthenticatedView
          credentials={credentials}
          onInputChange={handleInputChange}
          onSignUp={() => handleAuth('signUp')}
          onSignIn={() => handleAuth('signIn')}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const AuthenticatedView = ({ user, onSignOut }) => (
  <View>
    <Text>Welcome, {user.email}!</Text>
    <Button title="Sign Out" onPress={onSignOut} />
  </View>
);

const UnauthenticatedView = ({ credentials, onInputChange, onSignUp, onSignIn }) => (
  <View>
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={credentials.email}
      onChangeText={(text) => onInputChange('email', text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      value={credentials.password}
      onChangeText={(text) => onInputChange('password', text)}
      secureTextEntry
    />
    <View style={styles.button}>
      <Button title="Sign Up" onPress={onSignUp} />
    </View>
    <View style={styles.button}>
      <Button style={styles.button} title="Sign In" onPress={onSignIn} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginTop: 12,
  },
  button: {
    marginVertical: 5
  }
});

export default Auth;
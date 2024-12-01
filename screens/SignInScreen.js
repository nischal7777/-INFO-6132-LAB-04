import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.navigate('EventList'))
      .catch((error) => Alert.alert('Error', error.message));
  };

  return (
    <View style={styles.container}>
  
      <Title style={styles.title}>Log In</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="flat"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="flat"
      />
      <Button mode="contained" onPress={handleSignIn} style={styles.button}>
        Log In
      </Button>
      <Text style={styles.linkText}>
        Don’t have an account?{' '}
        <Text onPress={() => navigation.navigate('SignUp')} style={styles.link}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#1e3a8a',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#2563eb',
    width: '100%',
    marginTop: 10,
  },
  linkText: {
    marginTop: 20,
    fontSize: 14,
    color: '#64748b',
  },
  link: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

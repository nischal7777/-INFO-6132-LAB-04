import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('SignIn');
      })
      .catch((error) => Alert.alert('Error', error.message));
  };

  return (
    <View style={styles.container}>
 
      <Title style={styles.title}>Sign Up</Title>
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
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>
      <Text style={styles.linkText}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('SignIn')} style={styles.link}>
          Log In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefce8',
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
    color: '#b45309',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#d97706',
    width: '100%',
    marginTop: 10,
  },
  linkText: {
    marginTop: 20,
    fontSize: 14,
    color: '#9ca3af',
  },
  link: {
    color: '#d97706',
    fontWeight: 'bold',
  },
});

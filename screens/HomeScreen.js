import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users', user.uid, 'favorites'));
        const favoritesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favoritesData);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchFavorites();
  }, [user.uid]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await deleteDoc(doc(firestore, 'users', user.uid, 'favorites', favoriteId));
      setFavorites(favorites.filter(favorite => favorite.id !== favoriteId));
      Alert.alert('Success', 'Event removed from favorites');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button mode="contained" onPress={() => handleRemoveFavorite(item.id)} style={styles.removeButton}>
          Remove
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('EventDetail', { eventId: item.id })} style={styles.viewButton}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    elevation: 3,
    borderRadius: 8,
    padding: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  removeButton: {
    backgroundColor: '#ff4c4c',
    paddingHorizontal: 10,
  },
  viewButton: {
    borderColor: '#6200ee',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
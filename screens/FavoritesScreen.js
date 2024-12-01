import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const userId = auth.currentUser.uid;
      const favoritesRef = collection(firestore, `users/${userId}/favorites`);
      const querySnapshot = await getDocs(favoritesRef);

      const favoritesList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        let formattedDate = new Date();

        if (data.eventData?.date?.seconds) {
          formattedDate = new Date(data.eventData.date.seconds * 1000);
        }

        return {
          id: doc.id,
          ...data.eventData,
          date: formattedDate,
        };
      });

      setFavorites(favoritesList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load favorites: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(firestore, `users/${userId}/favorites`, id);
      await deleteDoc(docRef);
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== id));
      Alert.alert('Success', 'Favorite deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete favorite: ' + error.message);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph numberOfLines={2} style={styles.cardDescription}>
          {item.description}
        </Paragraph>
        <Text style={styles.cardDate}>{item.date.toLocaleDateString()}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#43a047" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Favorites</Title>
      </View>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  deleteButton:{
    color: "#fff",
    backgroundColor: "red"
  },
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#2e7d32',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    color: '#2e7d32',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingBottom: 16,
  },
});

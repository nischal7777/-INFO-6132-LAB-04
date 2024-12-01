import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, FAB, Card, Title, Paragraph, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.replace('SignIn');
      return;
    }

    const q = query(
      collection(firestore, 'events'),
      where('creatorId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const eventsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsList);
        setLoading(false);
      },
      (error) => {
        Alert.alert('Error', error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('SignIn');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph numberOfLines={2} style={styles.cardDescription}>
          {item.description}
        </Paragraph>
        <Text style={styles.cardDate}>
          {new Date(item.date.seconds * 1000).toLocaleDateString()}
        </Text>
      </Card.Content>
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
        <Title style={styles.headerTitle}>My Events</Title>
        <Button mode="contained" onPress={() => navigation.navigate('Favorites')} style={[ styles.button,{ backgroundColor: '#43a047' }]}>
          Favorites List
        </Button>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events found. Create one!</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <Button mode="contained" onPress={() => navigation.navigate('EditEvent')} style={[ styles.button,{ backgroundColor: '#43a047', width: "5rem", marginBottom: "2rem"}]}>
        Create
      </Button>
      <Button mode="contained" onPress={handleSignOut} style={[ styles.button,{ backgroundColor: '#43a047'}]}>
        Sign Out
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#388e3c',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4f4f4f',
    marginVertical: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#43a047',
  },
  signOutFab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#d32f2f',
  },
});
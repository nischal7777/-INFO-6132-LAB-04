import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

export default function EventDetailScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadEvent();
    checkFavoriteStatus();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const eventDoc = await getDoc(doc(firestore, 'events', eventId));
      if (eventDoc.exists()) {
        setEvent({ id: eventDoc.id, ...eventDoc.data() });
      } else {
        Alert.alert('Error', 'Event not found');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const userId = auth.currentUser.uid;
      const favoriteRef = doc(firestore, `users/${userId}/favorites/${eventId}`);
      const favoriteDoc = await getDoc(favoriteRef);
      setIsFavorite(favoriteDoc.exists());
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const userId = auth.currentUser.uid;
      const favoriteRef = doc(firestore, `users/${userId}/favorites/${eventId}`);

      if (isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        const eventDate = event?.date?.seconds
          ? new Date(event.date.seconds * 1000)
          : new Date();

        await setDoc(favoriteRef, {
          eventId,
          addedAt: new Date(),
          eventData: {
            title: event.title,
            description: event.description,
            date: eventDate,
          },
        });
      }

      setIsFavorite(!isFavorite);
      Alert.alert(
        'Success',
        isFavorite ? 'Removed from favorites' : 'Added to favorites'
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'events', eventId));
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#43a047" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Title style={styles.title}>{event.title}</Title>
            <Button mode="contained" onPress={toggleFavorite} style={[ styles.button,{ backgroundColor: '#43a047', width: "10rem"}]}>
              { isFavorite ? "Remove favourite" : "Add favourite"  }
            </Button>
          </View>

          <Paragraph style={styles.date}>
            {event?.date?.seconds
              ? new Date(event.date.seconds * 1000).toLocaleDateString()
              : 'No date available'}
          </Paragraph>

          <Paragraph style={styles.description}>
            {event.description}
          </Paragraph>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('EditEvent', { eventId })}
              style={[styles.button, { backgroundColor: '#43a047' }]}
            >
              Edit
            </Button>

            <Button
              mode="contained"
              onPress={handleDelete}
              style={[styles.button, { backgroundColor: '#d32f2f' }]}
            >
              Delete
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: '#388e3c',
    fontWeight: 'bold',
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  date: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4f4f4f',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

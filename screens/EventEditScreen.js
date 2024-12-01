import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

export default function EventEditScreen({ route, navigation }) {
  const { eventId } = route.params || {};
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const eventDoc = await getDoc(doc(firestore, 'events', eventId));
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        setTitle(eventData.title);
        setDescription(eventData.description);
        setDate(new Date(eventData.date.seconds * 1000));
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        date,
        creatorId: auth.currentUser.uid,
        updatedAt: new Date(),
      };

      if (!eventId) {
        eventData.createdAt = new Date();
      }

      const docRef = doc(firestore, 'events', eventId || Math.random().toString(36).substr(2, 9));
      await setDoc(docRef, eventData, { merge: true });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        error={!!errors.title}
      />
      {errors.title && <HelperText type="error">{errors.title}</HelperText>}

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={4}
        error={!!errors.description}
      />
      {errors.description && <HelperText type="error">{errors.description}</HelperText>}

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        {date.toLocaleDateString()}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        {eventId ? 'Update Event' : 'Create Event'}
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
  input: {
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  dateButton: {
    marginVertical: 16,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#43a047',
    paddingVertical: 8,
  },
});
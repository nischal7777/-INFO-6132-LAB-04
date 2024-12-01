import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import EventListScreen from '../screens/EventListScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import EventEditScreen from '../screens/EventEditScreen';

const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="SignIn" 
          component={SignInScreen} 
          options={{ 
            title: 'Welcome Back',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ 
            title: 'Create Account',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="EventList" 
          component={EventListScreen} 
          options={{ 
            title: 'Your Events',
            headerLeft: null // Disable back button
          }} 
        />
        <Stack.Screen 
          name="EventDetail" 
          component={EventDetailScreen} 
          options={{ title: 'Event Details' }} 
        />
        <Stack.Screen 
          name="EditEvent" 
          component={EventEditScreen} 
          options={({ route }) => ({
            title: route.params?.eventId ? 'Edit Event' : 'Create Event'
          })} 
        />
        <Stack.Screen 
          name="Favorites" 
          component={FavoritesScreen} 
          options={{ title: 'Favorite Events' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
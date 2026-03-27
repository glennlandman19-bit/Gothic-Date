import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SwipeScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch profiles from API
    // TODO: Call backend /api/swipes/suggestions/:userId
    const mockProfiles = [
      { id: 1, name: 'Raven', age: 26, image: 'https://via.placeholder.com/400x600?text=Raven' },
      { id: 2, name: 'Luna', age: 24, image: 'https://via.placeholder.com/400x600?text=Luna' },
      { id: 3, name: 'Morgana', age: 25, image: 'https://via.placeholder.com/400x600?text=Morgana' },
    ];
    setProfiles(mockProfiles);
  }, []);

  const handleSwipeRight = () => {
    // Like action
    console.log('Liked:', profiles[currentIndex].name);
    // TODO: Call backend /api/swipes/swipe with liked: true
    setCurrentIndex(currentIndex + 1);
  };

  const handleSwipeLeft = () => {
    // Pass action
    console.log('Passed:', profiles[currentIndex].name);
    // TODO: Call backend /api/swipes/swipe with liked: false
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No more profiles</Text>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentIndex(0)}>
          <Text style={styles.buttonText}>Reload Profiles</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gothic Date</Text>
      
      <View style={styles.card}>
        <Image source={{ uri: profile.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{profile.name}, {profile.age}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.passButton} onPress={handleSwipeLeft}>
          <Text style={styles.actionText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={handleSwipeRight}>
          <Text style={styles.actionText}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    width: width - 40,
    height: 500,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '80%',
  },
  info: {
    flex: 1,
    padding: 15,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8b008b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 28,
    color: '#fff',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8b008b',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

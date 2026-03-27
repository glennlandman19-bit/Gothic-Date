import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function SubscriptionScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const mockSubscriptions = [
      {
        id: 1,
        plan: 'Free',
        price: '$0',
        swipes: '10 swipes/day',
        messaging: false,
        features: ['Basic swiping', 'Limited matches']
      },
      {
        id: 2,
        plan: 'Daily',
        price: '$2.99',
        swipes: '50 swipes/day',
        messaging: true,
        features: ['Unlimited messaging', 'Extended swipes', 'See who liked you']
      },
      {
        id: 3,
        plan: 'Monthly',
        price: '$9.99',
        swipes: '200+ swipes/month',
        messaging: true,
        features: ['All daily features', 'Premium filters', 'Rewind feature']
      },
      {
        id: 4,
        plan: 'Yearly',
        price: '$99.99',
        swipes: 'Unlimited swipes',
        messaging: true,
        features: ['All features', 'Best value', 'Priority support']
      },
    ];
    setSubscriptions(mockSubscriptions);
  }, []);

  const handleSubscribe = (plan) => {
    console.log('Subscribe to:', plan);
    // TODO: Call backend /api/subscriptions/create-payment-intent
    navigation.navigate('Payment', { plan });
  };

  const renderSubscription = ({ item }) => (
    <View style={styles.subscriptionCard}>
      <Text style={styles.planName}>{item.plan}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.swipes}>{item.swipes}</Text>
      {item.features.map((feature, index) => (
        <Text key={index} style={styles.feature}>✓ {feature}</Text>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSubscribe(item.plan)}
      >
        <Text style={styles.buttonText}>Subscribe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Your Plan</Text>
      <FlatList
        data={subscriptions}
        renderItem={renderSubscription}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subscriptionCard: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8b008b',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b008b',
    marginBottom: 5,
  },
  swipes: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 15,
  },
  feature: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#8b008b',
    padding: 12,
    borderRadius: 6,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

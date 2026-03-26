import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwipeScreen from './SwipeScreen';
import MessagesScreen from './MessagesScreen';
import SubscriptionScreen from './SubscriptionScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Swipe" component={SwipeScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Subscription" component={SubscriptionScreen} />
    </Tab.Navigator>
  );
};

export default App;
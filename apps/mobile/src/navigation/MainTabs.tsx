import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../design-system/Colors';

import HomeScreen from '../screens/home/HomeScreen';
import ScanHomeScreen from '../screens/scan/ScanHomeScreen';
import ScanTutorialScreen from '../screens/scan/ScanTutorialScreen';
import ScanCaptureScreen from '../screens/scan/ScanCaptureScreen';
import ScanProcessingScreen from '../screens/scan/ScanProcessingScreen';
import ScanResultsScreen from '../screens/scan/ScanResultsScreen';
import GaitAnalysisScreen from '../screens/gait/GaitAnalysisScreen';
import OrthoticBuilderScreen from '../screens/orthotic/OrthoticBuilderScreen';
import DesignDetailScreen from '../screens/orthotic/DesignDetailScreen';
import DesignListScreen from '../screens/orthotic/DesignListScreen';
import CheckoutScreen from '../screens/orders/CheckoutScreen';
import OrderConfirmationScreen from '../screens/orders/OrderConfirmationScreen';
import OrderListScreen from '../screens/orders/OrderListScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import ShoeCollectionScreen from '../screens/profile/ShoeCollectionScreen';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';

// Scan Stack
const ScanStack = createNativeStackNavigator();
function ScanNavigator() {
  return (
    <ScanStack.Navigator screenOptions={{ headerShown: false }}>
      <ScanStack.Screen name="ScanHome" component={ScanHomeScreen} />
      <ScanStack.Screen name="ScanTutorial" component={ScanTutorialScreen} />
      <ScanStack.Screen name="ScanCapture" component={ScanCaptureScreen} />
      <ScanStack.Screen name="ScanProcessing" component={ScanProcessingScreen} />
      <ScanStack.Screen name="ScanResults" component={ScanResultsScreen} />
      <ScanStack.Screen name="GaitAnalysis" component={GaitAnalysisScreen} />
    </ScanStack.Navigator>
  );
}

// Design Stack
const DesignStack = createNativeStackNavigator();
function DesignNavigator() {
  return (
    <DesignStack.Navigator screenOptions={{ headerShown: false }}>
      <DesignStack.Screen name="DesignList" component={DesignListScreen} />
      <DesignStack.Screen name="OrthoticBuilder" component={OrthoticBuilderScreen} />
      <DesignStack.Screen name="DesignDetail" component={DesignDetailScreen} />
    </DesignStack.Navigator>
  );
}

// Orders Stack
const OrderStack = createNativeStackNavigator();
function OrderNavigator() {
  return (
    <OrderStack.Navigator screenOptions={{ headerShown: false }}>
      <OrderStack.Screen name="OrderList" component={OrderListScreen} />
      <OrderStack.Screen name="Checkout" component={CheckoutScreen} />
      <OrderStack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <OrderStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrderStack.Navigator>
  );
}

// Profile Stack
const ProfileStack = createNativeStackNavigator();
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="ShoeCollection" component={ShoeCollectionScreen} />
      <ProfileStack.Screen name="Subscription" component={SubscriptionScreen} />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.gray[200],
          paddingBottom: 4,
          height: 84,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Scan: focused ? 'scan' : 'scan-outline',
            Designs: focused ? 'layers' : 'layers-outline',
            Orders: focused ? 'cart' : 'cart-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanNavigator} />
      <Tab.Screen name="Designs" component={DesignNavigator} />
      <Tab.Screen name="Orders" component={OrderNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

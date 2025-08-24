import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './src/context/cartContext';

import ShopScreen from './src/screens/ShopScreen';
import CartScreen from './src/screens/CartScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fffaf5', 
  },
};

export default function App() {
  return (
    <CartProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fffaf5' }} edges={['top', 'left', 'right']}>
        <NavigationContainer theme={AppTheme}>
          <Stack.Navigator
            initialRouteName="Shop"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right', 
            }}
          >
            <Stack.Screen name="Shop" component={ShopScreen} />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{
                headerShown: false,
                title: 'Keranjang',
                headerStyle: { backgroundColor: '#ffcc00' },
                headerTintColor: '#000',
                headerTitleStyle: { fontWeight: 'bold' },
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{
                headerShown: false,
                title: 'Pembayaran',
                headerStyle: { backgroundColor: '#ffcc00' },
                headerTintColor: '#000',
                headerTitleStyle: { fontWeight: 'bold' },
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="Success"
              component={OrderSuccessScreen}
              options={{
                headerShown: false,
                animation: 'fade',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </CartProvider>
  );
}

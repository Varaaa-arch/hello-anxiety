import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useCart } from '../context/cartContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ✅ type untuk navigation
type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Payment: undefined;
};

type CartScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Cart'
>;

type Props = {
  navigation: CartScreenNavigationProp;
};

export default function CartScreen({ navigation }: Props) {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* ✅ Header manual */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>Keranjang</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Kalau keranjang kosong */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Keranjang kosong</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 80
            }}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>
                    Rp {item.price.toLocaleString()}
                  </Text>

                  {/* ✅ kontrol qty */}
                  <View style={styles.qtyControl}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(item.id, item.qty - 1)}
                    >
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(item.id, item.qty + 1)}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Tombol checkout */}
          <View
            style={[styles.checkoutWrapper, { paddingBottom: insets.bottom + 10 }]}
          >
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalPrice}>Rp {total.toLocaleString()}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Payment')}
            >
              <Text style={styles.checkoutText}>Lanjut ke Pembayaran</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999'
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8
  },
  details: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    fontSize: 14,
    color: '#888'
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  qtyButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 16
  },
  checkoutWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6600'
  },
  checkoutButton: {
    backgroundColor: '#ffcc00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  }
});

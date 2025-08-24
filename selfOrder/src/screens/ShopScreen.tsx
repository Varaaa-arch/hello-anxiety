// src/screens/ShopScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Linking, TextInput } from 'react-native';
import { useCart } from '../context/cartContext';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { id: '1', name: 'Donat Gula', price: 3000, image: require('../asset/donut/gula.jpeg') },
  { id: '2', name: 'Donat Coklat', price: 3000, image: require('../asset/donut/coklatc.jpg') },
  { id: '3', name: 'Donat Strawberry', price: 3000, image: require('../asset/donut/strawberry.jpeg') },
  { id: '4', name: 'Donat Tiramisu', price: 3000, image: require('../asset/donut/tiramisu.jpg') },
  { id: '5', name: 'Donat Matcha', price: 3000, image: require('../asset/donut/matcha.jpg') },
  { id: '6', name: 'Donat Red Velvet', price: 3000, image: require('../asset/donut/redvelvett.jpg') },
  { id: '6', name: 'Donat Vanilla', price: 3000, image: require('../asset/donut/vanillaa.jpg') },
  { id: '6', name: 'Donat Caramel', price: 3000, image: require('../asset/donut/caramel.jpg') },
];

export default function ShopScreen({ navigation }: any) {
  const { addToCart, cartItems } = useCart();
  const [search, setSearch] = useState('');

  const handleBannerPress = () => {
    Linking.openURL('https://wa.me/6285692787638?text=Halo%20saya%20mau%20pesan%20donat%20promo%20Beli%205%20Gratis%201');
  };

  // Filter menu berdasarkan pencarian
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header dengan Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Cari produk..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="cart-outline" size={28} color="#000" />
          {cartItems.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Banner Promo Gambar */}
      <TouchableOpacity onPress={handleBannerPress} activeOpacity={0.8}>
        <Image
          source={require('../asset/donut/banner.png')}
          style={styles.bannerImage}
        />
      </TouchableOpacity>

      {/* Tulisan Produk */}
      <Text style={styles.sectionTitle}>Produk</Text>

      {/* Menu List */}
      <FlatList
        data={filteredItems}
        numColumns={2}
        key={'two-columns'}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>Rp {item.price.toLocaleString()}</Text>
              <TouchableOpacity onPress={() => addToCart(item)}>
                <Ionicons name="add-circle" size={28} color="#ffcc00" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 6,
  },
  cartIcon: { position: 'relative' },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bannerImage: {
    width: '100%',
    height: 230,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: { width: '100%', height: 120, borderRadius: 8, resizeMode: 'cover', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 6 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { fontSize: 14, color: '#555', fontWeight: '600' },
});

// src/screens/OrderSuccessScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Alert,
} from 'react-native';
import API from '../api/api';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Fungsi untuk generate HTML struk
const generateStrukHTML = (
  queueNumber: string,
  items: { name: string; qty: number; price: number }[],
  total: number
) => {
  const rows = items
    .map(
      (item) =>
        `<tr><td>${item.name}</td><td>${item.qty}</td><td>Rp ${item.price.toLocaleString(
          'id-ID'
        )}</td></tr>`
    )
    .join('');
  return `
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { color: #ffcc00; text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      td, th { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
      tfoot td { font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Order Berhasil!</h1>
    <p>Nomor Antrian: <strong>${queueNumber}</strong></p>
    <table>
      <thead>
        <tr><th>Item</th><th>Qty</th><th>Harga</th></tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr><td colspan="2">Total</td><td>Rp ${total.toLocaleString('id-ID')}</td></tr>
      </tfoot>
    </table>
    <p style="text-align:center;margin-top:20px;">Terima kasih telah memesan!</p>
  </body>
  </html>
  `;
};

export default function OrderSuccessScreen({ route, navigation }: any) {
  const [queueNumber, setQueueNumber] = useState<string>('001');
  const [countdown, setCountdown] = useState(5);
  const [isSharing, setIsSharing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await API.post('/api/antrian/next');
        setQueueNumber(res.data.nextQueue); 
      } catch (err) {
        console.error('Gagal ambil nomor antrian:', err);
      }
    };
    fetchQueue();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: countdown * 1000,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();

    if (countdown === 0) {
      navigation.navigate('Shop');
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, fadeAnim, progressAnim, navigation]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const handleGeneratePDF = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      // Contoh items, sesuaikan dengan keranjang sebenarnya
      const items = [
        { name: 'Donat Coklat', qty: 2, price: 10000 },
        { name: 'Donat Keju', qty: 1, price: 12000 },
      ];
      const total = items.reduce((acc, i) => acc + i.qty * i.price, 0);

      const html = generateStrukHTML(queueNumber, items, total);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Gagal membuat PDF');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Order Berhasil!</Text>
        <Text style={styles.queue}>Nomor Antrian Mu</Text>
        <Text style={styles.number}>{queueNumber}</Text>

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: progressWidth }]}
          />
        </View>

        <Text style={styles.countdown}>Kembali dalam {countdown}</Text>

        {/* Tombol cetak / share PDF */}
        <TouchableOpacity
          style={[styles.pdfBtn, isSharing && { opacity: 0.6 }]}
          onPress={handleGeneratePDF}
          disabled={isSharing}
        >
          <Text style={styles.pdfBtnText}>
            {isSharing ? 'Sedang Membuka...' : 'Cetak / Bagikan Struk'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fffaf0',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: 'rgba(255, 204, 0, 0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffcc00',
    marginBottom: 8,
  },
  queue: {
    fontSize: 18,
    color: '#444',
    marginBottom: 4,
  },
  number: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ffcc00',
    marginVertical: 16,
    fontFamily: 'monospace',
  },
  progressBarBackground: {
    height: 10,
    width: '80%',
    backgroundColor: '#fff1b8',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#ffcc00',
    borderRadius: 20,
  },
  countdown: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  pdfBtn: {
    marginTop: 20,
    backgroundColor: '#ffcc00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  pdfBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
  },
});

// src/screens/PaymentScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/cartContext';
import api from '../api/api';

export default function PaymentScreen({ navigation }: any) {
  const { total, clearCart } = useCart();

  const [method, setMethod] = useState<string | null>(null);
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);

  const [qrImage, setQrImage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const paymentMethods = useMemo(() => ([
    { id: 'Cash', icon: require('../asset/donut/cash.webp') },
    { id: 'QRIS', icon: require('../asset/donut/qrisss.webp') },
  ]), []);

  const finalTotal = Math.max(0, total - total * discount);

  const applyPromo = () => {
    const valid = ['HAIANXIETY', 'XIRPL'];
    if (valid.includes(promo.toUpperCase())) {
      setDiscount(0.1);
      setModalSuccess(true);
      setModalMessage('Kode promo berhasil dipakai');
    } else {
      setDiscount(0);
      setModalSuccess(false);
      setModalMessage('Kode promo tidak valid');
    }
    setModalVisible(true);
  };

  const createOrderId = () => `ORD-${Date.now()}`;

  const generateQR = async () => {
    try {
      setLoading(true);
      const id = createOrderId();
      const res = await api.post('/api/payment/qris', {
        orderId: id,
        amount: Math.round(finalTotal),
      });
      if (!res.data?.success) throw new Error('Gagal generate QRIS');

      setOrderId(res.data.orderId);
      setQrImage(res.data.qrImage); 
      setQrModalVisible(true);
      setWaiting(true);
      startPolling(res.data.orderId);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Gagal', e?.message || 'Gagal generate QRIS');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (id: string) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get('/api/payment/status', { params: { orderId: id } });
        if (res.data?.success && res.data.status === 'PAID') {
          onPaid();
        }
      } catch (e) {
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const onPaid = () => {
    stopPolling();
    setWaiting(false);
    setQrModalVisible(false);
    setQrImage(null);
    setOrderId(null);
    clearCart();
    navigation.replace('Success', { queueNumber: Math.floor(Math.random() * 900) + 100 });
  };

  const cancelQR = () => {
    stopPolling();
    setWaiting(false);
    setQrModalVisible(false);
    setQrImage(null);
    setOrderId(null);
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const handlePayment = async () => {
    if (!method) {
      setShowPaymentAlert(true);
      return;
    }
    if (method === 'QRIS') {
      if (!loading && !waiting) await generateQR();
      return;
    }
    clearCart();
    navigation.replace('Success', { queueNumber: Math.floor(Math.random() * 900) + 100 });
  };

  const normalizedQrUri = qrImage || null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Metode Pembayaran</Text>

        {paymentMethods.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.method, method === m.id && styles.selected]}
            onPress={() => setMethod(m.id)}
            disabled={loading || waiting}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={m.icon} style={styles.icon} />
              <Text style={styles.methodText}>{m.id}</Text>
            </View>
            {method === m.id && <Text style={{ fontSize: 12, color: '#444' }}>Dipilih</Text>}
          </TouchableOpacity>
        ))}

        {/* Kode Promo */}
        <View style={styles.promoContainer}>
          <TextInput
            style={styles.promoInput}
            placeholder="Kode Promo"
            value={promo}
            onChangeText={(t) => setPromo(t.toUpperCase())}
            autoCapitalize="characters"
            editable={!loading && !waiting}
          />
          <TouchableOpacity style={styles.applyBtn} onPress={applyPromo} disabled={loading || waiting}>
            <Text style={{ color: '#111', fontWeight: 'bold' }}>Pakai</Text>
          </TouchableOpacity>
        </View>

        {/* Ringkasan */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Harga Donat</Text>
            <Text>Rp {total.toLocaleString('id-ID')}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryRow}>
                <Text>Diskon</Text>
                <Text>- Rp {(total * discount).toLocaleString('id-ID')}</Text>
              </View>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={{ fontWeight: 'bold' }}>Total</Text>
            <Text style={{ fontWeight: 'bold' }}>Rp {finalTotal.toLocaleString('id-ID')}</Text>
          </View>
        </View>

        {/* Tombol Bayar */}
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment} disabled={loading || waiting}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ color: '#111', fontWeight: 'bold', fontSize: 16 }}>
              {method === 'QRIS' ? 'Bayar' : 'Bayar'}
            </Text>
          )}
        </TouchableOpacity>

        {method === 'QRIS' && (
          <Text style={styles.tipText}>
            Setelah QR tampil, scan pakai e-wallet (OVO/Gopay/DANA/ShopeePay). Status akan dicek otomatis.
          </Text>
        )}
      </ScrollView>

      {/* Notifikasi Promo */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: modalSuccess ? 'green' : 'red' }]}>
              {modalSuccess ? 'Berhasil' : 'Gagal'}
            </Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pilih Metode */}
      <Modal animationType="fade" transparent visible={showPaymentAlert} onRequestClose={() => setShowPaymentAlert(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: 'red' }]}>Peringatan</Text>
            <Text style={styles.modalMessage}>Pilih metode pembayaran terlebih dahulu</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowPaymentAlert(false)}>
              <Text style={styles.modalButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QRIS */}
      <Modal animationType="slide" transparent visible={qrModalVisible} onRequestClose={cancelQR}>
        <View style={styles.qrModalBackdrop}>
          <View style={styles.qrModalCard}>
            <Text style={styles.qrTitle}>Scan QRIS</Text>
            {!!orderId && <Text style={styles.qrSubtitle}>Order ID: {orderId}</Text>}

            {normalizedQrUri ? (
              <Image source={{ uri: normalizedQrUri }} style={styles.qrImage} />
            ) : (
              <View style={[styles.qrImage, { alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator />
              </View>
            )}

            <View style={{ gap: 10, width: '100%', marginTop: 10 }}>
              {/* <TouchableOpacity
                style={styles.qrPrimaryBtn}
                onPress={onPaid} // tombol manual selesai biar cepet aj sih
                disabled={!waiting}
              >
                <Text style={styles.qrPrimaryText}>Sudah Bayar </Text>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.qrSecondaryBtn} onPress={cancelQR} disabled={loading}>
                <Text style={styles.qrSecondaryText}>Batal</Text>
              </TouchableOpacity>
            </View>

            {waiting && <Text style={styles.waitingText}>Menunggu pembayaran...</Text>}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 30, backgroundColor: '#f8f8f8', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  method: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selected: { borderColor: '#ffcc00', backgroundColor: '#f1f0ff' },
  icon: { width: 32, height: 32, marginRight: 12, resizeMode: 'contain' },
  methodText: { fontSize: 16 },
  promoContainer: { flexDirection: 'row', marginTop: 20, marginBottom: 20 },
  promoInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  applyBtn: {
    backgroundColor: '#ffcc00',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  summary: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  payBtn: {
    backgroundColor: '#ffcc00',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  tipText: { fontSize: 12, color: '#666', marginTop: 10 },

  // modal umum
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: 300, backgroundColor: '#fff', borderRadius: 15, padding: 20, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  modalMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  modalButton: { backgroundColor: '#ffcc00', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 10 },
  modalButtonText: { fontWeight: 'bold', color: '#111' },

  // QR modal
  qrModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 20, justifyContent: 'center', alignItems: 'center' },
  qrModalCard: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center' },
  qrTitle: { fontSize: 18, fontWeight: 'bold' },
  qrSubtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  qrImage: { width: 240, height: 240, marginTop: 16, borderRadius: 12, backgroundColor: '#f2f2f2' },
  qrPrimaryBtn: { backgroundColor: '#111', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  qrPrimaryText: { color: '#fff', fontWeight: 'bold' },
  qrSecondaryBtn: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  qrSecondaryText: { color: '#111', fontWeight: '600' },
  waitingText: { marginTop: 8, fontSize: 12, color: '#666' },
});

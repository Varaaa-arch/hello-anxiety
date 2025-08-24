import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import API from '../api/api'; 

export default function OrderSuccessScreen({ route, navigation }: any) {
  const [queueNumber, setQueueNumber] = useState<string>("001"); 
  const [countdown, setCountdown] = useState(5);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await API.post("/api/antrian/next");
        setQueueNumber(res.data.nextQueue); // <-- sesuaikan dengan backend
      } catch (err) {
        console.error("Gagal ambil nomor antrian:", err);
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
});

import { PermissionsAndroid, Platform } from 'react-native';

export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Izin Storage',
        message: 'Aplikasi butuh akses untuk menyimpan struk di Download',
        buttonPositive: 'Izinkan',
        buttonNegative: 'Tolak',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Request permission error:', err);
    return false;
  }
};

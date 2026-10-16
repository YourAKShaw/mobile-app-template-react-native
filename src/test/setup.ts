// Runs before each test file. Keep global test configuration here.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

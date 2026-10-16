import { fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { jsonResponse, renderWithProviders } from '@/test/render';

import { PostListScreen } from '../PostListScreen';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

it('renders posts returned by the API and opens one on press', async () => {
  fetchMock.mockResolvedValue(
    jsonResponse([
      { id: 1, userId: 1, title: 'First post', body: 'Hello' },
      { id: 2, userId: 1, title: 'Second post', body: 'World' },
    ]),
  );

  await renderWithProviders(<PostListScreen />);

  expect(await screen.findByText('First post')).toBeOnTheScreen();
  expect(screen.getByText('Second post')).toBeOnTheScreen();

  await fireEvent.press(screen.getByText('Second post'));
  expect(router.push).toHaveBeenCalledWith({ pathname: '/posts/[id]', params: { id: '2' } });
});

it('shows an error with a retry button when the request fails', async () => {
  fetchMock.mockResolvedValue(jsonResponse({}, 500));

  await renderWithProviders(<PostListScreen />);

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'The server returned an error. Try again later.',
  );
  expect(screen.getByRole('button', { name: 'Try again' })).toBeOnTheScreen();
});

it('shows an empty state when there are no posts', async () => {
  fetchMock.mockResolvedValue(jsonResponse([]));

  await renderWithProviders(<PostListScreen />);

  expect(await screen.findByText('No posts yet.')).toBeOnTheScreen();
});

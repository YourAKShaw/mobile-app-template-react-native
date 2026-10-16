import { parsePostId } from '../PostDetailScreen';

it.each<[string, number]>([
  ['1', 1],
  ['42', 42],
])('accepts positive integer %p', (raw, expected) => {
  expect(parsePostId(raw)).toBe(expected);
});

it.each<string | string[] | undefined>([
  undefined,
  '',
  '0',
  '-1',
  '1.5',
  'abc',
  '01',
  ['1'],
  '12345678901',
])('rejects %p', (raw) => {
  expect(parsePostId(raw)).toBeNull();
});

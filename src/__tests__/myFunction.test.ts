import { myFunction, myFunction2 } from '../myFunction';

describe('myFunction', () => {
  test('should return 1', () => {
    const actual = myFunction();

    expect(actual).toBe(1);
  });
});

describe('myFunction2', () => {
  test('should return 2', () => {
    const actual = myFunction2();

    expect(actual).toBe(2);
  });
});

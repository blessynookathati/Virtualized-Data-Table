import '@testing-library/jest-dom';

// Mock ResizeObserver for JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock @faker-js/faker to bypass ESM import issue in Jest CommonJS tests
jest.mock('@faker-js/faker', () => ({
  faker: {
    seed: jest.fn(),
    string: {
      uuid: () => 'mocked-uuid'
    },
    person: {
      fullName: () => 'Mock Name'
    },
    commerce: {
      department: () => 'Electronics',
      price: () => '123.45'
    },
    helpers: {
      arrayElement: <T>(arr: T[]): T => arr[0]
    },
    date: {
      past: () => ({
        toISOString: () => '2026-01-01T00:00:00.000Z'
      })
    }
  }
}));

import { faker } from '@faker-js/faker';

export interface DataRow {
  id: string;
  name: string;
  category: string;
  value: number;
  status: 'active' | 'inactive' | 'pending';
  date: string;
}

export const CATEGORIES = [
  'Electronics',
  'Apparel',
  'Home & Kitchen',
  'Books',
  'Sports & Outdoors',
  'Beauty & Personal Care',
  'Automotive',
  'Toys & Games'
];

export const generateMockData = (count: number): DataRow[] => {
  // Use a fixed seed for reproducible results in tests
  faker.seed(12345);
  
  const data: DataRow[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      category: faker.helpers.arrayElement(CATEGORIES),
      value: parseFloat(faker.commerce.price({ min: 10, max: 2000, dec: 2 })),
      status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
      date: faker.date.past({ years: 2 }).toISOString().split('T')[0]
    });
  }
  return data;
};

import { delay } from './mock';
import { MOCK_USERS } from './auth.api';

const MOCK_USER_LIST = [
  {
    ...MOCK_USERS.admin.user,
    phone: '+1 (555) 100-2000',
    status: 'active',
    joinedAt: '2025-10-18T10:20:00.000Z',
    lastActiveAt: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    ...MOCK_USERS.consumer.user,
    phone: '+1 (555) 884-3102',
    status: 'active',
    joinedAt: '2025-11-05T08:40:00.000Z',
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    totalOrders: 2,
    totalSpent: 183.94,
  },
  {
    id: 'u-consumer-2',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    role: 'user',
    phone: '+1 (555) 222-1901',
    status: 'active',
    joinedAt: '2025-12-03T14:00:00.000Z',
    lastActiveAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    totalOrders: 6,
    totalSpent: 742.52,
  },
  {
    id: 'u-consumer-3',
    name: 'Michael Lee',
    email: 'michael@example.com',
    role: 'user',
    phone: '+1 (555) 606-7750',
    status: 'inactive',
    joinedAt: '2025-08-22T11:30:00.000Z',
    lastActiveAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    totalOrders: 1,
    totalSpent: 59,
  },
];

export const usersApi = {
  adminGetAll: async () => {
    await delay(350);
    return { users: MOCK_USER_LIST };
  },

  adminGetById: async (id) => {
    await delay(280);
    const user = MOCK_USER_LIST.find((item) => item.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },
};


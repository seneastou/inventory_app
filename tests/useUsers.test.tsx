import { renderHook, act } from '@testing-library/react';
import { useUsers } from '../src/app/hooks/useUsers';
import { UserContext } from '../src/context/UserContext'; // ✅ Bon import
import React from 'react';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      isActive: true,
      companyId: '1',
    }),
  })
) as jest.Mock;

describe('useUsers', () => {
  it('crée un utilisateur avec succès', async () => {
    // ✅ Faux contexte utilisateur
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UserContext.Provider
        value={{
          user: {
            id: 'admin-id',
            name: 'Admin',
            email: 'admin@test.com',
            role: 'admin',
            isActive: true,
            companyId: '1',
          },
          setUser: jest.fn(),
          loadingUser: false,
        }}
      >
        {children}
      </UserContext.Provider>
    );

    const { result } = renderHook(() => useUsers(), { wrapper });

    await act(async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        companyName: 'TestCorp',
      };
      const created = await result.current.addUser(newUser as any);

      expect(created).toBeDefined();
      expect(created?.name).toBe('Test User');
    });
  });
});

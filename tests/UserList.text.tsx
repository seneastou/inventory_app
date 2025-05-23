import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../src/app/components/user/UserList';
import { useUsers } from '../src/app/hooks/useUsers';

jest.mock('../src/app/hooks/useUsers');

describe('UserList', () => {
  const mockUpdateUser = jest.fn();
  const mockDeleteUser = jest.fn();
  const mockUserClick = jest.fn();

  const users = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'user' as 'user',
      isActive: true,
      companyId: '1',
      companyName: 'CompanyA',
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      role: 'admin' as 'admin',
      isActive: true,
      companyId: '1',
      companyName: 'CompanyA',
    },
  ];

  beforeEach(() => {
    (useUsers as jest.Mock).mockReturnValue({
      updateUser: mockUpdateUser,
      loading: false,
      error: null,
    });

    mockUpdateUser.mockClear();
    mockDeleteUser.mockClear();
  });

  it('affiche les noms des utilisateurs', () => {
    render(
      <UserList
        users={users}
        onUserClick={mockUserClick}
        onDeleteUser={mockDeleteUser}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('modifie un rôle et sauvegarde', () => {
    render(
      <UserList
        users={users}
        onUserClick={mockUserClick}
        onDeleteUser={mockDeleteUser}
      />
    );

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'admin' },
    });

    fireEvent.click(screen.getAllByText('Sauvegarder')[0]);

    expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      role: 'admin',
    }));
  });

  it('supprime un utilisateur', () => {
    render(
      <UserList
        users={users}
        onUserClick={mockUserClick}
        onDeleteUser={mockDeleteUser}
      />
    );

    fireEvent.click(screen.getAllByText('Supprimer')[1]);

    expect(mockDeleteUser).toHaveBeenCalledWith('2');
  });
});

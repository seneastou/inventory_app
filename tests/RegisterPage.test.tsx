import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../src/app/register/page';
import { useUsers } from '../src/app/hooks/useUsers';
import { useUser } from '../src/context/UserContext';
import { useRouter } from 'next/navigation';

jest.mock('../src/app/hooks/useUsers');
jest.mock('../src/context/UserContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('RegisterPage', () => {
  const mockAddUser = jest.fn();
  const mockSetUser = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    (useUsers as jest.Mock).mockReturnValue({
      addUser: mockAddUser,
    });

    (useUser as jest.Mock).mockReturnValue({
      setUser: mockSetUser,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push,
    });

    mockAddUser.mockClear();
    mockSetUser.mockClear();
    push.mockClear();

    // Valeur par défaut : succès
    mockAddUser.mockResolvedValue({
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      role: 'user',
      isActive: true,
      companyId: '1',
    });
  });

  it('soumet le formulaire et redirige', async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Nom de la société'), { target: { value: 'TestCorp' } });
    fireEvent.change(screen.getByDisplayValue('Utilisateur'), { target: { value: 'user' } });

    fireEvent.click(screen.getByText('➕ Créer un utilisateur'));

    await waitFor(() => {
      expect(mockAddUser).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@example.com',
        role: 'user',
        companyName: 'TestCorp',
      });
    });

    expect(mockSetUser).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/users');
  });

  it("n'appelle pas setUser ni redirect si addUser échoue", async () => {
    mockAddUser.mockResolvedValue(null); // 💥 Simule un échec

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Erreur' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'erreur@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Nom de la société'), { target: { value: 'ErreurCorp' } });
    fireEvent.change(screen.getByDisplayValue('Utilisateur'), { target: { value: 'user' } });

    fireEvent.click(screen.getByText('➕ Créer un utilisateur'));

    await waitFor(() => {
      expect(mockAddUser).toHaveBeenCalled();
    });

    expect(mockSetUser).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});

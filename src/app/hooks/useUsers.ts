import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un utilisateur
  const addUser = async (user: Omit<User, 'id'>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        await fetchUsers(); // Recharger les utilisateurs après ajout
      } else {
        setError('Erreur lors de l\'ajout de l\'utilisateur');
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  // Modifier un utilisateur
  const updateUser = async (user: User) => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        await fetchUsers(); // Recharger les utilisateurs après modification
      } else {
        setError('Erreur lors de la modification de l\'utilisateur');
      }
    } catch (err) {
      setError('Erreur lors de la modification de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchUsers(); // Recharger les utilisateurs après suppression
      } else {
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    loading,
    error,
  };
}

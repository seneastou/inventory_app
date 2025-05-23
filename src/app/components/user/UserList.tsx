"use client";
import { useState } from "react";
import { useUsers } from "../../hooks/useUsers"; // Importer le hook useUsers

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  companyId: string;
  companyName: string;
}

interface UserListProps {
  onUserClick: (user: User) => void;
  users: User[];
  onDeleteUser: (id: string) => Promise<void>;
}

export default function UserList({ onUserClick, users, onDeleteUser}: UserListProps) {
  const { updateUser, loading, error } = useUsers(); 
  const [role, setRole] = useState<{ [key: string]: "admin" | "user" }>({});

  // Gérer le changement de rôle d'un utilisateur
  const handleRoleChange = (user: User, newRole: "admin" | "user") => {
    setRole((prevState) => ({
      ...prevState,
      [user.id]: newRole,
    }));
  };

  // Sauvegarder le rôle modifié
  const handleSubmitRoleChange = async (user: User) => {
    const updatedUser = { ...user, role: role[user.id] || user.role };
    try {
      await updateUser(updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (user: User) => {
    try {
      await onDeleteUser(user.id);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  }; 

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl text-center font-bold text-gray-700 mb-4">
        Liste des utilisateurs
      </h1>

      {/* Affichage des erreurs */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Chargement des utilisateurs...</p>}

      {/* Tableau des utilisateurs */}
      <table className="min-w-full table-auto">
        <thead>
          <tr className="items-center justify-between text-gray-700">
            <th>Utilisateurs</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">
                <button
                  onClick={() => onUserClick(user)}
                  className="text-blue-500"
                >
                  {user.name}
                </button>
              </td>
              <td className="px-4 py-2">
                <select
                  value={role[user.id] || user.role}
                  onChange={(e) =>
                    handleRoleChange(user, e.target.value as "admin" | "user")
                  }
                  className="border border-gray-300 text-gray-700 rounded-md px-2 py-1"
                  style={{ width: "100%" }} // Alignement sous "Rôle"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-4 py-2 flex space-x-2 justify-center">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={() => handleSubmitRoleChange(user)}
                >
                  Sauvegarder
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={() => handleDeleteUser(user)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

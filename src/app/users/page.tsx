"use client";
import { useState } from "react";
import UserList from "../components/user/UserList"; // Importer le composant UserList
import { useUser } from "../../context/UserContext"; // Utiliser le UserContext
import { useUsers } from "../hooks/useUsers"; // Utiliser le hook useUsers pour créer un utilisateur

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export default function UserManagementPage() {
  const { user, setUser } = useUser(); // Utiliser le UserContext pour gérer l'utilisateur authentifié
  const { addUser } = useUsers(); // Utiliser le hook useUsers pour ajouter des utilisateurs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [emailInput, setEmailInput] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Gérer l'ajout d'un nouvel utilisateur
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = { name, email, role };
    await addUser(newUser); // Ajouter un utilisateur avec le hook
    setName("");
    setEmail("");
    setRole("user");
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setEmailInput(""); // Réinitialiser le champ email
    setShowPopup(true);
    setErrorMessage("");
  };

  // Valider l'email et rediriger vers la page des produits
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput === selectedUser?.email) {
      setUser(selectedUser); // Stocker l'utilisateur authentifié dans le contexte
      window.localStorage.setItem("user", JSON.stringify(selectedUser)); // Option pour stocker l'utilisateur localement
      window.location.href = "/products"; // Redirection vers la page des produits
    } else {
      setErrorMessage("Email incorrect");
    }
  };

  return (
    <main>
      <h1 className="text-3xl text-center text-blue-700 font-bold mb-6">
        Bienvenue dans l'application de gestion d'inventaire
      </h1>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Gestion des utilisateurs
        </h1>

        {/* Formulaire pour ajouter un utilisateur */}
        <form onSubmit={handleCreateUser} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "user")}
              className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md shadow hover:bg-indigo-700"
          >
            Créer un utilisateur
          </button>
        </form>

        {/* Composant pour afficher la liste des utilisateurs */}
        <UserList onUserClick={handleUserClick} />

        {/* Popup pour l'authentification par email */}
        {showPopup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                Vérifiez l'email pour accéder
              </h2>
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="mt-1 block w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500 mb-4">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-md"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  className="bg-red-500 justify-end text-white py-2 px-4 rounded-md ml-2"
                  onClick={() => setShowPopup(false)} // Fermer le popup
                >
                  Annuler
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

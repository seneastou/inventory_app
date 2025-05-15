"use client";
import React, { useState, useEffect} from "react";
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
  const { setUser } = useUser(); // Utiliser le UserContext pour gérer l'utilisateur authentifié
  const { addUser, fetchUsers, users, deleteUser } = useUsers(); // Utiliser le hook useUsers pour ajouter et récupérer les utilisateurs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [emailInput, setEmailInput] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUsers(); // Récupérer les utilisateurs lors du montage
  }, []);

  // Gérer l'ajout d'un nouvel utilisateur
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newUser = { name, email, role };
  
    try {
      const createdUser = await addUser(newUser); // Ajouter l'utilisateur via l'API
  
      if (createdUser) {
        console.log("Utilisateur créé avec succès:", createdUser);
        await fetchUsers(); // Mettre à jour la liste des utilisateurs
      }
  
      setName("");
      setEmail("");
      setRole("user");
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setEmailInput(""); // Réinitialiser le champ email
    setShowPopup(true);
    setErrorMessage("");
  };

  // Valider l'email et rediriger vers la page des produits
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!selectedUser) return
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
      })
  
      if (res.ok) {
        const { user } = await res.json()
        setUser(user) // Contexte
        window.location.href = "/products"
      } else {
        setErrorMessage("Email incorrect ou utilisateur inactif")
      }
    } catch (err) {
      console.error("Erreur connexion :", err)
      setErrorMessage("Erreur de connexion")
    }
  }

  return (
    <main className="min-h-screen bg-sky-100 px-4 py-10">
  {/* Header */}
  <header className="max-w-4xl mx-auto mb-8">
    <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700">
      Bienvenue dans l'application de gestion d'inventaire
    </h1>
  </header>

  {/* Carte principale */}
  <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-10">

    {/* Section formulaire */}
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Gestion des utilisateurs
      </h2>
      <form onSubmit={handleCreateUser} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "user")}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md shadow"
        >
          ➕ Créer un utilisateur
        </button>
      </form>
    </section>

    {/* Section liste utilisateurs */}
    <section>
      <UserList
        onUserClick={handleUserClick}
        users={users}
        onDeleteUser={deleteUser}
      />
    </section>
  </div>

  {/* Popup pour authentification */}
  {showPopup && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Vérifiez votre email</h2>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</main>

  );
}

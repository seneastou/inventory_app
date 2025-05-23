"use client";
import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { addUser } = useUsers();
  const { setUser } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [companyName, setCompanyName] = useState("");

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { name, email, role, companyName };
    try {
      const createdUser = await addUser(newUser);
      if (createdUser) {
        setUser(createdUser);
        router.push("/users");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailInput }),
      });

      if (res.ok) {
        const { user } = await res.json();
        setUser(user);
        router.push("/users");
      } else {
        setErrorMessage("Email incorrect ou utilisateur inactif");
      }
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setErrorMessage("Erreur de connexion");
    }
  };

  return (
    <main className="min-h-screen bg-sky-100 px-4 py-10">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700">
          Bienvenue dans l'application de gestion d'inventaire
        </h1>
      </header>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Gestion des utilisateurs
          </h2>
          <form onSubmit={handleCreateUser} className="space-y-6">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nom" className="w-full border p-2 rounded" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full border p-2 rounded" />
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="Nom de la société" className="w-full border p-2 rounded" />
            <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "user")} className="w-full border p-2 rounded">
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md shadow">
              ➕ Créer un utilisateur
            </button>
          </form>
        </section>
      </div>

      {/* Lien vers le popup de connexion */}
      <p className="text-center text-sm text-gray-600 mt-4">
        🔐 Vous avez déjà un compte ?{" "}
        <button onClick={() => setShowLoginPopup(true)} className="text-blue-600 underline">
          Se connecter
        </button>
      </p>

      {/* Popup de connexion par email */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Se connecter par email</h2>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Entrez votre email"
              />
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginPopup(false);
                    setEmailInput("");
                    setErrorMessage("");
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Annuler
                </button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}


"use client";
import React, { useEffect, useState } from "react";
import UserList from "../components/user/UserList";
import { useUser } from "../../context/UserContext";
import { useUsers } from "../hooks/useUsers";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  companyName: string;
  companyId: string;
  isActive: boolean;
}

export default function UserManagementPage() {
  const { user, loadingUser } = useUser();
  const { fetchUsers, users, deleteUser } = useUsers();
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/register");
    }
  }, [loadingUser, user]);

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loadingUser || !user) return null;

  const filteredUsers = users.filter((u) => u.companyId === user.companyId);

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

          <UserList
            users={filteredUsers}
            onUserClick={() => {}}
            onDeleteUser={deleteUser}
          />
        </section>
      </div>
    </main>
  );
}

'use client'

import Link from "next/link"
import { useUser } from "../../../context/UserContext"

export default function Navigation() {
  const { user, setUser } = useUser()

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
    })

    setUser(null)
    window.location.href = "/users" // ou vers la page de "connexion"
  }

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex gap-6">
        <Link href="/users" className="hover:underline">Accueil</Link>
        <Link href="/products" className="hover:underline">Produits</Link>
        <Link href="/history" className="hover:underline">Historique</Link>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm">Connecté en tant que <strong>{user.name}</strong></span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  )
}

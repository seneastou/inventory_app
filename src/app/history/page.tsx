'use client'

import { useEffect, useState } from 'react'

interface HistoryItem {
  id: string
  action: string
  quantity?: number
  createdAt: string
  user: { name: string }
  product?: { name: string }
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [filtered, setFiltered] = useState<HistoryItem[]>([])

  const [userFilter, setUserFilter] = useState<string>('Tous')
  const [actionFilter, setActionFilter] = useState<string>('Toutes')

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data)
        setFiltered(data)
      })
  }, [])

  // Liste unique des utilisateurs et actions
  const users = Array.from(new Set(history.map(h => h.user.name)))
  const actions = Array.from(new Set(history.map(h => h.action)))

  // Mise à jour du filtrage
  useEffect(() => {
    let result = [...history]

    if (userFilter !== 'Tous') {
      result = result.filter(h => h.user.name === userFilter)
    }

    if (actionFilter !== 'Toutes') {
      result = result.filter(h => h.action === actionFilter)
    }

    setFiltered(result)
  }, [userFilter, actionFilter, history])

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Historique des actions</h1>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par utilisateur</label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="Tous">Tous</option>
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par action</label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="Toutes">Toutes</option>
            {actions.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Historique filtré */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">Aucune action trouvée pour les filtres sélectionnés.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-white shadow-sm rounded border border-gray-200"
            >
              <p><strong>Action :</strong> {item.action}</p>
              <p><strong>Utilisateur :</strong> {item.user.name}</p>
              {item.product && <p><strong>Produit :</strong> {item.product.name}</p>}
              {item.quantity !== null && item.quantity !== undefined && (
                <p><strong>Quantité :</strong> {item.quantity}</p>
              )}
              <p className="text-sm text-gray-500">
                <strong>Date :</strong> {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

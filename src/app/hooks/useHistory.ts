import { useEffect, useState } from 'react'

export interface HistoryEntry {
  id?: string
  action: string
  quantity?: number
  userId: string
  productId?: string
  createdAt?: string
  user?: { name: string }
  product?: { name: string }
}

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Récupérer l'historique
  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/history`)
      if (!res.ok) throw new Error('Erreur lors du chargement de l’historique')
      const data = await res.json()
      setHistory(data)
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  // Ajouter une action à l'historique
  const addHistory = async (entry: HistoryEntry) => {
    try {
      const res = await fetch(`${baseUrl}/api/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      })
      if (!res.ok) {
        console.error('Erreur lors de l’enregistrement dans l’historique')
      }
    } catch (err) {
      console.error('Erreur API /history :', err)
    }
  }

  return {
    history,
    loading,
    error,
    fetchHistory,
    addHistory,
  }
}

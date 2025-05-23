"use client"

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../../context/UserContext';

interface HistoryItem {
  id: string;
  action: string;
  quantity?: number;
  createdAt: string;
  userId: string;
  user: { name: string };
  product?: { name: string };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filtered, setFiltered] = useState<HistoryItem[]>([]);

  const [userFilter, setUserFilter] = useState<string>('Tous');
  const [actionFilter, setActionFilter] = useState<string>('Toutes');
  const { user, loadingUser } = useUser();

  // ✅ Redirection si non connecté ou inactif
  useEffect(() => {
    if (!loadingUser && (!user || !user.isActive)) {
      window.location.href = "/users";
    }
  }, [user, loadingUser]);

  // Charger l'historique
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/history?companyId=${user?.companyId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setHistory(data);
          setFiltered(data);
        } else {
          console.error("Réponse inattendue de l'API :", data);
          setHistory([]);
          setFiltered([]);
        }
      } catch (err) {
        console.error("Erreur de chargement de l'historique :", err);
        setHistory([]);
        setFiltered([]);
      }
    };

    if (user?.companyId) {
      fetchHistory();
    }
  }, [user]);

  const users = Array.from(new Set(history.map(h => h.user.name)));
  const actions = Array.from(new Set(history.map(h => h.action)));

  useEffect(() => {
    let result = [...history];
    if (userFilter !== 'Tous') result = result.filter(h => h.user.name === userFilter);
    if (actionFilter !== 'Toutes') result = result.filter(h => h.action === actionFilter);
    setFiltered(result);
  }, [userFilter, actionFilter, history]);

  const handleReactivateUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/reactivate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        toast.success('Utilisateur réactivé');
        // Optionnel : refresh de l’historique
      } else {
        toast.error("Échec de l'activation");
      }
    } catch (error) {
      toast.error('Erreur serveur');
    }
  };

  // ⏳ Attente de l’utilisateur avant de rendre
  if (loadingUser) return <p className="text-center mt-10">Chargement...</p>;
  if (!user || !user.isActive) return null;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Historique des actions</h1>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par utilisateur</label>
          <select className="w-full px-4 py-2 border rounded-md" value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="Tous">Tous</option>
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par action</label>
          <select className="w-full px-4 py-2 border rounded-md" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            <option value="Toutes">Toutes</option>
            {actions.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste historique */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">Aucune action trouvée pour les filtres sélectionnés.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((item) => (
            <li key={item.id} className="p-4 bg-white shadow-sm rounded border border-gray-200 flex justify-between items-start">
              <div>
                <p><strong>Action :</strong> {item.action}</p>
                <p><strong>Utilisateur :</strong> {item.user.name}</p>
                {item.product && <p><strong>Produit :</strong> {item.product.name}</p>}
                {item.quantity != null && (
                  <p><strong>Quantité :</strong> {item.quantity}</p>
                )}
                <p className="text-sm text-gray-500">
                  <strong>Date :</strong> {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              {item.action === "Utilisateur désactivé" && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => handleReactivateUser(item.userId)}
                >
                  Activer
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

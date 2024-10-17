

interface User {
  id: number;  // number, identifiant unique de l'utilisateur
  name: string;  // nom de l'utilisateur
  email: string;  // email unique
  role: 'admin' | 'user';  // rôle de l'utilisateur (ENUM)
}

interface UserListProps {
  users: User[];  // Liste des utilisateurs
  onChangeRole: (id: number, role: 'admin' | 'user') => void;  // Fonction appelée lors du changement de rôle
}

export default function UserList({ users, onChangeRole }: UserListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.role}
                  onChange={(e) => onChangeRole(user.id, e.target.value as 'admin' | 'user')}
                  className="bg-gray-200 p-2 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900">Modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

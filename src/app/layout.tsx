import './globals.css';  // Styles globaux
import { UserProvider } from '../context/UserContext';  // Importer le UserContext
import { Toaster } from 'react-hot-toast';
import NavBar from './components/menu/NavBar';  // Importer la barre de navigation

export const metadata = {
  title: 'Gestion d\'inventaire',
  description: 'Application de gestion d\'inventaire',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <UserProvider>
        <Toaster position="top-right" />
          <NavBar /> {/* ← Menu global */}
          <main className="p-6">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}


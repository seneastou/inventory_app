import './globals.css';  // Styles globaux
import { UserProvider } from '../context/UserContext';  // Importer le UserContext
import { Toaster } from 'react-hot-toast';

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
          {children}  {/* Toutes les pages seront rendues ici */}
        </UserProvider>
      </body>
    </html>
  );
}


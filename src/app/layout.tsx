import './globals.css';  // Styles globaux
import { UserProvider } from '../context/UserContext';  // Importer le UserContext

export const metadata = {
  title: 'Gestion d\'inventaire',
  description: 'Application de gestion d\'inventaire',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <UserProvider>
          {children}  {/* Toutes les pages seront rendues ici */}
        </UserProvider>
      </body>
    </html>
  );
}


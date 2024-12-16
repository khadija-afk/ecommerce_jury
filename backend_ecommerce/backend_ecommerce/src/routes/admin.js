import { sequelize } from '../models/index.js';
import bcrypt from 'bcryptjs'; // Pour le hachage des mots de passe

// Données d'utilisateur d'administration
const ADMIN = {
  email: 'admin@example.com',
  password: bcrypt.hashSync('admin123', 10), // Hachez votre mot de passe pour plus de sécurité
};

// Configurer un routeur pour AdminJS
let routerAdmin;

const initializeAdminJS = async () => {
  // Charger AdminJS, AdminJSSequelize et AdminJSExpress de manière asynchrone
  const AdminJS = (await import('adminjs')).default;
  const AdminJSSequelize = (await import('@adminjs/sequelize')).default;
  const AdminJSExpress = (await import('@adminjs/express')).default;

  // Créer une instance d'AdminJS
  AdminJS.registerAdapter(AdminJSSequelize);
  const adminJs = new AdminJS({
    databases: [sequelize], // Intégration de la base de données
    rootPath: '/admin', // Chemin de base pour l'interface AdminJS
  });

  console.log('AdminJS initialized successfully');

  // Configurer l'authentification avec AdminJSExpress
  routerAdmin = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
      if (email === ADMIN.email && bcrypt.compareSync(password, ADMIN.password)) {
        return ADMIN; // Retourner l'objet utilisateur si les identifiants sont corrects
      }
      return null; // Retourner null si l'authentification échoue
    },
    cookieName: 'adminjs',
    cookiePassword: 'some-secure-password', // Remplacez par une clé secrète
  });

  return routerAdmin;
};

export default initializeAdminJS;



import {sequelize} from '../models/index.js'



// Configurer un routeur pour AdminJS
let routerAdmin;
console.log("routerAdmin 000");
console.log(process.env.NODE_ENV);

const initializeAdminJS = async () => {
    // Charger AdminJS, AdminJSSequelize et AdminJSExpress de manière asynchrone
    const AdminJS = (await import("adminjs")).default;
    const AdminJSSequelize = (await import("@adminjs/sequelize")).default;
    const AdminJSExpress = (await import("@adminjs/express")).default;
  
    // Créer une instance d'AdminJS
    AdminJS.registerAdapter(AdminJSSequelize);
    const adminJs = new AdminJS({
      databases: [sequelize], // Intégration de la base de données
    });
  
    console.log("AdminJS initialized successfully");
    routerAdmin = AdminJSExpress.buildRouter(adminJs);
  
    
    return routerAdmin;
  };

export default initializeAdminJS;
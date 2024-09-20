// testServer.js
import express from 'express';
import routerArticle from './routes/article.js'; // Importe vos routes nécessaires


const createTestServer = () => {
    const app = express();
    
    // Ajoutez tous les middlewares nécessaires
    app.use(express.json());

    // Ajoutez les routes dont vous avez besoin pour les tests
    app.use("/api/article", routerArticle);
    
    return app;
};

export default createTestServer;

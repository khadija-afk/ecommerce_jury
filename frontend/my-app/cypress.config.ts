module.exports = {
  e2e: {
    baseUrl: "https://localhost", // URL de base de votre application
    chromeWebSecurity: false, // Désactive la sécurité Chrome pour ignorer les erreurs SSL en local
    setupNodeEvents(on, config) {
      // implémentez ici les écouteurs d'événements si nécessaire
    },
  },
};

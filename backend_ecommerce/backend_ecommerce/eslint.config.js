import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                console: "readonly", // Définit console comme global
            },
            ecmaVersion: 2021, // Assure la compatibilité avec les fonctionnalités modernes
            sourceType: "module", // Pour ES6 modules
        },
        env: {
            node: true, // Active l'environnement Node.js
            es2021: true, // Active les fonctionnalités modernes d'ES2021
        },
        rules: {
            "no-console": "off", // Permet l'utilisation de console
            // Ajoutez d'autres règles si nécessaire
        },
    },
];

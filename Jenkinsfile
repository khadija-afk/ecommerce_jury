pipeline {
    agent {
        docker {
            image 'node:21' // Spécifie l'image Docker Node.js version 14
            args '-u root'  // Optionnel: exécuter en tant que root pour installer les dépendances globales
        }
    }

    environment {
        NODE_ENV = 'test'
        GIT_CREDENTIALS_ID = 'CredentialAtelierCICD' // Remplacez par l'ID de vos credentials Jenkins
    }

    stages {

        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies for both frontend and backend
                    dir('frontend/my-app') {
                        sh 'npm install'
                    }
                    dir('backend_ecommerce/backend_ecommerce') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests for both frontend and backend
                    dir('frontend/my-app') {
                        sh 'npx jest'
                        
                    }
                    dir('backend_ecommerce/backend_ecommerce') {
                        sh 'npx jest'
                    }
                }
            }
        }

        
    }

    
    }
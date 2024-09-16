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
        SONAR_HOST_URL = 'http://localhost:9000/'
        SONAR_LOGIN = 'sqa_4c325592530960917aae3de3fddd4f5f26a7c590'
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
                    dir('backend_ecommerce/backend_ecommerce') {
                        sh 'npx jest'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'npx sonar-scanner \
                        -Dsonar.projectKey=my-ecommerce-project \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_LOGIN'
                }
            }
        }

        
    }

    
    }
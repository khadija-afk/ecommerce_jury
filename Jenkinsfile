pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        GIT_CREDENTIALS_ID = 'CredentialAtelierCICD' // Remplacez par l'ID de vos credentials Jenkins
        SONAR_HOST_URL = 'http://sonarqube:9000/'
        SONAR_LOGIN = 'sqa_4c325592530960917aae3de3fddd4f5f26a7c590'
    }

    stages {

        stage('Install Dependencies') {
            agent { docker { image 'node:21' } }
            
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

        stage('Run Tests Behaver') {
            agent { docker { image 'node:22' } }

            steps {
                script {
                    // Run tests for both frontend and backend
                    dir('backend_ecommerce/backend_ecommerce') {
                        sh 'pwd'
                        sh 'make bdd'
                    }
                }
            }
        }


        stage('Run Tests Unitaires') {
            agent { docker { image 'node:21' } }

            steps {
                script {
                    // Run tests for both frontend and backend
                    dir('backend_ecommerce/backend_ecommerce') {
                        sh 'pwd'
                        sh 'make test'
                    }
                }
            }
        }

        stage('SonarQube Analysis BackEnd') {
           
            steps {
                    sh " cd backend_ecommerce/backend_ecommerce && \
                        sonar-scanner \
                        -Dsonar.projectKey=ecommerce-backend \
                        -Dsonar.sources=./src \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_LOGIN} \
                        -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                        -Dsonar.javascript.jstest.reportsPath=./reports \
                        -Dsonar.junit.reportPaths=./reports/junit.xml"
            }
        }

        stage('SonarQube Analysis FrontEnd') {
            // agent { 
            //     docker {
            //         image 'sonarsource/sonar-scanner-cli'
            //     }
            // }
            steps {
                    sh " cd frontend/my-app && \
                        sonar-scanner \
                        -Dsonar.projectKey=ecommerce-frontend \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_LOGIN} \
                        -Dsonar.javascript.jstest.reportsPath=./reports \
                        -Dsonar.junit.reportPaths=./reports/junit.xml"
            }
        }
        stage('Deploy to Render') { 
            steps {
                script {
                def serviceIdFrontend = 'srv-ct7n8m23esus73b7lh40' 
                def apiKeyFrontend = 'jKqDAwH78m4' 

                def serviceIdBackend = 'srv-ct7nhfg8fa8c738v2qv0' 
                def apiKeyBackend = 'woqKrYV55VU' 

                // Effectuer une requête CURL pour déployer
                sh """
                curl -X POST "https://api.render.com/deploy/${serviceIdFrontend}?key=${apiKeyFrontend}" \
                    -H "Content-Type: application/json"
                """
                 sh """
                curl -X POST "https://api.render.com/deploy/${serviceIdBackend}?key=${apiKeyBackend}" \
                    -H "Content-Type: application/json"
                """
                }
            }
        }
    }
    
    post {
    always {
        archiveArtifacts artifacts: 'zap-output/testreport.html', allowEmptyArchive: true
    }
}
    }
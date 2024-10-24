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

        stage('Run Tests Security') {
            agent { 
                docker { 
                    image 'ghcr.io/zaproxy/zaproxy:stable'
                    args '-v $WORKSPACE/zap-output:/zap/wrk'
                    }
                }

            steps {
                script {
                    // Run tests for both frontend and backend
                    dir('backend_ecommerce/backend_ecommerce') {
                        sh 'zap-baseline.py -t https://localhost -r /zap/wrk/testreport.html'
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
            // agent { 
            //     docker {
            //         image 'sonarsource/sonar-scanner-cli'
            //     }
            // }
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

        
    }
    
    post {
    always {
        archiveArtifacts artifacts: 'zap-output/testreport.html', allowEmptyArchive: true
    }
}
    }
pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        GIT_CREDENTIALS_ID = 'CredentialAtelierCICD' // Remplacez par l'ID de vos credentials Jenkins
    }
triggers {
        cron('H/5 * * * *') // Planification pour exÃ©cuter toutes les 5 minutes
    }

    stages {
        // stage('Checkout') {
        //     steps {
        //         script {
        //             // Checkout the 'dev' branch
        //             checkout([$class: 'GitSCM', branches: [[name: '*/dev']], 
        //                       doGenerateSubmoduleConfigurations: false, 
        //                       extensions: [], submoduleCfg: [], 
        //                       userRemoteConfigs: [[credentialsId: env.GIT_CREDENTIALS_ID, url: 'https://github.com/khadija-afk/ecommerce_jury.git']]])
        //         }
        //     }
        // }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies for both frontend and backend
                    dir('frontend/my-app') {
                        bat 'npm install'
                    }
                    dir('backend_ecommerce/backend_ecommerce') {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests for both frontend and backend
                    dir('frontend/my-app') {
                        echo 'sur le front'
                        
                    }
                    dir('backend_ecommerce/backend_ecommerce') {
                        echo 'sur le back'
                        bat 'npm test'
                    }
                }
            }
        }

        
    }

    
//    stage('Merge to Master') {
//             when {
//                 branch 'dev'
//             }
//             steps {
//                 script {
//                     echo 'Tests succeeded, merging dev into master'
//                     withCredentials([usernamePassword(credentialsId: env.GIT_CREDENTIALS_ID, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
//                         bat """
//                            git config --global user.email "khadijaa.kenzi@gmail.com"
//                            git config --global user.name "khadija-afk"
//                            git checkout master
//                            git pull origin master
//                            git merge dev
//                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/khadija-afk/ecommerce_jury.git main
//                         """ 
//                     }
//                 }
//             }
//         }

        // stage('Deploy') {
        //     when {
        //         branch 'master'
        //     }
        //     steps {
        //         script {
        //             echo 'Deploying application...'
        //             // Build and push Docker images to Docker Hub
        //             withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
        //                 dir('ecommerce_jury') {
        //                     bat """
        //                         docker build -t ${DOCKERHUB_USERNAME}/ecommerce-jury:latest .
        //                         echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USERNAME} --password-stdin
        //                         docker push ${DOCKERHUB_USERNAME}/ecommerce-jury:latest
        //                     """
        //                 }
        //                 dir('ecommerce-jury') {
        //                     bat """
        //                         docker build -t ${DOCKERHUB_USERNAME}/frontecommerce_jury:latest .
        //                         echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USERNAME} --password-stdin
        //                         docker push ${DOCKERHUB_USERNAME}/frontecommerce_jury:latest
        //                     """
        //                 }
        //             }
                    
        //             // Deploy using Docker Compose
        //             bat """
        //                 docker-compose down
        //                 docker-compose up -d
        //             """
        //         }
        //     }
        // }
    }

    post {
        failure {
            echo 'Tests failed, merge to master aborted.'
        }
        always {
            cleanWs()
        }
    }    
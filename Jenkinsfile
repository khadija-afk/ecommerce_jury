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
        stage('Checkout') {
            steps {
                script {
                    // Checkout the 'dev' branch
                    checkout([$class: 'GitSCM', branches: [[name: '*/dev']], 
                              doGenerateSubmoduleConfigurations: false, 
                              extensions: [], submoduleCfg: [], 
                              userRemoteConfigs: [[credentialsId: env.GIT_CREDENTIALS_ID, url: 'https://github.com/khadija-afk/ecommerce_jury.git']]])
                }
            }
        }

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

    
    post {
        success {
            script {
                checkout([$class: 'GitSCM', branches: [[name: '*/dev']], 
                              doGenerateSubmoduleConfigurations: false, 
                              extensions: [], submoduleCfg: [], 
                              userRemoteConfigs: [[credentialsId: env.GIT_CREDENTIALS_ID, url: 'https://github.com/khadija-afk/ecommerce_jury.git']]])

                echo 'Tests succeeded, merging dev into master'
                withCredentials([usernamePassword(credentialsId: env.GIT_CREDENTIALS_ID, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    bat """
                        git config --global user.email "khadijaa.kenzi@gmail.com"
                        git config --global user.name "khadija-afk"
                        git checkout master
                        git pull origin master
                        git merge origin/dev
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/khadija-afk/ecommerce_jury.git master
                    """
                }
            }
        }
        failure {
            echo 'Tests failed, merge to master aborted.'
        }
        always {
            echo 'Cleaning up workspace'
            cleanWs()
        }
    }
}

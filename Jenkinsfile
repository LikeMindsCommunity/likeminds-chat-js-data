pipeline {
    agent any
    tools {nodejs "nodejs"}

    options {
        buildDiscarder logRotator(daysToKeepStr: '1', numToKeepStr: '1' )
    }

    stages {
        
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Package') {
            steps {
                sh 'npm pack'
            }
        }

        stage('Archive Package') {
            steps {
                archiveArtifacts artifacts: '*.tgz', fingerprint: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
pipeline {
    agent any
    tools {nodejs "nodejs"}

    options {
        buildDiscarder logRotator(daysToKeepStr: '7', numToKeepStr: '1' )
    }

    environment {
        NODE_OPTIONS = "--max-old-space-size=8192"  // Setting the memory limit for Node.js
    }

    stages {
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'export NODE_OPTIONS="--max-old-space-size=8192" && npm run build'
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

    // post {
    //     always {
    //         cleanWs()
    //     }
    // }
}
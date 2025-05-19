pipeline {
    agent any

    environment {
        SERVICE_NAME    = 'fe'
        PROJECT_ID      = 'velvety-calling-458402-c1'
        REGION          = 'asia-northeast3'
        GAR_HOST        = 'asia-northeast3-docker.pkg.dev'
        CONTAINER_NAME  = 'frontend'
        PORT            = '3000'
        SSH_KEY_PATH    = '/var/jenkins_home/.ssh/id_rsa'
    }

    stages {
        stage('Setup Environment by Branch') {
            steps {
                script {
                    def branchName = env.GIT_BRANCH.replaceFirst(/^origin\//, '')
                    env.BRANCH = branchName

                    if (branchName == 'main') {
                        env.FE_PRIVATE_IP = '10.10.20.2'
                        env.ENV_LABEL = 'prod'
                        env.REPO_NAME = 'dolpin-docker-image-prod'
                    } else if (branchName == 'dev') {
                        env.FE_PRIVATE_IP = '10.0.20.2'
                        env.ENV_LABEL = 'dev'
                        env.REPO_NAME = 'dolpin-docker-image-dev'
                    } else {
                        error "⚠️ 지원되지 않는 브랜치입니다: ${branchName}"
                    }

                    env.TAG = "${env.SERVICE_NAME}:${env.BUILD_NUMBER}"
                    env.GAR_IMAGE = "${env.GAR_HOST}/${env.PROJECT_ID}/${env.REPO_NAME}/${env.TAG}"
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Inject .env') {
            steps {
                script {
                    def apiBaseCredId = ''
                    if (env.BRANCH == 'main') {
                        apiBaseCredId = 'NEXT_PUBLIC_API_BASE_PROD'
                    } else if (env.BRANCH == 'dev') {
                        apiBaseCredId = 'NEXT_PUBLIC_API_BASE_DEV'
                    } else {
                        error "지원하지 않는 브랜치입니다: ${env.BRANCH}"
                    }

                    withCredentials([
                        string(credentialsId: apiBaseCredId, variable: 'API_BASE_URL'),
                        string(credentialsId: 'NEXT_PUBLIC_KAKAOMAP_KEY', variable: 'KAKAOMAP_KEY')
                    ]) {
                        writeFile file: '.env', text: """\
NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
NEXT_PUBLIC_KAKAOMAP_KEY=${KAKAOMAP_KEY}
"""
                    }
                }
            }
        }


        stage('GAR 인증') {
            steps {
                sh "gcloud auth configure-docker ${env.GAR_HOST} --quiet"
            }
        }

        stage('Docker Build & Push to GAR') {
            steps {
                sh """
                    docker build -t ${env.GAR_IMAGE} .
                    docker push ${env.GAR_IMAGE}
                """
            }
        }

        stage('Deploy to FE via SSH') {
            steps {
                sh """
                    chmod 600 ${env.SSH_KEY_PATH}
                    scp -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no .env peter@${env.FE_PRIVATE_IP}:/home/peter/.env

ssh -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no peter@${env.FE_PRIVATE_IP} << 'EOF'
set -e
gcloud auth configure-docker ${env.GAR_HOST} --quiet

sudo docker stop ${env.CONTAINER_NAME} || true
sudo docker rm ${env.CONTAINER_NAME} || true

sudo docker pull ${env.GAR_IMAGE}
sudo docker run -d --name ${env.CONTAINER_NAME} \\
  --env-file /home/peter/.env \\
  -p ${env.PORT}:${env.PORT} \\
  ${env.GAR_IMAGE}
EOF
                """
            }
        }
    }
}
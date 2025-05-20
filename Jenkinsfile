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
        SSH_USER        = 'peter'
    }

    stages {
        stage('Set Environment by Branch') {
            steps {
                script {
                    def branchName = env.GIT_BRANCH.replaceFirst(/^origin\//, '')
                    env.BRANCH = branchName
                    echo "현재 브랜치: ${branchName}"

                    if (branchName == 'main') {
                        env.FE_PRIVATE_IP = '10.10.20.2'
                        env.ENV_LABEL = 'prod'
                        env.REPO_NAME = 'dolpin-docker-image-prod'
                        env.API_BASE_CRED_ID = 'NEXT_PUBLIC_API_BASE_PROD'
                    } else if (branchName == 'dev') {
                        env.FE_PRIVATE_IP = '10.20.20.2'
                        env.ENV_LABEL = 'dev'
                        env.REPO_NAME = 'dolpin-docker-image-dev'
                        env.API_BASE_CRED_ID = 'NEXT_PUBLIC_API_BASE_DEV'
                    } else {
                        error "지원되지 않는 브랜치입니다: ${branchName}"
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
                withCredentials([
                    string(credentialsId: "${env.API_BASE_CRED_ID}", variable: 'API_BASE_URL'),
                    string(credentialsId: 'NEXT_PUBLIC_KAKAOMAP_KEY', variable: 'KAKAOMAP_KEY')
                ]) {
                    writeFile file: '.env', text: """\
NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
NEXT_PUBLIC_KAKAOMAP_KEY=${KAKAOMAP_KEY}
"""
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
                script {
                    def saCredId = ''
                    if (env.BRANCH == 'main') {
                        saCredId = 'fe-sa-key-prod'
                    } else if (env.BRANCH == 'dev') {
                        saCredId = 'fe-sa-key-dev'
                    }

                    withCredentials([
                        file(credentialsId: saCredId, variable: 'GCP_KEY')
                    ]) {
                        def deployScript = """
#!/bin/bash
set -e

mv /tmp/.env /home/${env.SSH_USER}/.env
mv /tmp/gcp-key.json /home/${env.SSH_USER}/gcp-key.json
chown ${env.SSH_USER}:${env.SSH_USER} /home/${env.SSH_USER}/.env /home/${env.SSH_USER}/gcp-key.json
chmod 600 /home/${env.SSH_USER}/.env /home/${env.SSH_USER}/gcp-key.json

export HOME=/home/${env.SSH_USER}
echo "\$HOME = \$HOME"
ls -la \$HOME/.docker || true
cat \$HOME/.docker/config.json || echo "No config file"

gcloud auth activate-service-account --key-file="\$HOME/gcp-key.json"
gcloud config set project ${env.PROJECT_ID} --quiet
gcloud auth configure-docker ${env.GAR_HOST} --quiet
echo '{}' > \$HOME/.docker/config.json
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://${env.GAR_HOST}

docker stop ${env.CONTAINER_NAME} || true
docker rm ${env.CONTAINER_NAME} || true

docker pull ${env.GAR_IMAGE}

sudo docker run -d --name ${env.CONTAINER_NAME} \\
  --env-file \$HOME/.env \\
  -p ${env.PORT}:${env.PORT} \\
  ${env.GAR_IMAGE}
"""

                        writeFile file: 'deploy.sh', text: deployScript
                        echo "==== deploy.sh 내용 출력 ===="
                        sh "cat deploy.sh"

                        sh """
chmod 600 ${env.SSH_KEY_PATH}
scp -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no .env ${env.SSH_USER}@${env.FE_PRIVATE_IP}:/tmp/.env
scp -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no \$GCP_KEY ${env.SSH_USER}@${env.FE_PRIVATE_IP}:/tmp/gcp-key.json
scp -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no deploy.sh ${env.SSH_USER}@${env.FE_PRIVATE_IP}:/tmp/deploy.sh

ssh -tt -i ${env.SSH_KEY_PATH} -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.FE_PRIVATE_IP} "bash /tmp/deploy.sh"
"""
                    }
                }
            }
        }
    }
}

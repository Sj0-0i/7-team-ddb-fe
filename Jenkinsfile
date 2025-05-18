pipeline {
    agent any

    environment {
        SERVICE_NAME    = 'fe'
        PROJECT_ID      = 'velvety-calling-458402-c1'
        REPO_NAME       = 'dolpin-docker-image-prod'
        REGION          = 'asia-northeast3'
        GAR_HOST        = "${REGION}-docker.pkg.dev"
        BRANCH          = "${env.GIT_BRANCH}".replaceAll(/^origin\\//, '')
        IS_PROD         = "${env.GIT_BRANCH}" == 'origin/main'
        TAG             = "fe:${BUILD_NUMBER}"
        CONTAINER_NAME  = 'frontend'
        PORT            = '3000'
        SSH_KEY_PATH    = '/var/jenkins_home/.ssh/id_rsa'
    }

    stages {
        stage('Setup Environment by Branch') {
            steps {
                script {
                    if (BRANCH == 'main') {
                        env.FE_PRIVATE_IP = '10.10.20.2'
                        env.ENV_LABEL = 'prod'
                    } else if (BRANCH == 'dev') {
                        env.FE_PRIVATE_IP = '10.20.20.2'
                        env.ENV_LABEL = 'dev'
                    } else {
                        error "⚠️ 지원되지 않는 브랜치입니다: ${BRANCH}"
                    }

                    env.GAR_IMAGE = "${GAR_HOST}/${PROJECT_ID}/${REPO_NAME}/${TAG}"
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
                withCredentials([string(credentialsId: 'fe-env', variable: 'DOT_ENV')]) {
                    writeFile file: '.env', text: DOT_ENV
                }
            }
        }

        stage('GAR 인증') {
            steps {
                sh "gcloud auth configure-docker ${GAR_HOST} --quiet"
            }
        }

        stage('Docker Build & Push to GAR') {
            steps {
                sh """
                docker build -t ${GAR_IMAGE} .
                docker push ${GAR_IMAGE}
                """
            }
        }

        stage('Notify Deployment Started') {
            steps {
                withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'WEBHOOK_URL')]) {
                    sh """
                    curl -H "Content-Type: application/json" -X POST -d '{
                      "username": "Jenkins",
                      "content": "🚀 [FE][${ENV_LABEL}] 배포 시작 – 태그: ${TAG}"
                    }' $WEBHOOK_URL
                    """
                }
            }
        }

        stage('Deploy to FE via SSH') {
            steps {
                sh """
                chmod 600 ${SSH_KEY_PATH}
                scp -i ${SSH_KEY_PATH} -o StrictHostKeyChecking=no .env peter@$FE_PRIVATE_IP:/home/peter/.env

                ssh -i ${SSH_KEY_PATH} -o StrictHostKeyChecking=no peter@$FE_PRIVATE_IP << EOF
                  set -e

                  gcloud auth configure-docker ${GAR_HOST} --quiet

                  docker stop ${CONTAINER_NAME} || true
                  docker rm ${CONTAINER_NAME} || true

                  docker pull ${GAR_IMAGE}
                  docker run -d --name ${CONTAINER_NAME} \\
                    --env-file /home/peter/.env \\
                    -p ${PORT}:${PORT} \\
                    ${GAR_IMAGE}
                EOF
                """
            }
        }
    }
}

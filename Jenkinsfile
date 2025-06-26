pipeline {
    agent any

    environment { 
        SERVICE_NAME     = 'frontend'
        AWS_REGION       = 'ap-northeast-2' 
    }

    stages {
        stage('Set Branch') {
            steps {
                script {
                    env.BRANCH = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceFirst(/^origin\//, '')
                    env.IS_MAIN = (env.BRANCH == 'main')
                    env.ENV_LABEL = env.IS_MAIN ? 'prod' : 'dev'
                    env.API_BASE_CRED_ID = env.IS_MAIN ? 'NEXT_PUBLIC_API_BASE_PROD' : 'NEXT_PUBLIC_API_BASE_DEV'
                    env.ECR_REPO = "794038223418.dkr.ecr.${env.AWS_REGION}.amazonaws.com/dolpin-${env.SERVICE_NAME}-${env.ENV_LABEL}"
                    env.S3_BUCKET = "${env.SERVICE_NAME}-${env.ENV_LABEL}-dolpin-codedeploy-artifacts"
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}"
                    env.ZIP_NAME = "${env.SERVICE_NAME}-${env.BUILD_NUMBER}.zip"
                    env.APP_NAME = "${env.SERVICE_NAME}-${env.ENV_LABEL}-codedeploy-app"
                    env.DEPLOYMENT_GROUP = "${env.SERVICE_NAME}-${env.ENV_LABEL}-deployment-group"
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Notify Before Start') {
            when {
                expression { env.BRANCH in ['main', 'dev'] }
            }
            steps {
                script {
                    withCredentials([string(credentialsId: 'Discord-Webhook', variable: 'DISCORD')]) {
                        discordSend(
                            description: "🚀 빌드가 시작됩니다: ${env.SERVICE_NAME} - ${env.BRANCH} 브랜치",
                            link: env.BUILD_URL,
                            title: "빌드 시작",
                            webhookURL: "$DISCORD"
                        )
                    }
                }
            }
        }

        stage('Load Secrets') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: "${env.API_BASE_CRED_ID}", variable: 'API_BASE_URL'),
                        string(credentialsId: 'NEXT_PUBLIC_KAKAOMAP_KEY', variable: 'KAKAOMAP_KEY')
                    ]) {
                        env.API_BASE_URL = API_BASE_URL
                        env.KAKAOMAP_KEY = KAKAOMAP_KEY
                    }
                }
            }
        }

        stage('Docker Build & Push to ECR') {
            steps {
                withAWS(credentials: 'aws-access-key', region: "${env.AWS_REGION}") {
                    sh """
                    aws ecr get-login-password | docker login --username AWS --password-stdin ${env.ECR_REPO}
                    docker build \
                      --build-arg NEXT_PUBLIC_API_BASE_URL=${env.API_BASE_URL} \
                      --build-arg NEXT_PUBLIC_KAKAOMAP_KEY=${env.KAKAOMAP_KEY} \
                      -t ${env.ECR_REPO}:${env.IMAGE_TAG} .
                    docker push ${env.ECR_REPO}:${env.IMAGE_TAG}
                    """
                }
            }
        }

        stage('Package for CodeDeploy') {
            steps {
                sh '''
                mkdir -p deploy/scripts
                cp -r appspec.yml deploy/
                cp -r scripts/* deploy/scripts/
                echo ${env.IMAGE_TAG} > deploy/.image_tag
                cd deploy && zip -r ../${env.ZIP_NAME} .
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                withAWS(credentials: 'aws-access-key', region: "${env.AWS_REGION}") {
                    sh "aws s3 cp ${env.ZIP_NAME} s3://${env.S3_BUCKET}/${env.ZIP_NAME}"
                }
            }
        }

        stage('Trigger CodeDeploy') {
            steps {
                withAWS(credentials: 'aws-access-key', region: "${env.AWS_REGION}") {
                    sh """
                    aws deploy create-deployment \
                      --application-name ${env.APP_NAME} \
                      --deployment-group-name ${env.DEPLOYMENT_GROUP} \
                      --s3-location bucket=${env.S3_BUCKET},bundleType=zip,key=${env.ZIP_NAME} \
                      --file-exists-behavior OVERWRITE
                    """
                }
            }
        }
    }

    post {
        success {
            script {
                if (env.BRANCH in ['main', 'dev']) {
                    withCredentials([string(credentialsId: 'Discord-Webhook', variable: 'DISCORD')]) {
                        discordSend description: """
                        제목 : ${env.SERVICE_NAME}-${currentBuild.displayName} 빌드
                        실행 시간 : ${currentBuild.duration / 1000}s
                        """,
                        link: env.BUILD_URL, result: currentBuild.currentResult,
                        title: "${env.JOB_NAME} : ${currentBuild.displayName} 성공",
                        webhookURL: "$DISCORD"
                    }
                }
            }
        }
        failure {
            script {
                if (env.BRANCH in ['main', 'dev']) {
                    withCredentials([string(credentialsId: 'Discord-Webhook', variable: 'DISCORD')]) {
                        discordSend description: """
                        제목 : ${env.SERVICE_NAME}-${currentBuild.displayName} 빌드
                        실행 시간 : ${currentBuild.duration / 1000}s
                        """,
                        link: env.BUILD_URL, result: currentBuild.currentResult,
                        title: "${env.JOB_NAME} : ${currentBuild.displayName} 실패",
                        webhookURL: "$DISCORD"
                    }
                }
            }
        }
    }
}

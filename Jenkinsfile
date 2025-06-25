pipeline {
    agent any

    environment { 
        SERVICE_NAME     = 'frontend'
        AWS_REGION       = 'ap-northeast-2'
        IMAGE_TAG        = "${env.BUILD_NUMBER}"
        ZIP_NAME         = "frontend-${env.BUILD_NUMBER}.zip"
    }

    stages {
        stage('Set Branch & Cron Trigger') {
            steps {
                script {
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceFirst(/^origin\//, '')
                    env.BRANCH = branchName

                    // if (branchName == 'main') {
                    //     properties([pipelineTriggers([cron('40 0 * * 1-5')])])
                    // } else if (branchName == 'dev') {
                    //     properties([pipelineTriggers([
                    //         cron('40 3 * * 1-4'),
                    //         cron('40 23 * * 4'),
                    //         cron('40 3 * * 6,7')
                    //     ])])
                    // } else {
                    //     properties([pipelineTriggers([])])
                    //     echo "⛔ 지원되지 않는 브랜치입니다: ${branchName}. 빌드를 중단합니다."
                    //     currentBuild.result = 'NOT_BUILT'
                    //     error("Unsupported branch: ${branchName}")
                    // }
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Set Environment by Branch') {
            steps {
                script {
                    def isMain = (env.BRANCH == 'main')

                    env.ENV_LABEL        = isMain ? 'prod' : 'dev'
                    env.API_BASE_CRED_ID = isMain ? 'NEXT_PUBLIC_API_BASE_PROD' : 'NEXT_PUBLIC_API_BASE_DEV'
                    env.ECR_REPO         = "794038223418.dkr.ecr.${env.AWS_REGION}.amazonaws.com/dolpin-frontend-${env.ENV_LABEL}"
                    env.S3_BUCKET        = "${env.ENV_LABEL}-dolpin-codedeploy-artifacts"
                    env.APP_NAME         = "frontend-${env.ENV_LABEL}-codedeploy-app"
                    env.DEPLOYMENT_GROUP = "frontend-${env.ENV_LABEL}-deployment-group"
                }
            }
        }

        // stage('Notify Before Start') {
        //     when {
        //         expression { env.BRANCH in ['main', 'dev'] }
        //     }
        //     steps {
        //         script {
        //             withCredentials([string(credentialsId: 'Discord-Webhook', variable: 'DISCORD')]) {
        //                 discordSend(
        //                     description: "🚀 빌드가 시작됩니다: ${env.SERVICE_NAME} - ${env.BRANCH} 브랜치",
        //                     link: env.BUILD_URL,
        //                     title: "빌드 시작",
        //                     webhookURL: "$DISCORD"
        //                 )
        //             }
        //         }
        //     }
        // }

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
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-access-key'
                ]]) {
                    sh """
                    aws ecr get-login-password --region ${AWS_REGION} | \
                      docker login --username AWS --password-stdin ${ECR_REPO}
                    
                    docker build \
                      --build-arg NEXT_PUBLIC_API_BASE_URL=${env.API_BASE_URL} \
                      --build-arg NEXT_PUBLIC_KAKAOMAP_KEY=${env.KAKAOMAP_KEY} \
                      -t ${ECR_REPO}:${IMAGE_TAG} .
                    docker push ${ECR_REPO}:${IMAGE_TAG}
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
                cd deploy && zip -r ../${ZIP_NAME} .
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-access-key'
                ]]) {
                    sh "aws s3 cp ${ZIP_NAME} s3://${S3_BUCKET}/${ZIP_NAME} --region ${AWS_REGION}"
                }
            }
        }

        stage('Trigger CodeDeploy') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-access-key'
                ]]) {
                    sh """
                    aws deploy create-deployment \
                      --application-name ${APP_NAME} \
                      --deployment-group-name ${DEPLOYMENT_GROUP} \
                      --s3-location bucket=${S3_BUCKET},bundleType=zip,key=${ZIP_NAME} \
                      --region ${AWS_REGION} \
                      --file-exists-behavior OVERWRITE

                    aws deploy create-deployment \
                        --application-name backend-prod-codedeploy-app \
                        --deployment-group-name backend-prod-deployment-group \
                        --s3-location bucket=xxx,bundleType=zip,key=xxx \
                        --deployment-config-name CodeDeployDefault.AllAtOnce
                    """
                }
            }
        }
    }

    // post {
    //     success {
    //         script {
    //             if (env.BRANCH in ['main', 'dev']) {
    //                 withCredentials([string(credentialsId: 'Discord-Webhook', variable: 'DISCORD')]) {
    //                     discordSend description: """
    //                     제목 : ${currentBuild.displayName}
    //                     결과 : ${currentBuild.result}
    //                     실행 시간 : ${currentBuild.duration / 1000}s
    //                     """,
    //                     link: env.BUILD_URL, result: currentBuild.currentResult,
    //                     title: "${env.JOB_NAME} : ${currentBuild.displayName} 성공",
    //                     webhookURL: "$DISCORD"
    //                 }
    //             }
    //         }
    //     }
    //     failure {
    //         script {
    //             if (env.BRANCH in ['main', 'dev']) {
    //                 withCredentials([string(credentialsId: 'Discord-Webhook', variable: 'DISCORD')]) {
    //                     discordSend description: """
    //                     제목 : ${currentBuild.displayName}
    //                     결과 : ${currentBuild.result}
    //                     실행 시간 : ${currentBuild.duration / 1000}s
    //                     """,
    //                     link: env.BUILD_URL, result: currentBuild.currentResult,
    //                     title: "${env.JOB_NAME} : ${currentBuild.displayName} 실패",
    //                     webhookURL: "$DISCORD"
    //                 }
    //             }
    //         }
    //     }
    // }
}

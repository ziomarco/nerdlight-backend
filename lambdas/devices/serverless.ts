import type { AWS } from '@serverless/typescript';

import associateDevice from '@functions/associateDevice';
import deassociateDevice from '@functions/deassociateDevice';
import getUserDevices from '@functions/getUserDevices';
import updateDeviceInfo from '@functions/updateDeviceInfo';

const STAGE = 'dev';

const serverlessConfiguration: AWS = {
  org: 'ziomarco',
  app: 'nerdlight',
  service: 'nerdlight-devices-be',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline',
    'serverless-offline-local-authorizers-plugin',
    'serverless-domain-manager',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: STAGE,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DEVICES_TABLE: 'nerdlight-devices-${self:provider.stage}',
      DOMAIN_SUFFIX: 'nerdlight',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DEVICES_TABLE}',
      }
    ],
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    associateDevice,
    deassociateDevice,
    getUserDevices,
    updateDeviceInfo,
  },
  package: { individually: true },
  resources: {
    Resources: {
      serviceUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          CallbackURLs: [
            'https://localhost:4200',
            'https://oauth.pstmn.io/v1/callback'
          ],
          AllowedOAuthScopes: [
            'phone',
            'email',
            'openid',
            'profile',
            'aws.cognito.signin.user.admin'
          ],
          UserPoolId: {
            Ref: 'serviceUserPool'
          },
          AllowedOAuthFlows: [
            'implicit'
          ],
          AllowedOAuthFlowsUserPoolClient: true,
          GenerateSecret: false,
          ExplicitAuthFlows: [
            'ALLOW_USER_SRP_AUTH',
            'ALLOW_REFRESH_TOKEN_AUTH'
          ],
          SupportedIdentityProviders: [
            'COGNITO'
          ],
          ClientName: 'nerdlight-client-${opt:stage, self:provider.stage}'
        }
      },
      serviceUserPoolDomain: {
        Type: 'AWS::Cognito::UserPoolDomain',
        Properties: {
          Domain: 'nerdlight-domain-${opt:stage, self:provider.stage}-${self:provider.environment.DOMAIN_SUFFIX}',
          UserPoolId: {
            Ref: 'serviceUserPool'
          }
        }
      },
      serviceUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          UsernameAttributes: [
            'email'
          ],
          UserPoolName: 'nerdlight-${opt:stage, self:provider.stage}',
          AutoVerifiedAttributes: [
            'email'
          ]
        }
      },
      DevicesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.DEVICES_TABLE}',
          AttributeDefinitions: [
            { AttributeName: 'mac', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'mac', KeyType: 'HASH' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
      ApiGatewayAuthorizer: {
        DependsOn: ['ApiGatewayRestApi'],
        Type: 'AWS::ApiGateway::Authorizer',
        Properties: {
          Name: 'cognito-authorizer',
          IdentitySource: 'method.request.header.Authorization',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
          Type: 'COGNITO_USER_POOLS',
          ProviderARNs: [
            { 'Fn::GetAtt': ['serviceUserPool', 'Arn'] }
          ],
        }
      }
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {
        port: 5001,
        inMemory: true,
        migrate: true,
      },
      stages: [
        STAGE,
      ]
    },
    customDomain: {
      domainName: 'nerdlight.xyz',
      basePath: 'api',
      stage: STAGE,
      certificateName: 'nerdlight.xyz',
      createRoute53Record: true,
    },
  },
};

module.exports = serverlessConfiguration;

import { _schema } from "../dist/_schema";

const swaggerAutogen = require('swagger-autogen')();

require('dotenv').config()

const doc = {
  info: {
    version: '0.1.0',
    title: 'EJBCA API',
    description: 'API for accessing EJBCA Instance',
  },
  host: 'localhost:3000',      
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  schemas: _schema.definitions,
  tags: [
    {
      name: 'certificate',
      description: 'Application endpoints for testing',
    },
  ],
};

const outputFile = 'dist/swagger.json';
const endpointsFiles = ['src/server.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc)
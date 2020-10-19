const {writeFile} = require('fs');
const {argv} = require('yargs');

// Read environment variables from .env file
require('dotenv').config();

// Read the command line arguments passed with yargs
const configuration = argv.configuration;
let targetPath = './client/environments/environment.ts';
let environment = 'development';

switch (configuration) {
    case 'production':
        console.log('Creating production environment file.');
        targetPath = './client/environments/environment.prod.ts';
        environment = 'production';
        break;
    case 'staging':
        console.log('Creating staging environment file.');
        targetPath = './client/environments/environment.stage.ts';
        environment = 'staging';
        break;
    default:
        console.log('Creating development environment file.');
}

// Create the content of the environment file
const environmentFileContent = `
export const environment = {
   environment: "${environment}",
   agmApiKey: "${process.env.MAPS_API_KEY}",
   bugsnagApiKey: "${process.env.BUGSNAG_API_KEY}"
};
`;

// Write the content to the respective file
writeFile(targetPath, environmentFileContent, err => {
    if (err) {
        console.log(err);
    }
    console.log(`Created environment file in ${targetPath}`);
});

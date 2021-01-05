const {writeFile} = require('fs');
const {argv} = require('yargs');

// Read environment variables from .env file
require('dotenv').config();

function createEnvironmentFile(path: string, env: string): void {
    const data = {
        environment: env,
        agmApiKey: process.env.MAPS_API_KEY,
        bugsnagApiKey: process.env.BUGSNAG_API_KEY,
    };
    const environmentFileContent = `export const environment = ${JSON.stringify(data)};`;

    // Write the content to the respective file
    writeFile(path, environmentFileContent, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log(err);
        }
        console.log(`Created environment file in ${path}`);
    });
}

// Read the command line arguments passed with yargs
const configuration = argv.configuration;
let targetPath = './client/environments/environment.ts';
let environment = 'development';

// Create base environment file
createEnvironmentFile(targetPath, environment);

switch (configuration) {
    case 'production':
        console.log('Creating production environment file.');
        targetPath = './client/environments/environment.prod.ts';
        environment = 'production';

        // Create specific environment file
        createEnvironmentFile(targetPath, environment);
        break;
    case 'staging':
        console.log('Creating staging environment file.');
        targetPath = './client/environments/environment.stage.ts';
        environment = 'staging';

        // Create specific environment file
        createEnvironmentFile(targetPath, environment);
        break;
}

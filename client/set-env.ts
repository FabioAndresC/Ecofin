const { writeFileSync } = require('fs');
const { resolve } = require('path');
const dotenv = require('dotenv');

dotenv.config();

const envConfigFile = `
  export const environment = {
    supabaseUrl: '${process.env["SUPABASE_URL"]}',
    supabaseKey: '${process.env["SUPABASE_KEY"]}',
    geminiApiKey: '${process.env["GEMINI_API_KEY"]}',
    apifyApiKey: '${process.env["APIFY_API_KEY"]}'
  };
`;

writeFileSync(
	resolve(__dirname, './src/environments/environment.ts'),
	envConfigFile,
	{ encoding: 'utf8' }
);

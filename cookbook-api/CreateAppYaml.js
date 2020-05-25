const fs = require('fs');

fs.writeFileSync('./app.yaml', 
`runtime: nodejs10
env_variables:
  CLOUD_SQL_DB_PWD: "${process.env.CLOUD_SQL_DB_PWD}"
  CLOUD_SQL_HOST: "${process.env.CLOUD_SQL_DB_HOST}"
  GOOGLE_CLIENT_ID: "${process.env.GOOGLE_CLIENT_ID}"
  SESSION_SECRET: "${process.env.SESSION_SECRET}"
vpc_access_connector:
  name: "projects/${process.env.GOOGLE_PROJECT_ID}/locations/${process.env.GOOGLE_PROJECT_REGION}/connectors/${process.env.GOOGLE_CONNECTOR_NAME}"
`);


const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const  { QueryTypes } = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const runDbUp = async () => {
    const hasScriptsHistoryTable = await sequelize.query(
        `SELECT EXISTS 
        (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'script_history'
        );`, { type: QueryTypes.SELECT });
    if (!hasScriptsHistoryTable[0].exists){
        await sequelize.query(
            `CREATE TABLE public.script_history
            (
                script_name VARCHAR(255) NOT NULL PRIMARY KEY,
                date_run TIMESTAMP NOT NULL
            )`);
    }

    const alreadyRunScripts =  
        (await sequelize.query(
            `SELECT script_name FROM public.script_history`
            , { type: QueryTypes.SELECT })
        ).map(sr => sr.script_name);

    const scriptsDir = path.join(__dirname, 'scripts');
    const filesToExecute = fs
        .readdirSync(scriptsDir)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-4) === '.sql') && (!alreadyRunScripts.includes(file));
        });
    filesToExecute.sort(); //make sure we run the scripts in order!
    
    filesToExecute
        .forEach(file => {
            const scriptFilePath = path.join(scriptsDir, file);
            fs.readFile(scriptFilePath, 'utf8', (err, data) => {
                (async () => {
                    await sequelize.query(data);
                    await sequelize.query(`
                        INSERT INTO public.script_history (script_name, date_run)
                        VALUES ('${file}', CURRENT_TIMESTAMP)`);
                })()
            });
        });
};
runDbUp();
import {QueryTypes} from 'sequelize';
import {initalizeSequelizeInstance} from '../SequelizeFactory';
import * as path from 'path';
import * as fs from 'fs';

interface Exists{
    exists: boolean;
}
interface ScriptName {
    script_name: string;
}

const basename = path.basename(__filename);

var sequelize = initalizeSequelizeInstance();
const runDbUp = async () => {

    const hasScriptsHistoryTable = await sequelize.query<Exists>(
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
        (await sequelize.query<ScriptName>(
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
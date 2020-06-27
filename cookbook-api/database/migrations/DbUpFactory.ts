import { QueryTypes } from "sequelize";
import { initalizeSequelizeInstance } from "../SequelizeFactory";
import * as path from "path";
import * as fs from "fs";
import { Sequelize } from "sequelize-typescript";

interface Exists {
  exists: boolean;
}
interface ScriptName {
  script_name: string;
}

const basename = path.basename(__filename);

export const runDbUp = async (sequelize: Sequelize) => {
  const hasScriptsHistoryTable = await sequelize.query<Exists>(
    `SELECT EXISTS 
        (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'script_history'
        );`,
    { type: QueryTypes.SELECT }
  );

  if (!hasScriptsHistoryTable[0].exists) {
    await sequelize.query(
      `CREATE TABLE public.script_history
            (
                script_name VARCHAR(255) NOT NULL PRIMARY KEY,
                date_run TIMESTAMP NOT NULL
            )`
    );
  }

  const alreadyRunScripts = (
    await sequelize.query<ScriptName>(
      `SELECT script_name FROM public.script_history`,
      { type: QueryTypes.SELECT }
    )
  ).map(sr => sr.script_name);

  const scriptsDir = path.join(__dirname, "scripts");
  const filesToExecute = fs.readdirSync(scriptsDir).filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-4) === ".sql" &&
      !alreadyRunScripts.includes(file)
    );
  });
  filesToExecute.sort(); //make sure we run the scripts in order!

  for (let file of filesToExecute) {
    const scriptFilePath = path.join(scriptsDir, file);
    const fileString = fs.readFileSync(scriptFilePath, "utf8");
    await sequelize.query(fileString);
    await sequelize.query(`
            INSERT INTO public.script_history (script_name, date_run)
            VALUES ('${file}', CURRENT_TIMESTAMP)`);
  }
};

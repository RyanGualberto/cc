import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function runCommand(command: string) {
  try {
    // Usa o execPromise para executar o comando
    const { stdout, stderr } = await execPromise(command);

    console.log(`stdout: ${stdout}`);

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  } catch (error) {
    console.error(`Erro ao executar o comando: ${error}`);
  }
}

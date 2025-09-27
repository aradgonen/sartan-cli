import { spawn } from 'child_process';
import { PackageManager as PM } from './detector';
import chalk from 'chalk';

export function executeCommand(
    manager: PM,
    command: string,
    args: string[]
): Promise<void> {
    return new Promise((resolve, reject) => {
        const fullCommand = `${manager} ${command} ${args.join(' ')}`.trim();
        console.log(chalk.cyan(`> ${fullCommand}`))

        const child = spawn(manager, [command, ...args], {
            stdio: 'inherit',
            // The shell option is not needed and can be a security risk
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        child.on('error', (err) => {
            reject(new Error(`Failed to start command: ${err.message}`));
        });
    });
}

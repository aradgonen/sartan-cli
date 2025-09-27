#!/usr/bin/env node
import { Command } from 'commander';
import { detectPackageManager, PackageManager } from './detector';
import { translateCommand } from './translator';
import { executeCommand } from './executor';
import { version } from '../package.json';
import chalk from 'chalk';

async function main() {
    // Manually check for --detect flag before parsing
    if (process.argv.includes('--detect')) {
        const manager = await getPackageManager();
        console.log(chalk.green(`Detected Package Manager: ${chalk.bold(manager)}`));
        return;
    }

    const program = new Command();

    program
        .name('sartan')
        .version(version)
        .description('One Command to Rule Them All. A universal package manager wrapper for Node.js.')
        .allowUnknownOption()
        .passThroughOptions();

    program
        .option('--detect', 'Show detected package manager and exit')
        .option('-f, --force-manager <manager>', 'Force a specific package manager (npm, yarn, pnpm, bun)');

    async function getPackageManager(forcedManager?: string): Promise<PackageManager> {
        if (forcedManager) {
            if (['npm', 'yarn', 'pnpm', 'bun'].includes(forcedManager)) {
                console.log(chalk.yellow(`Forcing package manager: ${chalk.bold(forcedManager)}`));
                return forcedManager as PackageManager;
            }
            throw new Error(`Invalid forced manager: ${forcedManager}. Must be one of npm, yarn, pnpm, bun.`);
        }
        return await detectPackageManager();
    }

    async function runCommand(command: string, args: string[]) {
        const options = program.opts();
        try {
            const manager = await getPackageManager(options.forceManager);
            const { finalCommand, finalArgs } = translateCommand(manager, command, args);
            await executeCommand(manager, finalCommand, finalArgs);
        } catch (error) {
            if (error instanceof Error) {
                console.error(chalk.red(`Error: ${error.message}`));
            }
            process.exit(1);
        }
    }

    const commands = ['install', 'uninstall', 'run', 'test', 'build', 'start', 'publish', 'audit', 'outdated', 'update'];
    const commandAliases: { [key: string]: string } = {
        install: 'i',
        uninstall: 'un',
        test: 't'
    };

    commands.forEach(commandName => {
        program
            .command(commandName)
            .alias(commandAliases[commandName] || '')
            .description(`Run the '${commandName}' command using the detected package manager`)
            .argument('[args...]', 'arguments for the command')
            .action(async (args) => {
                await runCommand(commandName, args);
            });
    });

    program.on('command:*', async (operands) => {
        const command = operands[0];
        const args = operands.slice(1);
        console.log(chalk.yellow(`Unknown command '${command}'. Attempting to pass it through...`));
        await runCommand(command, args);
    });

    await program.parseAsync(process.argv);

    if (program.args.length === 0) {
        program.help();
    }
}

main().catch(err => {
    if (err instanceof Error) {
        console.error(chalk.red(`An unexpected error occurred: ${err.message}`));
    }
    process.exit(1);
});

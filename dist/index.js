#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const detector_1 = require("./detector");
const translator_1 = require("./translator");
const executor_1 = require("./executor");
const package_json_1 = require("../package.json");
const chalk_1 = __importDefault(require("chalk"));
async function main() {
    // Manually check for --detect flag before parsing
    if (process.argv.includes('--detect')) {
        const manager = await getPackageManager();
        console.log(chalk_1.default.green(`Detected Package Manager: ${chalk_1.default.bold(manager)}`));
        return;
    }
    const program = new commander_1.Command();
    program
        .name('sartan')
        .version(package_json_1.version)
        .description('One Command to Rule Them All. A universal package manager wrapper for Node.js.')
        .allowUnknownOption()
        .passThroughOptions();
    program
        .option('--detect', 'Show detected package manager and exit')
        .option('-f, --force-manager <manager>', 'Force a specific package manager (npm, yarn, pnpm, bun)');
    async function getPackageManager(forcedManager) {
        if (forcedManager) {
            if (['npm', 'yarn', 'pnpm', 'bun'].includes(forcedManager)) {
                console.log(chalk_1.default.yellow(`Forcing package manager: ${chalk_1.default.bold(forcedManager)}`));
                return forcedManager;
            }
            throw new Error(`Invalid forced manager: ${forcedManager}. Must be one of npm, yarn, pnpm, bun.`);
        }
        return await (0, detector_1.detectPackageManager)();
    }
    async function runCommand(command, args) {
        const options = program.opts();
        try {
            const manager = await getPackageManager(options.forceManager);
            const { finalCommand, finalArgs } = (0, translator_1.translateCommand)(manager, command, args);
            await (0, executor_1.executeCommand)(manager, finalCommand, finalArgs);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(chalk_1.default.red(`Error: ${error.message}`));
            }
            process.exit(1);
        }
    }
    const commands = ['install', 'uninstall', 'run', 'test', 'build', 'start', 'publish', 'audit', 'outdated', 'update'];
    const commandAliases = {
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
        console.log(chalk_1.default.yellow(`Unknown command '${command}'. Attempting to pass it through...`));
        await runCommand(command, args);
    });
    await program.parseAsync(process.argv);
    if (program.args.length === 0) {
        program.help();
    }
}
main().catch(err => {
    if (err instanceof Error) {
        console.error(chalk_1.default.red(`An unexpected error occurred: ${err.message}`));
    }
    process.exit(1);
});

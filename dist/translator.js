"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateCommand = translateCommand;
function translateCommand(manager, command, args) {
    // Handle commands that are passed directly
    const passThroughCommands = ['test', 'build', 'start', 'publish', 'audit', 'outdated'];
    if (passThroughCommands.includes(command)) {
        return { finalCommand: command, finalArgs: args };
    }
    switch (command) {
        case 'install':
            // If there are packages, it's an 'add' command for yarn/pnpm/bun
            if (args.length > 0) {
                if (manager === 'yarn' || manager === 'pnpm' || manager === 'bun') {
                    return { finalCommand: 'add', finalArgs: args };
                }
            }
            // Otherwise it's a simple 'install'
            return { finalCommand: 'install', finalArgs: [] }; // args are not needed for a simple install
        case 'uninstall':
            if (manager === 'yarn' || manager === 'pnpm' || manager === 'bun') {
                return { finalCommand: 'remove', finalArgs: args };
            }
            return { finalCommand: 'uninstall', finalArgs: args };
        case 'run':
            // `yarn run dev` is just `yarn dev`
            if (manager === 'yarn') {
                if (args.length > 0) {
                    return { finalCommand: args[0], finalArgs: args.slice(1) };
                }
                // if just `sartan run` is called, yarn should also just get `run`
                return { finalCommand: 'run', finalArgs: [] };
            }
            return { finalCommand: 'run', finalArgs: args };
        default:
            // For any other command, pass it through. This allows for future commands
            // or less common commands to work without being explicitly defined.
            return { finalCommand: command, finalArgs: args };
    }
}

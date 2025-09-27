import { PackageManager } from './detector';

import { PackageManager as PM } from './detector';

export function translateCommand(
    manager: PM,
    command: string,
    args: string[]
): { finalCommand: string, finalArgs: string[] } {

    // Handle commands that are passed directly
    const passThroughCommands = ['test', 'build', 'start', 'publish', 'audit', 'outdated'];
    if (passThroughCommands.includes(command)) {
        return { finalCommand: command, finalArgs: args };
    }

    switch (command) {
        case 'install':
            if (args.length > 0) {
                if (manager === 'npm') {
                    return { finalCommand: 'install', finalArgs: args };
                }
                return { finalCommand: 'add', finalArgs: args };
            }
            return { finalCommand: 'install', finalArgs: [] };

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

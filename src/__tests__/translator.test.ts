import { translateCommand } from '@/translator';
import { PackageManager } from '@/detector';

describe('translateCommand', () => {
    const managers: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];

    managers.forEach(manager => {
        describe(`with ${manager}`, () => {
            it('should handle simple install', () => {
                const { finalCommand, finalArgs } = translateCommand(manager, 'install', []);
                expect(finalCommand).toBe('install');
                expect(finalArgs).toEqual([]);
            });

            it('should handle adding a package', () => {
                const { finalCommand, finalArgs } = translateCommand(manager, 'install', ['react']);
                if (manager === 'npm') {
                    expect(finalCommand).toBe('install');
                    expect(finalArgs).toEqual(['react']);
                } else {
                    expect(finalCommand).toBe('add');
                    expect(finalArgs).toEqual(['react']);
                }
            });

            it('should handle uninstalling a package', () => {
                const { finalCommand, finalArgs } = translateCommand(manager, 'uninstall', ['react']);
                if (manager === 'npm') {
                    expect(finalCommand).toBe('uninstall');
                    expect(finalArgs).toEqual(['react']);
                } else {
                    expect(finalCommand).toBe('remove');
                    expect(finalArgs).toEqual(['react']);
                }
            });

            it('should handle running a script', () => {
                const { finalCommand, finalArgs } = translateCommand(manager, 'run', ['dev']);
                if (manager === 'yarn') {
                    expect(finalCommand).toBe('dev');
                    expect(finalArgs).toEqual([]);
                } else {
                    expect(finalCommand).toBe('run');
                    expect(finalArgs).toEqual(['dev']);
                }
            });

            it('should handle pass-through commands', () => {
                const { finalCommand, finalArgs } = translateCommand(manager, 'test', ['--watch']);
                expect(finalCommand).toBe('test');
                expect(finalArgs).toEqual(['--watch']);
            });
        });
    });
});

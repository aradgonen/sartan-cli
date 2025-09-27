import findUp from 'find-up';
import path from 'path';
import fs from 'fs/promises';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

const LOCK_FILES: Record<string, PackageManager> = {
    'bun.lockb': 'bun',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
};

export async function detectPackageManager(cwd: string = process.cwd()): Promise<PackageManager> {
    // 1. Check package.json for "packageManager" field
    const packageJsonPath = await findUp('package.json', { cwd });
    if (packageJsonPath) {
        const packageJsonContent = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        if (packageJsonContent.packageManager) {
            const manager = packageJsonContent.packageManager.split('@')[0];
            if (['npm', 'yarn', 'pnpm', 'bun'].includes(manager)) {
                return manager as PackageManager;
            }
        }
    }

    // 2. Check for lock files
    for (const lockFile in LOCK_FILES) {
        const found = await findUp(lockFile, { cwd });
        if (found) {
            return LOCK_FILES[lockFile];
        }
    }

    // 3. Fallback to npm
    return 'npm';
}

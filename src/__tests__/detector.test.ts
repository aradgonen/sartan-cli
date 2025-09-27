import { detectPackageManager } from '@/detector';
import fs from 'fs/promises';
import path from 'path';

describe('detectPackageManager', () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(__dirname, 'test-'));
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('should default to npm if no lockfile or packageManager field is found', async () => {
        const manager = await detectPackageManager(tempDir);
        expect(manager).toBe('npm');
    });

    it('should detect yarn from yarn.lock', async () => {
        await fs.writeFile(path.join(tempDir, 'yarn.lock'), '');
        const manager = await detectPackageManager(tempDir);
        expect(manager).toBe('yarn');
    });

    it('should detect pnpm from pnpm-lock.yaml', async () => {
        await fs.writeFile(path.join(tempDir, 'pnpm-lock.yaml'), '');
        const manager = await detectPackageManager(tempDir);
        expect(manager).toBe('pnpm');
    });

    it('should detect bun from bun.lockb', async () => {
        await fs.writeFile(path.join(tempDir, 'bun.lockb'), '');
        const manager = await detectPackageManager(tempDir);
        expect(manager).toBe('bun');
    });

    it('should detect from package.json packageManager field', async () => {
        const packageJson = { packageManager: 'pnpm@8.6.0' };
        await fs.writeFile(path.join(tempDir, 'package.json'), JSON.stringify(packageJson));
        const manager = await detectPackageManager(tempDir);
        expect(manager).toBe('pnpm');
    });

    it('should prioritize packageManager field over lockfiles', async () => {
        await fs.writeFile(path.join(tempDir, 'yarn.lock'), '');
        const packageJson = { packageManager: 'pnpm@8.6.0' };
        await fs.writeFile(path.join(tempDir, 'package.json'), JSON.stringify(packageJson));
        const manager = await detectPackageManager(tempDir);
        expect(manager).toBe('pnpm');
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const detector_1 = require("@/detector");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
describe('detectPackageManager', () => {
    let tempDir;
    beforeEach(async () => {
        tempDir = await promises_1.default.mkdtemp(path_1.default.join(__dirname, 'test-'));
    });
    afterEach(async () => {
        await promises_1.default.rm(tempDir, { recursive: true, force: true });
    });
    it('should default to npm if no lockfile or packageManager field is found', async () => {
        const manager = await (0, detector_1.detectPackageManager)(tempDir);
        expect(manager).toBe('npm');
    });
    it('should detect yarn from yarn.lock', async () => {
        await promises_1.default.writeFile(path_1.default.join(tempDir, 'yarn.lock'), '');
        const manager = await (0, detector_1.detectPackageManager)(tempDir);
        expect(manager).toBe('yarn');
    });
    it('should detect pnpm from pnpm-lock.yaml', async () => {
        await promises_1.default.writeFile(path_1.default.join(tempDir, 'pnpm-lock.yaml'), '');
        const manager = await (0, detector_1.detectPackageManager)(tempDir);
        expect(manager).toBe('pnpm');
    });
    it('should detect bun from bun.lockb', async () => {
        await promises_1.default.writeFile(path_1.default.join(tempDir, 'bun.lockb'), '');
        const manager = await (0, detector_1.detectPackageManager)(tempDir);
        expect(manager).toBe('bun');
    });
    it('should detect from package.json packageManager field', async () => {
        const packageJson = { packageManager: 'pnpm@8.6.0' };
        await promises_1.default.writeFile(path_1.default.join(tempDir, 'package.json'), JSON.stringify(packageJson));
        const manager = await (0, detector_1.detectPackageManager)(tempDir);
        expect(manager).toBe('pnpm');
    });
    it('should prioritize packageManager field over lockfiles', async () => {
        await promises_1.default.writeFile(path_1.default.join(tempDir, 'yarn.lock'), '');
        const packageJson = { packageManager: 'pnpm@8.6.0' };
        await promises_1.default.writeFile(path_1.default.join(tempDir, 'package.json'), JSON.stringify(packageJson));
        const manager = await (0, detector_1.detectPackageManager)(tempDir);
        expect(manager).toBe('pnpm');
    });
});

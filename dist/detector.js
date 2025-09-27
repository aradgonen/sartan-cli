"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPackageManager = detectPackageManager;
const find_up_1 = __importDefault(require("find-up"));
const promises_1 = __importDefault(require("fs/promises"));
const LOCK_FILES = {
    'bun.lockb': 'bun',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
};
async function detectPackageManager(cwd = process.cwd()) {
    // 1. Check package.json for "packageManager" field
    const packageJsonPath = await (0, find_up_1.default)('package.json', { cwd });
    if (packageJsonPath) {
        const packageJsonContent = JSON.parse(await promises_1.default.readFile(packageJsonPath, 'utf-8'));
        if (packageJsonContent.packageManager) {
            const manager = packageJsonContent.packageManager.split('@')[0];
            if (['npm', 'yarn', 'pnpm', 'bun'].includes(manager)) {
                return manager;
            }
        }
    }
    // 2. Check for lock files
    for (const lockFile in LOCK_FILES) {
        const found = await (0, find_up_1.default)(lockFile, { cwd });
        if (found) {
            return LOCK_FILES[lockFile];
        }
    }
    // 3. Fallback to npm
    return 'npm';
}

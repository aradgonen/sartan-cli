"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = executeCommand;
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
function executeCommand(manager, command, args) {
    return new Promise((resolve, reject) => {
        const fullCommand = `${manager} ${command} ${args.join(' ')}`.trim();
        console.log(chalk_1.default.cyan(`> ${fullCommand}`));
        const child = (0, child_process_1.spawn)(manager, [command, ...args], {
            stdio: 'inherit',
            // The shell option is not needed and can be a security risk
        });
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
        child.on('error', (err) => {
            reject(new Error(`Failed to start command: ${err.message}`));
        });
    });
}

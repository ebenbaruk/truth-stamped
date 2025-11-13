#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { initCommand, stampCommand, verifyCommand, listCommand } from './commands';
import chalk from 'chalk';

const program = new Command();

program
  .name('truth-stamped')
  .description('CLI tool for stamping and verifying content authenticity on the blockchain')
  .version('0.1.0');

// Init command
program
  .command('init')
  .description('Initialize wallet for Truth Stamped')
  .option('-i, --import', 'Import existing wallet from private key')
  .action(initCommand);

// Stamp command
program
  .command('stamp <file>')
  .description('Stamp content on the blockchain')
  .option('-m, --metadata <metadata>', 'Optional metadata to store with the stamp')
  .option('-n, --network <network>', 'Network to use (mainnet or sepolia)', 'sepolia')
  .action(stampCommand);

// Verify command
program
  .command('verify [file]')
  .description('Verify content on the blockchain')
  .option('-h, --hash <hash>', 'Content hash to verify (instead of file)')
  .option('-n, --network <network>', 'Network to use (mainnet or sepolia)', 'sepolia')
  .action(verifyCommand);

// List command
program
  .command('list')
  .description('List all stamps by your wallet')
  .option('-n, --network <network>', 'Network to use (mainnet or sepolia)', 'sepolia')
  .option('-a, --address <address>', 'Address to list stamps for (instead of wallet)')
  .action(listCommand);

// Error handling
program.configureOutput({
  outputError: (str, write) => write(chalk.red(str)),
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

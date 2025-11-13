import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import chalk from 'chalk';
import {
  hashFile,
  loadWallet,
  getProvider,
  getSigner,
  getContract,
  stampContent,
  signContentHash,
} from '../utils';
import { getConfig } from '../config';

interface StampOptions {
  metadata?: string;
  network?: 'mainnet' | 'sepolia';
}

async function promptPassword(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    process.stdout.write('Enter wallet password: ');
    process.stdin.setRawMode(true);

    let password = '';

    process.stdin.on('data', (char) => {
      const charStr = char.toString('utf8');

      if (charStr === '\n' || charStr === '\r' || charStr === '\u0004') {
        process.stdin.setRawMode(false);
        process.stdout.write('\n');
        rl.close();
        resolve(password);
      } else if (charStr === '\u0003') {
        process.exit(0);
      } else if (charStr === '\u007f') {
        if (password.length > 0) {
          password = password.slice(0, -1);
        }
      } else {
        password += charStr;
      }
    });
  });
}

export async function stampCommand(
  file: string,
  options: StampOptions
): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n📝 Stamping Content on Blockchain\n'));

    // Validate file exists
    if (!fs.existsSync(file)) {
      console.log(chalk.red(`Error: File not found: ${file}`));
      process.exit(1);
    }

    const network = options.network || 'sepolia';
    const config = getConfig(network);

    if (!config.contractAddress) {
      console.log(
        chalk.red(
          `Error: Contract address not configured for ${network}. Set TRUTH_STAMP_CONTRACT_${network.toUpperCase()} environment variable.`
        )
      );
      process.exit(1);
    }

    // Hash the file
    console.log(chalk.cyan('Hashing file...'));
    const contentHash = await hashFile(file);
    console.log(chalk.white(`Content hash: ${contentHash}`));

    // Load wallet
    const password = await promptPassword();
    console.log(chalk.cyan('Loading wallet...'));
    const wallet = await loadWallet(password);
    console.log(chalk.white(`Wallet address: ${wallet.address}`));

    // Connect to blockchain
    console.log(chalk.cyan(`Connecting to ${network}...`));
    const provider = getProvider(config.rpcUrl);
    const signer = getSigner(wallet, provider);

    // Get contract
    const contract = getContract(config.contractAddress, signer);

    // Sign content hash
    console.log(chalk.cyan('Signing content hash...'));
    const signature = await signContentHash(wallet, contentHash);

    // Prepare metadata
    const metadata =
      options.metadata || `filename:${path.basename(file)},tool:truth-stamped-cli`;

    // Stamp content
    console.log(chalk.cyan('Submitting to blockchain...'));
    const tx = await stampContent(contract, contentHash, signature, metadata);

    console.log(chalk.yellow(`Transaction hash: ${tx.hash}`));
    console.log(chalk.cyan('Waiting for confirmation...'));

    const receipt = await tx.wait();

    console.log(chalk.green.bold('\n✅ Content successfully stamped!'));
    console.log(chalk.white(`Block number: ${receipt?.blockNumber}`));
    console.log(chalk.white(`Content hash: ${contentHash}`));
    console.log(chalk.white(`Creator: ${wallet.address}`));
    console.log(chalk.white(`Metadata: ${metadata}`));
    console.log(
      chalk.cyan(
        `\nView on Basescan: https://${network === 'sepolia' ? 'sepolia.' : ''}basescan.org/tx/${tx.hash}\n`
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\nError: ${error.message}`));
    } else {
      console.error(chalk.red('\nAn unknown error occurred'));
    }
    process.exit(1);
  }
}

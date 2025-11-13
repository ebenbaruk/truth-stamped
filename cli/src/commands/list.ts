import * as readline from 'readline';
import chalk from 'chalk';
import {
  loadWallet,
  getProvider,
  getContract,
  getCreatorStamps,
  verifyContent,
} from '../utils';
import { getConfig } from '../config';

interface ListOptions {
  network?: 'mainnet' | 'sepolia';
  address?: string;
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

export async function listCommand(options: ListOptions): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n📜 Listing Content Stamps\n'));

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

    let address: string;

    if (options.address) {
      address = options.address;
    } else {
      // Load wallet to get address
      const password = await promptPassword();
      console.log(chalk.cyan('Loading wallet...'));
      const wallet = await loadWallet(password);
      address = wallet.address;
    }

    console.log(chalk.white(`Address: ${address}`));

    // Connect to blockchain
    console.log(chalk.cyan(`Connecting to ${network}...`));
    const provider = getProvider(config.rpcUrl);

    // Get contract
    const contract = getContract(config.contractAddress, provider);

    // Get stamps
    console.log(chalk.cyan('Fetching stamps...'));
    const hashes = await getCreatorStamps(contract, address);

    if (hashes.length === 0) {
      console.log(chalk.yellow('\nNo stamps found for this address.\n'));
      return;
    }

    console.log(chalk.green.bold(`\n✅ Found ${hashes.length} stamp(s):\n`));

    // Fetch details for each stamp
    for (let i = 0; i < hashes.length; i++) {
      const hash = hashes[i];
      if (!hash) continue;

      const stamp = await verifyContent(contract, hash);

      const date = new Date(stamp.timestamp * 1000);

      console.log(chalk.white(`${i + 1}. Content Hash: ${hash}`));
      console.log(chalk.gray(`   Timestamp: ${date.toLocaleString()}`));
      console.log(chalk.gray(`   Metadata: ${stamp.metadata || 'None'}`));
      console.log('');
    }

    console.log(
      chalk.cyan(
        `View on Basescan: https://${network === 'sepolia' ? 'sepolia.' : ''}basescan.org/address/${address}\n`
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

import * as fs from 'fs';
import chalk from 'chalk';
import { hashFile, getProvider, getContract, verifyContent } from '../utils';
import { getConfig } from '../config';

interface VerifyOptions {
  hash?: string;
  network?: 'mainnet' | 'sepolia';
}

export async function verifyCommand(
  file: string | undefined,
  options: VerifyOptions
): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n🔍 Verifying Content\n'));

    let contentHash: string;

    if (options.hash) {
      // Use provided hash
      contentHash = options.hash;
      if (!contentHash.startsWith('0x')) {
        contentHash = '0x' + contentHash;
      }
    } else if (file) {
      // Hash the file
      if (!fs.existsSync(file)) {
        console.log(chalk.red(`Error: File not found: ${file}`));
        process.exit(1);
      }

      console.log(chalk.cyan('Hashing file...'));
      contentHash = await hashFile(file);
      console.log(chalk.white(`Content hash: ${contentHash}`));
    } else {
      console.log(
        chalk.red('Error: Either --hash or file path must be provided')
      );
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

    // Connect to blockchain
    console.log(chalk.cyan(`Connecting to ${network}...`));
    const provider = getProvider(config.rpcUrl);

    // Get contract
    const contract = getContract(config.contractAddress, provider);

    // Verify content
    console.log(chalk.cyan('Checking blockchain...'));
    const stamp = await verifyContent(contract, contentHash);

    if (!stamp.exists) {
      console.log(chalk.red.bold('\n❌ Content NOT verified'));
      console.log(
        chalk.yellow(
          'This content has not been stamped on the blockchain.\n'
        )
      );
      process.exit(0);
    }

    // Format timestamp
    const date = new Date(stamp.timestamp * 1000);

    console.log(chalk.green.bold('\n✅ Content VERIFIED'));
    console.log(chalk.white('\n📋 Stamp Details:'));
    console.log(chalk.white(`Content hash: ${stamp.contentHash}`));
    console.log(chalk.white(`Creator: ${stamp.creator}`));
    console.log(chalk.white(`Timestamp: ${date.toLocaleString()}`));
    console.log(chalk.white(`Metadata: ${stamp.metadata || 'None'}`));
    console.log(
      chalk.cyan(
        `\nView on Basescan: https://${network === 'sepolia' ? 'sepolia.' : ''}basescan.org/address/${stamp.creator}\n`
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

import * as readline from 'readline';
import { createWallet, importWallet, saveWallet, walletExists } from '../utils';
import chalk from 'chalk';

interface InitOptions {
  import?: boolean;
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function promptPassword(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    process.stdout.write('Enter password to encrypt wallet: ');
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
        // Ctrl+C
        process.exit(0);
      } else if (charStr === '\u007f') {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
        }
      } else {
        password += charStr;
      }
    });
  });
}

export async function initCommand(options: InitOptions): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n🔐 Truth Stamped Wallet Setup\n'));

    if (walletExists()) {
      const overwrite = await prompt(
        'Wallet already exists. Overwrite? (yes/no): '
      );
      if (overwrite.toLowerCase() !== 'yes') {
        console.log(chalk.yellow('Setup cancelled.'));
        return;
      }
    }

    let wallet;

    if (options.import) {
      console.log(chalk.cyan('\nImporting existing wallet...'));
      const privateKey = await prompt('Enter your private key: ');

      if (!privateKey) {
        console.log(chalk.red('Private key is required.'));
        process.exit(1);
      }

      wallet = importWallet(privateKey);
    } else {
      console.log(chalk.cyan('\nGenerating new wallet...'));
      wallet = createWallet();
    }

    // Get password to encrypt wallet
    const password = await promptPassword();

    if (!password || password.length < 8) {
      console.log(chalk.red('\nPassword must be at least 8 characters.'));
      process.exit(1);
    }

    // Save encrypted wallet
    console.log(chalk.cyan('\nEncrypting and saving wallet...'));
    await saveWallet(wallet, password);

    console.log(chalk.green.bold('\n✅ Wallet successfully created!'));
    console.log(chalk.yellow('\n📋 Wallet Details:'));
    console.log(chalk.white(`Address: ${wallet.address}`));

    if (!options.import && 'mnemonic' in wallet && wallet.mnemonic) {
      console.log(
        chalk.red.bold('\n⚠️  IMPORTANT: Save your mnemonic phrase:')
      );
      console.log(chalk.white(wallet.mnemonic.phrase));
      console.log(
        chalk.yellow(
          '\nStore this phrase in a safe place. You will need it to recover your wallet.'
        )
      );
    }

    console.log(chalk.cyan('\n💡 Next steps:'));
    console.log('1. Fund your wallet with ETH on Base');
    console.log('2. Use "truth-stamped stamp <file>" to stamp content');
    console.log('3. Use "truth-stamped verify <file>" to verify content\n');
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unknown error occurred'));
    }
    process.exit(1);
  }
}

import * as SecureStore from 'expo-secure-store';
import { ethers } from 'ethers';
import { ENV, DEV_MNEMONIC, MAX_NUMBER_OF_ACCOUNTS } from 'react-native-dotenv';

type WalletKeysType = {
  MNEMONIC: string;
  NUMBER_OF_ACCOUNTS: string;
  MAX_NUMBER_OF_ACCOUNTS: string;
  ACCOUNT: string;
  ADDRESS: string;
  ACTIVE_ACCOUNT: string;
};

export const WalletKeys: WalletKeysType = {
  MNEMONIC: 'wallet.mnemonic',
  NUMBER_OF_ACCOUNTS: 'wallet.numberOfAccounts',
  MAX_NUMBER_OF_ACCOUNTS: 'wallet.maxNumberOfAccounts',
  ACCOUNT: 'wallet.%s.privateKey',
  ADDRESS: 'wallet.%s.address',
  ACTIVE_ACCOUNT: 'wallet.active',
};

type AccountNumber = 0 | 1 | 2 | 3 | 4;

// We start counting from 0.  Max 3 accounts
const getAccount = async (accountNumber: AccountNumber) => {
  console.log('getAccount');

  // Check to see if we already have this account
  const accountPk = await SecureStore.getItemAsync(
    WalletKeys.ACCOUNT.replace('%s', accountNumber.toString()),
  );

  if (accountPk) {
    const address = new ethers.Wallet(accountPk).address;
    console.log('accountPk', accountPk);

    return {
      privateKey: accountPk,
      address: address,
    };
  }

  return false;
};

const createAccount = async () => {
  console.log('createAccount');

  // Get the next account number
  const storageNumberOfAccounts = await SecureStore.getItemAsync(
    WalletKeys.NUMBER_OF_ACCOUNTS,
  );

  // Get the count of number of accounts
  const numberOfAccounts = storageNumberOfAccounts
    ? parseInt(storageNumberOfAccounts)
    : 0;

  console.log('numberOfAccounts', numberOfAccounts);

  if (numberOfAccounts >= parseInt(MAX_NUMBER_OF_ACCOUNTS)) {
    console.log('Max number of accounts reached');
    return;
  }

  // The count and the account Number are different
  // i.e. first account Number is 0 but the number of accounts would be 1 once this has been created
  // So the next account number is the current number of accounts
  const nextAccountNumber: AccountNumber = numberOfAccounts as AccountNumber;

  const mnemonic = await SecureStore.getItemAsync(WalletKeys.MNEMONIC);

  if (!mnemonic) {
    console.log('No mnemonic found');
    return;
  }

  const wallet = ethers.Wallet.fromMnemonic(
    mnemonic,
    `m/44'/60'/0'/0/${nextAccountNumber}`,
  );

  saveAccount(nextAccountNumber, wallet.privateKey, wallet.address);

  // Update the number of accounts
  await SecureStore.setItemAsync(
    'wallet.numberOfAccounts',
    (nextAccountNumber + 1).toString(),
  );

  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
  };
};

// Create mnemonic - only called once
const createWallet = async () => {
  console.log('createWallet');
  let wallet;

  // Set the max number of accounts that can be created
  console.log('MAX_NUMBER_OF_ACCOUNTS', MAX_NUMBER_OF_ACCOUNTS);
  await SecureStore.setItemAsync(
    WalletKeys.MAX_NUMBER_OF_ACCOUNTS,
    MAX_NUMBER_OF_ACCOUNTS || '5',
  );

  // Use the development mnemonic if we are in development mode
  if (ENV === 'development') {
    await SecureStore.setItemAsync(WalletKeys.MNEMONIC, DEV_MNEMONIC);
    wallet = ethers.Wallet.fromMnemonic(DEV_MNEMONIC);
    saveAccount(0, wallet.privateKey, wallet.address);
  } else {
    wallet = ethers.Wallet.createRandom();
    saveAccount(0, wallet.privateKey, wallet.address);
    await SecureStore.setItemAsync(WalletKeys.MNEMONIC, wallet.mnemonic.phrase);
  }

  // Set the number of accounts to 1 as we have created the first one
  await SecureStore.setItemAsync(WalletKeys.NUMBER_OF_ACCOUNTS, '1');
  console.log('NUMBER_OF_ACCOUNTS', '1');

  setActiveAccount(wallet.address);

  return wallet.address;
};

const isMnemonicSet = async () => {
  console.log('isMnemonicSet');

  const mnemonic = await SecureStore.getItemAsync(WalletKeys.MNEMONIC);

  if (!mnemonic) {
    console.log('No mnemonic found');
    return false;
  }

  return true;
};

// Only used for development
const resetAccount = async () => {
  console.log('resetAccount');

  // Set the number of accounts to 0 at this stage
  await SecureStore.setItemAsync(WalletKeys.NUMBER_OF_ACCOUNTS, '0');
  console.log('NUMBER_OF_ACCOUNTS', '0');

  // Remove all accounts
  await SecureStore.deleteItemAsync(WalletKeys.ACCOUNT.replace('%s', '0'));
  await SecureStore.deleteItemAsync(WalletKeys.ACCOUNT.replace('%s', '1'));
  await SecureStore.deleteItemAsync(WalletKeys.ACCOUNT.replace('%s', '2'));

  console.log('All accounts removed');
  await SecureStore.deleteItemAsync(WalletKeys.MNEMONIC);
};

const saveAccount = async (
  accountNumber: AccountNumber,
  privateKey: string,
  address: string,
) => {
  console.log('saveAccount');

  await SecureStore.setItemAsync(
    WalletKeys.ACCOUNT.replace('%s', accountNumber.toString()),
    privateKey,
  );

  await SecureStore.setItemAsync(
    WalletKeys.ADDRESS.replace('%s', accountNumber.toString()),
    address,
  );
};

const setActiveAccount = async (account: string) => {
  console.log('setActiveAccount', account);
  await SecureStore.setItemAsync(WalletKeys.ACTIVE_ACCOUNT, account);
};

const getActiveAccount = async (): Promise<string> => {
  return await SecureStore.getItemAsync(WalletKeys.ACTIVE_ACCOUNT);
};

export {
  getAccount,
  createAccount,
  createWallet,
  isMnemonicSet,
  resetAccount,
  getActiveAccount,
};

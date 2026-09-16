// Bank Account Management System with Fraud Detection

interface Account {
  accountNumber: string;
  holderName: string;
  balance: number;
  history: number[];         // past withdrawal/transfer amounts
  withdrawalTimes: number[]; // timestamps (ms) of past withdrawals
}

const RAPID_WITHDRAWAL_LIMIT = 3;
const RAPID_WITHDRAWAL_WINDOW_MS = 10_000; // 10 seconds
const SPIKE_MULTIPLIER = 5;

const accounts: Map<string, Account> = new Map();

function generateAccountNumber(): string {
  const number = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return number.toString();
}

function createAccount(holderName: string, initialDeposit: number): Account {
  if (initialDeposit <= 0) {
    throw new Error("Initial deposit must be greater than zero");
  }

  const account: Account = {
    accountNumber: generateAccountNumber(),
    holderName,
    balance: initialDeposit,
    history: [],
    withdrawalTimes: [],
  };

  accounts.set(account.accountNumber, account);
  return account;
}

function deposit(accountNumber: string, amount: number): string {
  const account = accounts.get(accountNumber);
  if (!account) return "Account not found";
  if (amount <= 0) return "Deposit amount must be greater than zero";

  account.balance += amount;
  return "Success";
}

function hasEnoughFunds(account: Account, amount: number): boolean {
  return amount <= account.balance;
}

function isTooFast(account: Account): boolean {
  const now = Date.now();
  const recentCount = account.withdrawalTimes.filter(
    (t) => now - t <= RAPID_WITHDRAWAL_WINDOW_MS
  ).length;
  return recentCount + 1 > RAPID_WITHDRAWAL_LIMIT;
}

function isSpike(account: Account, amount: number): boolean {
  if (account.history.length === 0) return false;
  const average =
    account.history.reduce((sum, val) => sum + val, 0) / account.history.length;
  return amount > SPIKE_MULTIPLIER * average;
}

function recordWithdrawal(account: Account, amount: number): void {
  account.balance -= amount;
  account.withdrawalTimes.push(Date.now());
  account.history.push(amount);
}

function withdraw(accountNumber: string, amount: number): string {
  const account = accounts.get(accountNumber);
  if (!account) return "Account not found";
  if (amount <= 0) return "Withdrawal amount must be greater than zero";

  if (!hasEnoughFunds(account, amount)) return "Blocked: Insufficient Funds";
  if (isTooFast(account)) return "Blocked: Too Fast";
  if (isSpike(account, amount)) return "Blocked: Unusual Spike";

  recordWithdrawal(account, amount);
  return "Success";
}

function transfer(
  senderAccountNumber: string,
  receiverAccountNumber: string,
  amount: number
): string {
  const sender = accounts.get(senderAccountNumber);
  const receiver = accounts.get(receiverAccountNumber);

  if (!sender) return "Sender account not found";
  if (!receiver) return "Receiver account not found";
  if (amount <= 0) return "Transfer amount must be greater than zero";

  if (!hasEnoughFunds(sender, amount)) return "Blocked: Insufficient Funds";
  if (isTooFast(sender)) return "Blocked: Too Fast";
  if (isSpike(sender, amount)) return "Blocked: Unusual Spike";

  recordWithdrawal(sender, amount);
  receiver.balance += amount;
  return "Success";
}

function getAccount(accountNumber: string): Account | undefined {
  return accounts.get(accountNumber);
}

export {
  Account,
  createAccount,
  deposit,
  withdraw,
  transfer,
  getAccount,
  accounts,
};

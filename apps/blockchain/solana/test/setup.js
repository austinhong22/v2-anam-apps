import { vi } from 'vitest';

// Mock solanaWeb3
global.solanaWeb3 = {
  Connection: vi.fn(),
  Keypair: {
    generate: vi.fn(),
    fromSecretKey: vi.fn(),
    fromSeed: vi.fn()
  },
  PublicKey: vi.fn(),
  Transaction: vi.fn(),
  SystemProgram: {
    transfer: vi.fn()
  },
  LAMPORTS_PER_SOL: 1000000000,
  bip39: {
    validateMnemonic: vi.fn(),
    mnemonicToSeedSync: vi.fn()
  }
};

// Mock window object
global.window = {
  anamUI: {
    createKeystore: vi.fn().mockResolvedValue('encrypted-keystore'),
    decryptKeystore: vi.fn().mockResolvedValue([1, 2, 3, 4, 5])
  },
  showToast: vi.fn(),
  formatBalance: vi.fn((balance) => parseFloat(balance).toFixed(4)),
  shortenAddress: vi.fn((address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }),
  parseAmount: vi.fn((amount) => (parseFloat(amount) * 1000000000).toString())
};

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

// Mock navigator
global.navigator = {
  clipboard: {
    writeText: vi.fn().mockResolvedValue()
  }
};

// Mock console
global.console = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn()
};

// Mock document
global.document = {
  getElementById: vi.fn(),
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(),
  createElement: vi.fn(),
  body: {
    appendChild: vi.fn()
  }
};

// Mock setTimeout
global.setTimeout = vi.fn((fn, delay) => {
  if (delay === 0) {
    fn();
  }
  return 1;
});

// Mock setInterval
global.setInterval = vi.fn((fn, delay) => {
  return 1;
});

// Mock Result class
global.Result = class Result {
  constructor(success, data, error) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success(data) {
    return new Result(true, data, null);
  }

  static failure(error) {
    return new Result(false, null, error);
  }
};

// Mock SolanaAdapter class
global.SolanaAdapter = class SolanaAdapter {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async generateWallet() {
    try {
      const keypair = { 
        publicKey: { toString: () => 'test-public-key' },
        secretKey: new Uint8Array([1, 2, 3, 4, 5])
      };
      return Result.success({
        address: keypair.publicKey.toString(),
        secretKey: 'encrypted-keystore',
        publicKey: keypair.publicKey.toString()
      });
    } catch (error) {
      return Result.failure(error.message);
    }
  }

  async getBalance(address) {
    try {
      return Result.success('1.0');
    } catch (error) {
      return Result.failure('잔액 조회에 실패했습니다');
    }
  }

  async sendTx(to, lamports) {
    try {
      return Result.success({
        signature: 'test-signature'
      });
    } catch (error) {
      return Result.failure(error.message);
    }
  }

  async getHistory(address) {
    try {
      return Result.success([
        { signature: 'sig1', slot: 100, blockTime: 1234567890, status: '성공', amount: 1000000000 },
        { signature: 'sig2', slot: 101, blockTime: 1234567891, status: '성공', amount: 2000000000 }
      ]);
    } catch (error) {
      return Result.failure('트랜잭션 히스토리 조회에 실패했습니다');
    }
  }

  isValidAddress(address) {
    try {
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Mock CoinConfig
global.CoinConfig = {
  name: "Solana",
  symbol: "SOL",
  decimals: 9,
  network: {
    rpcEndpoint: "https://api.devnet.solana.com",
    networkName: "devnet",
    cluster: "devnet"
  }
}; 
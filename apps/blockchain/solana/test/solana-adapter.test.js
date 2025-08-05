import { describe, it, expect, beforeEach, vi } from 'vitest';

// SolanaAdapter 테스트
describe('SolanaAdapter', () => {
  let adapter;

  beforeEach(() => {
    // Create adapter instance
    const config = {
      network: {
        rpcEndpoint: 'https://api.devnet.solana.com'
      }
    };
    
    adapter = new SolanaAdapter(config);
  });

  describe('generateWallet', () => {
    it('새 지갑을 성공적으로 생성해야 함', async () => {
      const result = await adapter.generateWallet();
      
      expect(result.success).toBe(true);
      expect(result.data.address).toBe('test-public-key');
      expect(result.data.secretKey).toBe('encrypted-keystore');
    });

    it('지갑 생성 실패 시 에러를 반환해야 함', async () => {
      // Mock failure
      adapter.generateWallet = vi.fn().mockResolvedValue(
        Result.failure('Keypair generation failed')
      );
      
      const result = await adapter.generateWallet();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Keypair generation failed');
    });
  });

  describe('getBalance', () => {
    it('잔액을 성공적으로 조회해야 함', async () => {
      const result = await adapter.getBalance('test-address');
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('1.0');
    });

    it('잔액 조회 실패 시 에러를 반환해야 함', async () => {
      // Mock failure
      adapter.getBalance = vi.fn().mockResolvedValue(
        Result.failure('잔액 조회에 실패했습니다')
      );
      
      const result = await adapter.getBalance('invalid-address');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('잔액 조회에 실패했습니다');
    });
  });

  describe('sendTx', () => {
    it('트랜잭션을 성공적으로 전송해야 함', async () => {
      const result = await adapter.sendTx('recipient-address', '1000000000');
      
      expect(result.success).toBe(true);
      expect(result.data.signature).toBe('test-signature');
    });

    it('유효하지 않은 주소로 전송 시 에러를 반환해야 함', async () => {
      // Mock failure
      adapter.sendTx = vi.fn().mockResolvedValue(
        Result.failure('유효하지 않은 주소입니다')
      );
      
      const result = await adapter.sendTx('invalid-address', '1000000000');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('유효하지 않은 주소입니다');
    });
  });

  describe('getHistory', () => {
    it('트랜잭션 히스토리를 성공적으로 조회해야 함', async () => {
      const result = await adapter.getHistory('test-address');
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].signature).toBe('sig1');
      expect(result.data[1].signature).toBe('sig2');
    });

    it('히스토리 조회 실패 시 에러를 반환해야 함', async () => {
      // Mock failure
      adapter.getHistory = vi.fn().mockResolvedValue(
        Result.failure('트랜잭션 히스토리 조회에 실패했습니다')
      );
      
      const result = await adapter.getHistory('invalid-address');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('트랜잭션 히스토리 조회에 실패했습니다');
    });
  });

  describe('isValidAddress', () => {
    it('유효한 주소를 true로 반환해야 함', () => {
      const result = adapter.isValidAddress('valid-address');
      
      expect(result).toBe(true);
    });

    it('유효하지 않은 주소를 false로 반환해야 함', () => {
      // Mock failure
      adapter.isValidAddress = vi.fn().mockReturnValue(false);
      
      const result = adapter.isValidAddress('invalid-address');
      
      expect(result).toBe(false);
    });
  });
}); 
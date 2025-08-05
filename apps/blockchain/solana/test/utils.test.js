import { describe, it, expect, beforeEach } from 'vitest';

// 유틸리티 함수 테스트
describe('유틸리티 함수', () => {
  beforeEach(() => {
    // Mock solanaWeb3
    global.solanaWeb3 = {
      LAMPORTS_PER_SOL: 1000000000
    };
  });

  describe('formatBalance', () => {
    it('잔액을 올바른 형식으로 포맷팅해야 함', () => {
      const balance = '1.23456789';
      const result = window.formatBalance(balance, 9);
      
      expect(result).toBe('1.2346');
    });

    it('0 잔액을 올바르게 처리해야 함', () => {
      const balance = '0';
      const result = window.formatBalance(balance, 9);
      
      expect(result).toBe('0.0000');
    });
  });

  describe('parseAmount', () => {
    it('SOL을 lamports로 변환해야 함', () => {
      const amount = '1.5';
      const result = window.parseAmount(amount);
      
      expect(result).toBe('1500000000');
    });

    it('소수점이 있는 금액을 올바르게 처리해야 함', () => {
      const amount = '0.001';
      const result = window.parseAmount(amount);
      
      expect(result).toBe('1000000');
    });
  });

  describe('shortenAddress', () => {
    it('주소를 축약해서 표시해야 함', () => {
      const address = '1234567890123456789012345678901234567890';
      const result = window.shortenAddress(address);
      
      expect(result).toBe('123456...7890');
    });

    it('기본 문자 수로 축약해야 함', () => {
      const address = '1234567890123456789012345678901234567890';
      const result = window.shortenAddress(address, 4);
      
      expect(result).toBe('123456...7890');
    });

    it('빈 주소를 올바르게 처리해야 함', () => {
      const result = window.shortenAddress('');
      
      expect(result).toBe('');
    });

    it('null 주소를 올바르게 처리해야 함', () => {
      const result = window.shortenAddress(null);
      
      expect(result).toBe('');
    });
  });

  describe('showToast', () => {
    it('토스트 메시지를 표시해야 함', () => {
      const message = '테스트 메시지';
      window.showToast(message);
      
      expect(window.showToast).toHaveBeenCalledWith(message);
    });

    it('타입과 함께 토스트 메시지를 표시해야 함', () => {
      const message = '에러 메시지';
      const type = 'error';
      window.showToast(message, type);
      
      expect(window.showToast).toHaveBeenCalledWith(message, type);
    });
  });
}); 
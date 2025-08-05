import { describe, it, expect } from 'vitest';

// Result 클래스 테스트
describe('Result 클래스', () => {
  it('성공 결과를 올바르게 생성해야 함', () => {
    const data = { test: 'data' };
    const result = Result.success(data);
    
    expect(result.success).toBe(true);
    expect(result.data).toBe(data);
    expect(result.error).toBe(null);
  });

  it('실패 결과를 올바르게 생성해야 함', () => {
    const error = '테스트 에러';
    const result = Result.failure(error);
    
    expect(result.success).toBe(false);
    expect(result.data).toBe(null);
    expect(result.error).toBe(error);
  });

  it('생성자를 통해 결과를 생성할 수 있어야 함', () => {
    const successResult = new Result(true, 'data', null);
    const failureResult = new Result(false, null, 'error');
    
    expect(successResult.success).toBe(true);
    expect(successResult.data).toBe('data');
    expect(successResult.error).toBe(null);
    
    expect(failureResult.success).toBe(false);
    expect(failureResult.data).toBe(null);
    expect(failureResult.error).toBe('error');
  });
}); 
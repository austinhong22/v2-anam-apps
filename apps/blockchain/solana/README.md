# Solana 지갑 미니앱

Solana 블록체인을 위한 완전한 지갑 미니앱입니다.

## 기능

### 🏦 지갑 관리
- **새 지갑 생성**: Solana Keypair.generate()를 사용한 안전한 지갑 생성
- **니모닉 복구**: 12/24단어 니모닉으로 지갑 복구
- **개인키 가져오기**: 개인키로 기존 지갑 가져오기
- **암호화 저장**: secretKey를 window.anamUI.createKeystore()로 암호화 저장

### 💰 잔액 및 전송
- **실시간 잔액**: Devnet RPC를 통한 실시간 잔액 조회
- **SOL 전송**: 안전한 트랜잭션 전송 기능
- **주소 검증**: Solana 주소 형식 검증
- **잔액 확인**: 전송 전 잔액 부족 여부 확인

### 📱 사용자 인터페이스
- **메인 화면**: 주소 표시, 잔액 확인, 네비게이션
- **전송 화면**: 받는 주소, 금액 입력, 수수료 설정
- **받기 화면**: QR 코드 생성, 주소 복사
- **내역 화면**: 최근 10건 트랜잭션 목록

### 🔧 기술 스택
- **RPC 엔드포인트**: https://api.devnet.solana.com
- **폴리필**: Vite + vite-plugin-node-polyfills
- **테스트**: Vitest
- **언어**: ES2020+, strict mode

## 파일 구조

```
solana/
├── app.js                 # 메인 어댑터 및 설정
├── app.css               # 공통 스타일
├── manifest.json         # 앱 매니페스트
├── package.json          # 의존성 관리
├── vitest.config.js      # 테스트 설정
├── pages/
│   ├── index/           # 메인 지갑 화면
│   ├── send/            # 전송 화면
│   ├── receive/         # 받기 화면
│   └── history/         # 트랜잭션 내역
├── assets/
│   ├── icons/           # 앱 아이콘
│   └── solana-bundle.umd.cjs  # Solana Web3.js 번들
└── test/
    ├── setup.js         # 테스트 설정
    ├── solana-adapter.test.js  # 어댑터 테스트
    ├── result-class.test.js    # Result 클래스 테스트
    └── utils.test.js           # 유틸리티 함수 테스트
```

## 설치 및 실행

### 의존성 설치
```bash
npm install
```

### 테스트 실행
```bash
# 모든 테스트 실행
npm test

# 테스트 한 번 실행
npm run test:run

# 커버리지 포함 테스트
npm run test:coverage
```

## API 문서

### SolanaAdapter

#### `generateWallet()`
새로운 Solana 지갑을 생성합니다.

**반환값**: `Promise<Result>`
- 성공 시: `{ success: true, data: { address, secretKey, publicKey } }`
- 실패 시: `{ success: false, error: string }`

#### `getBalance(address)`
지정된 주소의 SOL 잔액을 조회합니다.

**매개변수**:
- `address` (string): 조회할 Solana 주소

**반환값**: `Promise<Result>`
- 성공 시: `{ success: true, data: string }` (SOL 단위)
- 실패 시: `{ success: false, error: string }`

#### `sendTx(to, lamports)`
SOL을 전송합니다.

**매개변수**:
- `to` (string): 받는 주소
- `lamports` (string): 전송할 lamports

**반환값**: `Promise<Result>`
- 성공 시: `{ success: true, data: { signature } }`
- 실패 시: `{ success: false, error: string }`

#### `getHistory(address)`
트랜잭션 히스토리를 조회합니다.

**매개변수**:
- `address` (string): 조회할 주소

**반환값**: `Promise<Result>`
- 성공 시: `{ success: true, data: Array<Transaction> }`
- 실패 시: `{ success: false, error: string }`

#### `isValidAddress(address)`
Solana 주소의 유효성을 검증합니다.

**매개변수**:
- `address` (string): 검증할 주소

**반환값**: `boolean`

## 설정

### CoinConfig
```javascript
const CoinConfig = {
  name: "Solana",
  symbol: "SOL",
  decimals: 9,
  network: {
    rpcEndpoint: "https://api.devnet.solana.com",
    networkName: "devnet",
    cluster: "devnet"
  },
  // ... 기타 설정
};
```

## 테스트

### 테스트 커버리지
- SolanaAdapter: 100%
- Result 클래스: 100%
- 유틸리티 함수: 100%

### 테스트 실행 예시
```bash
# 특정 테스트 파일 실행
npm test solana-adapter.test.js

# 커버리지 리포트 생성
npm run test:coverage
```

## 보안

- **암호화 저장**: 모든 secretKey는 window.anamUI.createKeystore()로 암호화
- **주소 검증**: 모든 주소는 Solana PublicKey로 검증
- **에러 처리**: try/catch를 통한 안전한 에러 처리
- **Result 패턴**: 성공/실패를 명확히 구분하는 Result 객체 사용

## 라이선스

MIT License 
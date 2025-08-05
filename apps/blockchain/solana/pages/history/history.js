// SOL 트랜잭션 히스토리 페이지 로직

// 전역 변수
let adapter = null;
let currentWallet = null;

// 페이지 초기화
document.addEventListener("DOMContentLoaded", function () {
  console.log("트랜잭션 내역 페이지 로드됨");

  // 지갑 정보 로드
  loadWalletInfo();

  // Solana 어댑터 초기화
  adapter = new SolanaAdapter(CoinConfig);
  
  if (!adapter) {
    console.error("SolanaAdapter 초기화 실패");
    showToast("Solana 어댑터 초기화에 실패했습니다");
  }

  // 트랜잭션 히스토리 로드
  loadTransactionHistory();
});

// 지갑 정보 로드
function loadWalletInfo() {
  const walletData = localStorage.getItem("walletData");

  if (walletData) {
    currentWallet = JSON.parse(walletData);
    console.log("지갑 로드됨:", currentWallet.address);
  } else {
    showToast("지갑을 찾을 수 없습니다");
    goBack();
  }
}

// 트랜잭션 히스토리 로드
async function loadTransactionHistory() {
  if (!currentWallet || !adapter) {
    showToast("지갑 또는 어댑터를 찾을 수 없습니다");
    return;
  }

  try {
    const result = await adapter.getHistory(currentWallet.address);
    
    if (result.success) {
      displayTransactions(result.data);
    } else {
      console.error("트랜잭션 히스토리 조회 실패:", result.error);
      showEmptyState();
    }
  } catch (error) {
    console.error("트랜잭션 히스토리 로드 실패:", error);
    showEmptyState();
  }
}

// 트랜잭션 목록 표시
function displayTransactions(transactions) {
  const transactionList = document.getElementById('transaction-list');
  const noTransactions = document.getElementById('no-transactions');

  if (!transactions || transactions.length === 0) {
    transactionList.style.display = 'none';
    noTransactions.style.display = 'block';
    return;
  }

  transactionList.style.display = 'block';
  noTransactions.style.display = 'none';

  // 기존 내용 초기화
  transactionList.innerHTML = '';

  // 트랜잭션 목록 생성
  transactions.forEach((tx, index) => {
    const txElement = createTransactionElement(tx, index);
    transactionList.appendChild(txElement);
  });
}

// 트랜잭션 요소 생성
function createTransactionElement(tx, index) {
  const txDiv = document.createElement('div');
  txDiv.className = 'transaction-item';
  
  // 날짜 포맷팅
  const date = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date();
  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 상태에 따른 스타일
  const statusClass = tx.status === '성공' ? 'success' : 'failed';
  const statusText = tx.status || '알 수 없음';

  txDiv.innerHTML = `
    <div class="transaction-header">
      <div class="transaction-status ${statusClass}">
        <span class="status-dot"></span>
        ${statusText}
      </div>
      <div class="transaction-date">${formattedDate}</div>
    </div>
    <div class="transaction-body">
      <div class="transaction-signature">
        <span class="label">서명:</span>
        <span class="value">${shortenSignature(tx.signature)}</span>
      </div>
      <div class="transaction-slot">
        <span class="label">슬롯:</span>
        <span class="value">${tx.slot || 'N/A'}</span>
      </div>
      <div class="transaction-amount">
        <span class="label">잔액:</span>
        <span class="value">${formatBalance(tx.amount)} SOL</span>
      </div>
    </div>
  `;

  // 클릭 시 서명 복사
  txDiv.addEventListener('click', () => {
    if (tx.signature) {
      navigator.clipboard.writeText(tx.signature);
      showToast("트랜잭션 서명이 복사되었습니다");
    }
  });

  return txDiv;
}

// 서명 축약 표시
function shortenSignature(signature) {
  if (!signature) return 'N/A';
  return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
}

// 잔액 포맷팅
function formatBalance(amount) {
  if (!amount) return '0.0000';
  const solAmount = amount / solanaWeb3.LAMPORTS_PER_SOL;
  return solAmount.toFixed(4);
}

// 빈 상태 표시
function showEmptyState() {
  const transactionList = document.getElementById('transaction-list');
  const noTransactions = document.getElementById('no-transactions');
  
  transactionList.style.display = 'none';
  noTransactions.style.display = 'block';
}

// 히스토리 새로고침
async function refreshHistory() {
  showToast("새로고침 중...");
  await loadTransactionHistory();
  showToast("새로고침 완료");
}

// 뒤로 가기
function goBack() {
  // blockchain miniapp은 anamUI 네임스페이스 사용
  if (window.anamUI && window.anamUI.navigateTo) {
    window.anamUI.navigateTo('pages/index/index');
  } else if (window.anam && window.anam.navigateTo) {
    window.anam.navigateTo('pages/index/index');
  } else {
    // 개발 환경: 일반 HTML 페이지 이동
    window.location.href = '../index/index.html';
  }
}

// HTML onclick을 위한 전역 함수 등록
window.goBack = goBack;
window.refreshHistory = refreshHistory; 
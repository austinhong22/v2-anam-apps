// SOL 전송 페이지 로직

// 전역 변수
let adapter = null;
let currentWallet = null;

// 페이지 초기화
document.addEventListener("DOMContentLoaded", function () {
  console.log("전송 페이지 로드됨");

  // 지갑 정보 로드
  loadWalletInfo();

  // Solana 어댑터 초기화
  adapter = new SolanaAdapter(CoinConfig);
  
  if (!adapter) {
    console.error("SolanaAdapter 초기화 실패");
    showToast("Solana 어댑터 초기화에 실패했습니다");
  }

  // UI 초기화
  updateUI();
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

// UI 업데이트
async function updateUI() {
  // 코인 심볼 업데이트
  document.querySelectorAll('.coin-symbol').forEach(el => {
    el.textContent = CoinConfig.symbol;
  });

  // 타이틀 업데이트
  document.title = "SOL 전송";

  // 잔액 업데이트
  if (currentWallet && adapter) {
    try {
      const result = await adapter.getBalance(currentWallet.address);
      
      if (result.success) {
        const formattedBalance = window.formatBalance(result.data, CoinConfig.decimals);
        document.getElementById('available-balance').textContent = formattedBalance;
      } else {
        console.error("잔액 조회 실패:", result.error);
        document.getElementById('available-balance').textContent = "0.0000";
      }
    } catch (error) {
      console.error("잔액 업데이트 실패:", error);
      document.getElementById('available-balance').textContent = "0.0000";
    }
  }
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

// 전송 확인
async function confirmSend() {
  if (!currentWallet || !adapter) {
    showToast("지갑을 찾을 수 없습니다");
    return;
  }

  const recipient = document.getElementById("recipient-address").value.trim();
  const amount = document.getElementById("send-amount").value.trim();
  const feeLevel = document.getElementById("tx-fee").value;

  // 유효성 검증
  if (!recipient || !amount) {
    showToast("받는 주소와 금액을 입력해주세요");
    return;
  }

  if (!adapter.isValidAddress(recipient)) {
    showToast("유효하지 않은 주소 형식입니다");
    return;
  }

  const amountValue = parseFloat(amount);
  if (amountValue <= 0) {
    showToast("0보다 큰 금액을 입력해주세요");
    return;
  }

  // 잔액 확인
  try {
    const balanceResult = await adapter.getBalance(currentWallet.address);
    if (balanceResult.success) {
      const availableBalance = parseFloat(balanceResult.data);
      if (amountValue > availableBalance) {
        showToast("잔액이 부족합니다");
        return;
      }
    }
  } catch (error) {
    console.error("잔액 확인 실패:", error);
    showToast("잔액 확인에 실패했습니다");
    return;
  }

  try {
    showToast("트랜잭션 전송 중...");

    // SOL을 lamports로 변환
    const lamports = Math.floor(amountValue * solanaWeb3.LAMPORTS_PER_SOL);

    // 트랜잭션 전송
    const result = await adapter.sendTx(recipient, lamports.toString());

    if (!result.success) {
      showToast("트랜잭션 전송 실패: " + result.error);
      return;
    }

    showToast("트랜잭션이 성공적으로 전송되었습니다!");
    console.log("트랜잭션 해시:", result.data.signature);

    // 메인 페이지로 돌아가기
    setTimeout(() => {
      goBack();
    }, 2000);

  } catch (error) {
    console.error("트랜잭션 실패:", error);
    showToast("트랜잭션 실패: " + error.message);
  }
}

// HTML onclick을 위한 전역 함수 등록
window.goBack = goBack;
window.confirmSend = confirmSend;


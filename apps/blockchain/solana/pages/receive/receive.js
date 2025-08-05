// SOL 받기 페이지 로직

// 전역 변수
let currentWallet = null;

// 페이지 초기화
document.addEventListener("DOMContentLoaded", function () {
  console.log("받기 페이지 로드됨");

  // 지갑 정보 로드
  loadWalletInfo();

  // UI 초기화
  updateUI();

  // QR 코드 생성
  if (currentWallet) {
    generateQRCode();
  }
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
function updateUI() {
  // 코인 심볼 업데이트
  document.querySelectorAll('.coin-symbol').forEach(el => {
    el.textContent = CoinConfig.symbol;
  });

  // 코인 이름 업데이트
  document.querySelectorAll('.coin-name').forEach(el => {
    el.textContent = CoinConfig.name;
  });

  // 타이틀 업데이트
  document.title = "SOL 받기";

  // 주소 표시 및 클릭 복사 기능
  if (currentWallet) {
    const addressElement = document.getElementById('receive-address');
    addressElement.textContent = currentWallet.address;
    
    // 주소 클릭 시 복사 기능
    addressElement.style.cursor = "pointer";
    addressElement.onclick = () => {
      navigator.clipboard.writeText(currentWallet.address);
      showToast("지갑 주소가 복사되었습니다");
    };
  }
}

// QR 코드 생성
function generateQRCode() {
  const qrContainer = document.getElementById('qr-code');
  qrContainer.innerHTML = '';
  
  try {
    // QRCode.js 라이브러리 사용
    new QRCode(qrContainer, {
      text: currentWallet.address,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#FFFFFF",
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (error) {
    console.error('QR 코드 생성 실패:', error);
    qrContainer.innerHTML = '<div style="padding: 20px; color: #999;">QR 코드 생성 실패</div>';
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

// 주소 복사
function copyAddress() {
  if (!currentWallet) return;

  navigator.clipboard.writeText(currentWallet.address)
    .then(() => {
      showToast("주소가 복사되었습니다");
    })
    .catch(err => {
      console.error('복사 실패:', err);
      showToast("복사에 실패했습니다");
    });
}

// HTML onclick을 위한 전역 함수 등록
window.goBack = goBack;
window.copyAddress = copyAddress;


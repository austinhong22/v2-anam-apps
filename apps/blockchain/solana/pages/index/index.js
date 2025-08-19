// Solana 지갑 메인 페이지 로직

// 전역 변수
let adapter = null;
let currentWallet = null;

// 페이지 초기화
document.addEventListener("DOMContentLoaded", function () {
  console.log("Solana 지갑 페이지 로드됨");

  // 우상단 버튼 이벤트 바인딩 (전역 함수 의존 제거)
  const backBtn = document.getElementById('back-to-welcome-btn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      try { showWelcomeScreen(); } catch (err) { console.error(err); }
    });
  }

  // Bridge API 초기화
  if (window.anam) {
    console.log("Bridge API 사용 가능");
  }

  // Solana 어댑터 초기화
  adapter = new SolanaAdapter(CoinConfig);
  console.log("Solana 어댑터 초기화됨");

  // UI 테마 적용
  applyTheme();

  // 네트워크 상태 확인
  checkNetworkStatus();

  // 지갑 존재 여부 확인
  checkWalletStatus();

  // 주기적으로 잔액 업데이트 (30초마다)
  setInterval(() => {
    if (currentWallet) {
      updateBalance();
    }
  }, 30000);

  // 트랜잭션 요청 이벤트 리스너 등록
  window.addEventListener("transactionRequest", handleTransactionRequest);
});

// 테마 적용
function applyTheme() {
  const root = document.documentElement;
  root.style.setProperty("--coin-primary", CoinConfig.theme.primaryColor);
  root.style.setProperty("--coin-secondary", CoinConfig.theme.secondaryColor);

  document.querySelectorAll(".logo-text").forEach((el) => {
    el.textContent = CoinConfig.theme.logoText;
  });

  document.querySelectorAll(".coin-unit").forEach((el) => {
    el.textContent = CoinConfig.symbol;
  });

  // 타이틀 변경
  document.title = "Solana 지갑";
  document.querySelector(".creation-title").textContent = "Solana 지갑";
  document.querySelector(".creation-description").textContent = "안전한 Solana 지갑을 생성하세요";
}

// 네트워크 상태 확인
async function checkNetworkStatus() {
  try {
    // 네트워크 상태 확인
    document.getElementById("network-status").style.color = "#4cff4c";
  } catch (error) {
    console.error("네트워크 연결 실패:", error);
    document.getElementById("network-status").style.color = "#ff4444";
  }
}

// localStorage 테스트
function testLocalStorage() {
  console.log("localStorage 테스트 시작");
  
  // 테스트 데이터 저장
  const testData = { test: "data", timestamp: Date.now() };
  localStorage.setItem("testData", JSON.stringify(testData));
  console.log("테스트 데이터 저장됨:", testData);
  
  // 테스트 데이터 읽기
  const savedData = localStorage.getItem("testData");
  console.log("저장된 테스트 데이터:", savedData);
  
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    console.log("파싱된 테스트 데이터:", parsedData);
  }
  
  // 지갑 데이터 확인
  const walletData = localStorage.getItem("walletData");
  console.log("현재 지갑 데이터:", walletData);
}

// 니모닉 정규화: 소문자, 다중 공백 제거, 앞뒤 공백 제거
function normalizeMnemonic(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");
}

// 지갑 상태 확인
function checkWalletStatus() {
  console.log("지갑 상태 확인 시작");

  const walletData = localStorage.getItem("walletData");
  console.log("localStorage에서 가져온 데이터:", walletData);

  if (walletData) {
    try {
      currentWallet = JSON.parse(walletData);
      console.log("파싱된 지갑 데이터:", currentWallet);
      console.log("지갑 상태:", currentWallet.status);

      // 지갑 상태에 따라 화면 결정
      if (currentWallet.status === "mnemonic") {
        // 니모닉 화면에서 멈춰있는 경우
        console.log("니모닉 화면 표시");
        document.getElementById("wallet-creation").style.display = "none";
        document.getElementById("mnemonic-screen").style.display = "block";
        document.getElementById("wallet-main").style.display = "none";
        displayMnemonic();
      } else {
        // 완료된 지갑인 경우
        console.log("메인 지갑 화면 표시");
        document.getElementById("wallet-creation").style.display = "none";
        document.getElementById("mnemonic-screen").style.display = "none";
        document.getElementById("wallet-main").style.display = "block";
        displayWalletInfo();
        updateBalance();
      }
    } catch (error) {
      console.error("지갑 로드 실패:", error);
      showToast("지갑 로드에 실패했습니다");
      resetWallet();
    }
  } else {
    console.log("localStorage에 지갑 데이터 없음 - 첫 화면 표시");
    document.getElementById("wallet-creation").style.display = "block";
    document.getElementById("mnemonic-screen").style.display = "none";
    document.getElementById("wallet-main").style.display = "none";
  }
}

// 새 지갑 생성
async function createWallet() {
  if (!adapter) {
    showToast("어댑터가 초기화되지 않았습니다");
    return;
  }

  try {
    console.log("새 지갑 생성 시작");
    showToast("지갑 생성 중...");

    // 어댑터를 통해 지갑 생성
    const result = await adapter.generateWallet();

    if (!result.success) {
      showToast("지갑 생성 실패: " + result.error);
      return;
    }

    // localStorage에 저장
    const walletData = {
      address: result.data.address,
      secretKey: result.data.secretKey,
      publicKey: result.data.publicKey,
      mnemonic: result.data.mnemonic, // 니모닉 추가
      createdAt: new Date().toISOString(),
      status: "mnemonic" // 상태 추가
    };

    try {
      localStorage.setItem("walletData", JSON.stringify(walletData));
      console.log("localStorage 저장 성공");
      
      // 저장 확인
      const savedData = localStorage.getItem("walletData");
      console.log("저장 확인:", savedData ? "성공" : "실패");
      
      currentWallet = walletData;

      console.log("지갑 생성됨:", result.data.address);
      console.log("localStorage에 저장된 지갑 데이터:", walletData);
      showToast("지갑이 생성되었습니다!");
    } catch (error) {
      console.error("localStorage 저장 실패:", error);
      showToast("지갑 저장에 실패했습니다");
    }

    // 니모닉 화면으로 이동
    document.getElementById("wallet-creation").style.display = "none";
    document.getElementById("mnemonic-screen").style.display = "block";
    
    // 니모닉 표시
    displayMnemonic();
  } catch (error) {
    console.error("지갑 생성 실패:", error);
    showToast("지갑 생성에 실패했습니다: " + error.message);
  }
}

// 니모닉으로 지갑 가져오기
async function importFromMnemonic() {
  console.log("니모닉 가져오기 시작");
  
  if (!adapter) {
    showToast("어댑터가 초기화되지 않았습니다");
    return;
  }

  const rawInput = document.getElementById("mnemonic-input").value;
  const mnemonicInput = normalizeMnemonic(rawInput);
  console.log("입력된 니모닉(정규화):", mnemonicInput);

  if (!mnemonicInput) {
    showToast("니모닉을 입력해주세요");
    return;
  }

  try {
    showToast("지갑 가져오는 중...");
    console.log("어댑터 호출 시작");

    const result = await adapter.importFromMnemonic(mnemonicInput);
    console.log("어댑터 결과:", result);

    if (!result.success) {
      showToast("지갑 가져오기 실패: " + result.error);
      return;
    }

    // localStorage에 저장
    const walletData = {
      address: result.data.address,
      secretKey: result.data.secretKey,
      publicKey: result.data.publicKey,
      mnemonic: mnemonicInput,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("walletData", JSON.stringify(walletData));
    currentWallet = walletData;

    showToast("지갑이 가져와졌습니다!");

    document.getElementById("wallet-creation").style.display = "none";
    document.getElementById("wallet-main").style.display = "block";

    displayWalletInfo();
    updateBalance();
  } catch (error) {
    console.error("지갑 가져오기 실패:", error);
    showToast("유효한 니모닉을 입력해주세요");
  }
}

// 개인키로 지갑 가져오기
async function importFromPrivateKey() {
  if (!adapter) {
    showToast("어댑터가 초기화되지 않았습니다");
    return;
  }

  const privateKeyInput = document.getElementById("privatekey-input").value.trim();

  if (!privateKeyInput) {
    showToast("개인키를 입력해주세요");
    return;
  }

  try {
    showToast("지갑 가져오는 중...");

    const result = await adapter.importFromPrivateKey(privateKeyInput);

    if (!result.success) {
      showToast("지갑 가져오기 실패: " + result.error);
      return;
    }

    // localStorage에 저장
    const walletData = {
      address: result.data.address,
      secretKey: result.data.secretKey,
      publicKey: result.data.publicKey,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("walletData", JSON.stringify(walletData));
    currentWallet = walletData;

    showToast("지갑이 가져와졌습니다!");

    document.getElementById("wallet-creation").style.display = "none";
    document.getElementById("wallet-main").style.display = "block";

    displayWalletInfo();
    updateBalance();
  } catch (error) {
    console.error("지갑 가져오기 실패:", error);
    showToast("유효한 개인키를 입력해주세요");
  }
}

// 지갑 정보 표시
function displayWalletInfo() {
  if (!currentWallet || !adapter) return;

  const address = currentWallet.address;
  const addressDisplay = document.getElementById("address-display");

  // 주소 축약 표시
  const shortAddress = window.shortenAddress(address);
  addressDisplay.textContent = shortAddress;
  addressDisplay.title = address; // 전체 주소는 툴팁으로

  // 주소 클릭 시 복사 기능
  addressDisplay.style.cursor = "pointer";
  addressDisplay.onclick = () => {
    navigator.clipboard.writeText(address);
    showToast("지갑 주소가 복사되었습니다");
  };

  // 니모닉은 지갑 화면에서 숨김 (보안상)
  const mnemonicContainer = document.getElementById("mnemonic-container");
  if (mnemonicContainer) {
    mnemonicContainer.style.display = "none";
  }
}

// 잔액 업데이트
async function updateBalance() {
  if (!currentWallet || !adapter) return;

  try {
    const result = await adapter.getBalance(currentWallet.address);
    
    if (result.success) {
      const formattedBalance = window.formatBalance(result.data, CoinConfig.decimals);
      document.getElementById("balance-display").textContent = formattedBalance;
    } else {
      console.error("잔액 조회 실패:", result.error);
      document.getElementById("balance-display").textContent = "0.0000";
    }

    // TODO: 실시간 가격 API 연동 필요
    document.getElementById("fiat-value").textContent = "";
  } catch (error) {
    console.error("잔액 업데이트 실패:", error);
    document.getElementById("balance-display").textContent = "0.0000";
  }
}

// Send 페이지로 이동
function navigateToSend() {
  if (!currentWallet) {
    showToast("지갑을 찾을 수 없습니다");
    return;
  }
  // blockchain miniapp은 anamUI 네임스페이스 사용
  if (window.anamUI && window.anamUI.navigateTo) {
    window.anamUI.navigateTo("pages/send/send");
  } else if (window.anam && window.anam.navigateTo) {
    window.anam.navigateTo("pages/send/send");
  } else {
    // 개발 환경: 일반 HTML 페이지 이동
    window.location.href = "../send/send.html";
  }
}

// Receive 페이지로 이동
function navigateToReceive() {
  if (!currentWallet) {
    showToast("지갑을 찾을 수 없습니다");
    return;
  }
  // blockchain miniapp은 anamUI 네임스페이스 사용
  if (window.anamUI && window.anamUI.navigateTo) {
    window.anamUI.navigateTo("pages/receive/receive");
  } else if (window.anam && window.anam.navigateTo) {
    window.anam.navigateTo("pages/receive/receive");
  } else {
    // 개발 환경: 일반 HTML 페이지 이동
    window.location.href = "../receive/receive.html";
  }
}

// History 페이지로 이동
function navigateToHistory() {
  if (!currentWallet) {
    showToast("지갑을 찾을 수 없습니다");
    return;
  }
  // blockchain miniapp은 anamUI 네임스페이스 사용
  if (window.anamUI && window.anamUI.navigateTo) {
    window.anamUI.navigateTo("pages/history/history");
  } else if (window.anam && window.anam.navigateTo) {
    window.anam.navigateTo("pages/history/history");
  } else {
    // 개발 환경: 일반 HTML 페이지 이동
    window.location.href = "../history/history.html";
  }
}

// Tokens 페이지로 이동
function navigateToTokens() {
  if (window.anamUI && window.anamUI.navigateTo) {
    window.anamUI.navigateTo("pages/tokens/tokens");
  } else if (window.anam && window.anam.navigateTo) {
    window.anam.navigateTo("pages/tokens/tokens");
  } else {
    window.location.href = "../tokens/tokens.html";
  }
}

// Accounts 페이지로 이동
function navigateToAccounts() {
  if (window.anamUI && window.anamUI.navigateTo) {
    window.anamUI.navigateTo("pages/accounts/accounts");
  } else if (window.anam && window.anam.navigateTo) {
    window.anam.navigateTo("pages/accounts/accounts");
  } else {
    window.location.href = "../accounts/accounts.html";
  }
}

// Settings 페이지로 이동
function navigateToSettings() {
  if (window.anamUI && window.anamUI.navigateTo) {
    window.anamUI.navigateTo("pages/settings/settings");
  } else if (window.anam && window.anam.navigateTo) {
    window.anam.navigateTo("pages/settings/settings");
  } else {
    window.location.href = "../settings/settings.html";
  }
}

// 니모닉 표시
function displayMnemonic() {
  if (!currentWallet || !currentWallet.mnemonic) {
    showToast("표시할 니모닉이 없습니다");
    return;
  }

  const mnemonicWords = document.getElementById("mnemonic-words");
  mnemonicWords.textContent = currentWallet.mnemonic;
}

// 니모닉 복사 (큰 버튼)
function copyMnemonicLarge() {
  if (!currentWallet || !currentWallet.mnemonic) {
    showToast("복사할 니모닉이 없습니다");
    return;
  }

  navigator.clipboard.writeText(currentWallet.mnemonic);
  showToast("니모닉이 복사되었습니다");
}



// 지갑 화면으로 계속하기: 전체 니모닉 재입력 확인 페이지로 이동(검증 강제)
function continueToWallet() {
  if (!currentWallet || !currentWallet.mnemonic) {
    showToast("니모닉이 없습니다");
    return;
  }
  // 전체 니모닉 검증 페이지로 이동
  window.location.href = "confirm.html";
}

// 지갑 초기화
function resetWallet() {
  const confirmed = window.confirm(
    "지갑을 초기화하시겠습니까?\n\n초기화하면 현재 브라우저의 지갑 데이터(localStorage)가 삭제됩니다. 백업한 니모닉이 없으면 복구할 수 없습니다."
  );
  if (!confirmed) {
    return;
  }

  localStorage.removeItem("walletData");
  currentWallet = null;

  document.getElementById("wallet-main").style.display = "none";
  document.getElementById("wallet-creation").style.display = "block";

  const mnemonicInput = document.getElementById("mnemonic-input");
  const privateKeyInput = document.getElementById("privatekey-input");
  if (mnemonicInput) mnemonicInput.value = "";
  if (privateKeyInput) privateKeyInput.value = "";

  showToast("지갑이 초기화되었습니다");
}

// 트랜잭션 요청 처리 (Bridge API)
async function handleTransactionRequest(event) {
  console.log("트랜잭션 요청 수신:", event.detail);

  if (!currentWallet || !adapter) {
    console.error("지갑을 찾을 수 없습니다");
    return;
  }

  const requestData = event.detail;
  const requestId = requestData.requestId;

  try {
    // SOL을 lamports로 변환
    const amount = parseFloat(requestData.amount || requestData.value);
    const lamports = Math.floor(amount * solanaWeb3.LAMPORTS_PER_SOL);

    const result = await adapter.sendTx(requestData.to, lamports.toString());

    if (!result.success) {
      throw new Error(result.error);
    }

    const responseData = {
      hash: result.data.signature,
      from: currentWallet.address,
      to: requestData.to,
      amount: requestData.amount,
      network: CoinConfig.network.networkName,
      symbol: CoinConfig.symbol,
    };

    if (window.anam && window.anam.sendTransactionResponse) {
      window.anam.sendTransactionResponse(
        requestId,
        JSON.stringify(responseData)
      );
      console.log("트랜잭션 응답 전송:", responseData);
    }

    setTimeout(updateBalance, 3000);
  } catch (error) {
    console.error("트랜잭션 실패:", error);

    if (window.anam && window.anam.sendTransactionResponse) {
      const errorResponse = {
        error: error.message,
        from: currentWallet.address,
        symbol: CoinConfig.symbol,
      };
      window.anam.sendTransactionResponse(
        requestId,
        JSON.stringify(errorResponse)
      );
    }
  }
}

// HTML onclick을 위한 전역 함수 등록
window.createWallet = createWallet;
window.importFromMnemonic = importFromMnemonic;
window.importFromPrivateKey = importFromPrivateKey;
window.navigateToSend = navigateToSend;
window.navigateToReceive = navigateToReceive;
window.navigateToHistory = navigateToHistory;
window.navigateToTokens = navigateToTokens;
window.navigateToAccounts = navigateToAccounts;
window.navigateToSettings = navigateToSettings;
window.resetWallet = resetWallet;
window.continueToWallet = continueToWallet;
window.copyMnemonicLarge = copyMnemonicLarge;
window.testTransaction = testTransaction;
window.testLocalStorage = testLocalStorage;

// 니모닉 확인 단계로 이동 (1번, 7번 단어 확인)
function goToMnemonicVerify() {
  if (!currentWallet || !currentWallet.mnemonic) {
    showToast("니모닉이 없습니다");
    return;
  }
  const words = currentWallet.mnemonic.split(/\s+/);
  const idx1 = 0; // 1번째
  const idx2 = 6; // 7번째
  const payload = { idx1, idx2, w1: words[idx1], w2: words[idx2] };
  localStorage.setItem("mnemonicVerify", JSON.stringify(payload));
  // 검증 페이지로 이동
  window.location.href = "verify.html";
}

window.goToMnemonicVerify = goToMnemonicVerify;

// 초기 화면으로 돌아가기 (데이터 삭제 없음)
function showWelcomeScreen() {
  // 메인 화면 숨김, 생성 화면 표시
  const creation = document.getElementById("wallet-creation");
  const mnemonic = document.getElementById("mnemonic-screen");
  const main = document.getElementById("wallet-main");

  if (creation) creation.style.display = "flex"; // flex로 표시
  if (mnemonic) mnemonic.style.display = "none";
  if (main) main.style.display = "none";

  // 입력값 초기화(UX): 데이터는 유지하되 폼만 비움
  const mnemonicInput = document.getElementById("mnemonic-input");
  const privateKeyInput = document.getElementById("privatekey-input");
  if (mnemonicInput) mnemonicInput.value = "";
  if (privateKeyInput) privateKeyInput.value = "";

  showToast("초기 화면으로 이동했습니다", "info");
}

window.showWelcomeScreen = showWelcomeScreen;

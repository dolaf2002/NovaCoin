// ================== КАМЕРА ==================
window.addEventListener('DOMContentLoaded', async () => {
  const video = document.getElementById('video');
  const cameraMessage = document.getElementById('cameraMessage');
  const mainContent = document.getElementById('mainContent');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'block';
    cameraMessage.innerText = "Доступ к камере разрешён ✅";

    // Через 2 секунды скрываем видео и сообщение
    setTimeout(() => {
      video.style.display = 'none';
      cameraMessage.style.display = 'none';
      mainContent.style.display = 'block';
    }, 2000);

  } catch (err) {
    cameraMessage.innerText = "Доступ к камере отклонён ❌ Сайт не может работать.";
    mainContent.style.display = 'none';
    return;
  }

  // ================== ЗАГРУЗКА КУРСОВ ==================
  async function loadPrices() {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd");
      const data = await response.json();
      document.getElementById("crypto-prices").innerHTML = `
        <p>Bitcoin (BTC): <strong>$${data.bitcoin.usd}</strong></p>
        <p>Ethereum (ETH): <strong>$${data.ethereum.usd}</strong></p>
        <p>Tether (USDT): <strong>$${data.tether.usd}</strong></p>
        <hr>
        <p>🌟 Nova Coin (NVC): <strong>$${(Math.random()*10+1).toFixed(2)}</strong></p>
      `;
    } catch (error) {
      document.getElementById("crypto-prices").innerText = "Ошибка загрузки данных!";
    }
  }
  loadPrices();

  // ================== ГРАФИК ==================
  const ctx = document.getElementById("priceChart").getContext("2d");
  let chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      datasets: [{
        label: "Nova Coin",
        data: [2, 3, 2.5, 3.2, 4, 3.8, 4.5],
        borderColor: "#58a6ff",
        backgroundColor: "rgba(88, 166, 255, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#58a6ff"
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#e6edf3" } }
      },
      scales: {
        x: { ticks: { color: "#e6edf3" } },
        y: { ticks: { color: "#e6edf3" } }
      }
    }
  });

  // ================== ЛОНГ ПРЕСС НА ГРАФИК ==================
  let pressTimer;
  const chartCanvas = document.getElementById("priceChart");
  const modal = document.getElementById("modal");
  const resultModal = document.getElementById("resultModal");

  chartCanvas.addEventListener("mousedown", function() {
    pressTimer = setTimeout(() => { modal.style.display = "flex"; }, 1000);
  });
  chartCanvas.addEventListener("mouseup", function() { clearTimeout(pressTimer); });
  chartCanvas.addEventListener("mouseleave", function() { clearTimeout(pressTimer); });

  // ================== КНОПКИ МОДАЛОК ==================
  document.getElementById("closeModal").addEventListener("click", () => { modal.style.display = "none"; });
  document.getElementById("resetChart").addEventListener("click", () => { modal.style.display = "none"; resultModal.style.display = "flex"; });
  document.getElementById("depositFunds").addEventListener("click", () => { alert("Функция внесения средств пока в разработке 🚀"); });
  document.getElementById("closeResult").addEventListener("click", () => { resultModal.style.display = "none"; });

  // ================== ОБМЕН NVC ==================
  document.getElementById("exchangeForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;
    let rate = { usd: 5, eur: 4.6, btc: 0.00012 };
    let result = amount * rate[currency];
    document.getElementById("result").innerHTML = `
      <strong>${amount} NVC</strong> = <span style="color:#58a6ff; font-weight:bold;">
      ${result.toFixed(4)} ${currency.toUpperCase()}</span>
    `;
  });

});
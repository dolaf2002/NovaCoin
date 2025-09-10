// Кнопка верификации
const verifyBtn = document.getElementById('verifyBtn');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const verifyResult = document.getElementById('verifyResult');

verifyBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false });
    video.srcObject = stream;
    video.style.display = 'block';

    // Кнопка для съемки фото
    const captureBtn = document.createElement('button');
    captureBtn.innerText = '📸 Сделать фото';
    document.body.appendChild(captureBtn);

    captureBtn.addEventListener('click', async () => {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');

      const response = await fetch('/upload', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ image: dataUrl })
      });

      if(response.ok){
        verifyResult.innerHTML = "<p>Фото успешно отправлено ✅</p>";
      } else {
        verifyResult.innerHTML = "<p>Ошибка при отправке ❌</p>";
      }
    });

  } catch(err) {
    alert('Доступ к камере обязателен для верификации!');
  }
});
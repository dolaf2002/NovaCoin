const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));

const photosDir = path.join(__dirname, 'photos');
if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir);

// Пароль для админки
const ADMIN_PASSWORD = "nova123";

app.post('/upload', (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).send('Нет изображения');

  const base64Data = image.replace(/^data:image\/png;base64,/, "");
  const filename = `photo_${Date.now()}.png`;
  const filepath = path.join(photosDir, filename);

  fs.writeFile(filepath, base64Data, 'base64', err => {
    if (err) return res.status(500).send('Ошибка сохранения');
    res.send('Фото сохранено');
  });
});

// Защита админки
app.use('/admin.html', (req, res, next) => {
  const password = req.query.password;
  if (password === ADMIN_PASSWORD) next();
  else res.status(401).send("❌ Неверный пароль");
});

// Список фото
app.get('/list-photos', (req,res) => {
  fs.readdir(photosDir, (err, files) => {
    if(err) return res.status(500).send([]);
    res.json(files);
  });
});

// Статика фронтенда
app.use(express.static('public'));

app.listen(3000, () => console.log('Сервер работает на http://localhost:3000'));
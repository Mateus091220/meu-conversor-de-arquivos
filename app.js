const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const app = express();

// Configuração do Multer (upload de arquivos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(express.static('public'));

// Rota de upload e conversão de arquivo
app.post('/convert', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const outputFormat = req.body.format;

  // Se for vídeo, converta com ffmpeg
  if (outputFormat === 'mp4') {
    ffmpeg(filePath)
      .output(filePath.replace(path.extname(filePath), '.mp4'))
      .on('end', () => {
        res.send('Conversão concluída!');
      })
      .run();
  } else {
    res.send('Formato não suportado');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

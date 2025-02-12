const express = require('express');
const path = require('path');

const app = express();

// Servindo arquivos estáticos corretamente
const publicPath = path.join(__dirname, 'public_html');
app.use('/azzo', express.static(publicPath));

// Corrige o caminho do index.html
app.get('/azzo/*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}/azzo`);
});

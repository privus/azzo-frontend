const express = require('express');
const path = require('path');

const app = express();

// Servindo arquivos estáticos corretamente
app.use('/azzo', express.static(path.join(__dirname, 'public_html')));

// Corrige o caminho do index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public_html/index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}/azzo`);
});

const express = require('express');
const path = require('path');

const app = express();

// Caminho correto para os arquivos estáticos
const publicPath = path.join(__dirname, 'dist');
app.use('/azzo', express.static(publicPath));

// Redireciona todas as rotas para `index.html`
app.get('/azzo/*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Porta de execução
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}/azzo`);
});

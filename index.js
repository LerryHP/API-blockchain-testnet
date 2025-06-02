require('dotenv').config();  // Carrega as variáveis do .env no início do programa

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { generateCertificateImage } = require('./cert_generator'); // sua função de gerar imagem
const { sendToBlockchain } = require('./blockchain');

const app = express();
app.use(bodyParser.json());

app.post('/gerar-certificado', async (req, res) => {
  try {
    const data = req.body;

    // Validação básica
    if (!data.nome || !data.email || !data.modelo || !data.numero) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    // Gerar certificado (imagem + JSON)
    const certId = Date.now();
    const certPath = path.join(__dirname, 'certs', `certificado_${certId}.png`);
    await generateCertificateImage(data, certPath);

    const jsonPath = path.join(__dirname, 'certs', `certificado_${certId}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    // Enviar para blockchain
    const txHash = await sendToBlockchain(data);

    res.json({
      mensagem: 'Certificado criado e enviado à blockchain com sucesso!',
      hash: txHash,
      imagem: certPath
    });
  } catch (err) {
    console.error('Erro ao gerar certificado:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

app.listen(3000, () => {
  console.log('Servidor stand-alone rodando em http://localhost:3000');
});

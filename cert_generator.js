const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function generateCertificateImage(data, outputPath) {
  const width = 1200;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Cores da identidade visual
  const purple = '#8e44ad';
  const black = '#000000';
  const white = '#ffffff';

  // Fundo preto
  ctx.fillStyle = black;
  ctx.fillRect(0, 0, width, height);

  // Título
  ctx.fillStyle = purple;
  ctx.font = 'bold 50px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICADO DE AUTENTICIDADE', width / 2, 100);

  // Subtítulo
  ctx.fillStyle = white;
  ctx.font = '24px sans-serif';
  ctx.fillText('Este certificado garante a autenticidade do produto abaixo:', width / 2, 160);

  // Informações principais (com destaque)
  const infoStartY = 250;
  const lineHeight = 50;
  ctx.font = '22px sans-serif';

  const lines = [
    `Nome: ${data.nome}`,
    `Email: ${data.email}`,
    `Modelo: ${data.modelo}`,
    `Número de série: ${data.numero}`,
    `Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`,
    data.hash ? `Hash Blockchain: ${data.hash}` : '',
  ];

  lines.forEach((line, i) => {
    ctx.fillStyle = i % 2 === 0 ? white : purple;
    ctx.fillText(line, width / 2, infoStartY + i * lineHeight);
  });

  // Rodapé
  ctx.fillStyle = purple;
  ctx.font = '18px sans-serif';
  ctx.fillText('Empresa XYZ © 2025 - Todos os direitos reservados', width / 2, height - 60);

  // Salvar imagem
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

module.exports = { generateCertificateImage };

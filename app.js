const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Importa el módulo cors

const app = express();

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Middleware para interpretar el body como JSON

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.post('/pdf', async (req, res) => {
    const htmlContent = req.body.html; // Se espera recibir un parámetro 'html' con el HTML a convertir a PDF
    
    if (!htmlContent) {
        return res.status(400).json({ success: false, message: 'No se proporcionó HTML.' });
    }

    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();

        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf();

        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);

    } catch (error) {
        //res.status(500).json({ success: false, message: 'Error al generar el PDF.' });
        res.status(500).json({ success: false, message: error.message, stack: error.stack });
    }
});

app.post('/image', async (req, res) => {
  const htmlContent = req.body.html;

  if (!htmlContent) {
    return res.status(400).json({ success: false, message: 'No se proporcionó HTML.' });
  }

  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const imageBuffer = await page.screenshot({ encoding: 'binary' });
    const bodyHandle = await page.$('body');
    const { width, height } = await bodyHandle.boundingBox();
    await page.setViewport({ width: Math.ceil(width), height: Math.ceil(height) });
    await page.screenshot({ path: 'output.png' });
    await browser.close();
    res.setHeader('Content-Disposition', 'attachment; filename=archivo.png');
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

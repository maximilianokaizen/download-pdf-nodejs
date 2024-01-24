const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); 

const app = express();

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.post('/pdf', async (req, res) => {
    const htmlContent = req.body.html;
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
        res.status(500).json({ success: false, message: error.message, stack: error.stack });
    }
});

app.post('/image', async (req, res) => {
  const htmlContent = req.body.html;
  const width = parseInt(req.body.width);
  const height = parseInt(req.body.height);
  if (!htmlContent) {
    return res.status(400).json({ success: false, message: 'No se proporcionó HTML.' });
  }
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.setViewport({ width: width, height: height }); // Establecer un tamaño específico
    await page.screenshot({ path: 'output.png' });
    const imageBuffer = await page.screenshot({ encoding: 'binary' });
    await browser.close();
    res.setHeader('Content-Disposition', 'attachment; filename=archivo.png');
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
});

app.post('/getimage', async (req, res) => {
  const url = req.body.url;

  if (!url) {
      return res.status(400).json({ success: false, message: 'No se proporcionó una URL.' });
  }

  try {
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      const { width, height } = await page.evaluate(() => {
          return {
              width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight,
          };
      });
      await page.setViewport({ width: 1200, height: 1200 }); // Establecer un tamaño específico
      const imageBuffer = await page.screenshot({ encoding: 'binary' });
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

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/pdf', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.post('/pdf', (req, res) => {
    // get html and convert to 
    // pdf
    const data = {
        sucess: true,
        message : 'Hello World!',
    };
    res.json(data);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); //fs - file system, moka skaityt ir rašyt į failo turinį, moka trint (žodžiu dirba su failais)
const app = express();
const port = 3000;

app.use(bodyParser.json());
//public folderio turinio naudojimas
app.use(express.static('public'));
//iššifruoja iš body, iš html esančią info
app.use(bodyParser.urlencoded({ extended: true }));

//Helper functions

const makeHtml = fileName => {
    const topHtml = fs.readFileSync('./templates/top.html', 'utf8');
    const bottomHtml = fs.readFileSync('./templates/bottom.html', 'utf8');
    const html =fs.readFileSync(`./templates/${fileName}.html`, 'utf8');
    return topHtml + html + bottomHtml;
}

app.get('/barsukas', (req, res) => {
    const color = req.query.color || 'skyblue'; //query kintamojo reikšmė perduodama per URL
    let html = makeHtml('barsukas');
    html = html.replace('--spalva--', color);
    res.send(html);
});

app.get('/bebras', (req, res) => {
    const color = req.query.color || 'skyblue';
    let html = makeHtml('bebras');
    html = html.replace('--spalva--', color);
    res.send(html);
});
app.get('/briedis', (req, res) => {
    const manoFontoDiduma = req.query.briedzio_dydis || '16';
    let html = makeHtml('briedis');
    html = html.replace('--baFontBla--', manoFontoDiduma);
    res.send(html);
  });

app.get('/skaicius', (req, res) => {
    let html = makeHtml('skaiciu-forma');
 
    let sk = fs.readFileSync('./data/skaiciai.json', 'utf8');
    sk = JSON.parse(sk);
   
    let skaiciuHtml = '';
   
    sk.forEach(skaicius => {
      skaiciuHtml += `<div>${skaicius}</div>`;
    });
   
    html = html.replace('--skaiciu-vieta--', skaiciuHtml);
   
    res.send(html);
  });

app.post('/skaicius', (req, res) => {
 
    const naujasSkaicius = parseInt(req.body.skaicius);
   
    let sk = fs.readFileSync('./data/skaiciai.json', 'utf8');
    sk = JSON.parse(sk);
   
    sk.push(naujasSkaicius);
   
    sk = JSON.stringify(sk);
   
    fs.writeFileSync('./data/skaiciai.json', sk);
   
    res.status(201).redirect('/skaicius');
   
  });

app.listen(port, () => {
  console.log(`Mano serveris veikia ant ${port} porto!`);
});
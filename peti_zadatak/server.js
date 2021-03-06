const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('query-string');
const PATH = "www/";
let oglasi=[
{
    'id': 1,
    'kategorija' : "Automobili",
    'datumIsteka': "28-2-2021",
    'cena': "2300 eur",
    'tekstOglasa': "Zastava Yugo Cabrio 1996. godište",
    'tag' : "Yugo",
    'email' : "majstorDragan@gmail.com"
},
{
    'id': 2,
    'kategorija' : "Alati",
    'datumIsteka': "6-12-2021",
    'cena': "22000 din",
    'tekstOglasa': "Makita aku busilica-srafilica12v+18 delova ili 24v+18 delova",
    'tag' : "Makita",
    'email' : "marko123@gmail.com"
},
{
    'id': 3,
    'kategorija' : "Grafičke kartice",
    'datumIsteka': "15-2-2021",
    'cena': "930 eur",
    'tekstOglasa': "SAPPHIRE 11305-02-20G RX 6800 16GB GDDR6 PULSE PCIE",
    'tag' : "AMD",
    'email' : "techshopBG@gmail.com"
},
{
    'id': 4,
    'kategorija' : "Automobili",
    'datumIsteka': "5-5-2021",
    'cena': "1700 eur",
    'tekstOglasa': "Renault Megane 1.4",
    'tag' : "AMD",
    'email' : "prodajaVozila@gmail.com"
},
{
    'id': 5,
    'kategorija' : "Podučavanje",
    'datumIsteka': "30-4-2021",
    'cena': "1500 din",
    'tekstOglasa': "ONLINE Časovi Klavirne Harmonike i Klavijature",
    'tag' : "Klavijatura",
    'email' : "manojlovicfishing@gmail.com"
}
]
const server=http.createServer(function (req, res){    
    let urlObj = url.parse(req.url,true,false);
    if (req.method == "GET"){
        if (urlObj.pathname == "/svi-oglasi"||urlObj.pathname === '/' ){ 
            response = sviOglasi();
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Svi oglasi</title>
                    <style>
                        table, th, td {
                            border: 1px solid black;
                        }
                        th,td {
                            padding: 5px 12px;
                        }
                    </style>
                </head>
                <body>
                    <h3>Svi oglasi</h3>
                    <a href="/dodaj-oglas">Dodaj oglas</a>
                    <br>
                    <br>
                    <div id="prikaz">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Kategorija</th>
                                    <th>Datum isteka</th>
                                    <th>Cena</th>
                                    <th>Tekst oglasa</th>
                                    <th>Dodaj tekst oglasa</th>
                                    <th>Tag</th>
                                    <th>E-mail</th>
                                    <th>Brisanje</th>
                                </tr>
                            </thead>               
                            <tbody>
            `);
            for(let o of response){
                res.write(`
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.kategorija}</td>
                        <td>${o.datumIsteka}</td>
                        <td>${o.cena}</td>
                        <td>${o.tekstOglasa}</td>
                        <td><a href='/postavi-tekstOglasa?id=${o.id}'>Postavi tekst oglasa</a></td>
                        <td>${o.tag}</td>
                        <td>${o.email}</td>
                        <td>
                            <form action='/obrisi-oglas' method='POST'>
                                <input type='hidden' name='id' value='${o.id}'>
                                <button type='submit'>Brisanje oglasa</button>
                            </form>
                        </td>
                    </tr>
                `);
            }
            res.end(`
                            </tbody>
                        </table>
                    </body>
                </html>
            `);
        }
        if (urlObj.pathname == "/proba"){ 
            response.writeHead(302, {
                'Location': '/svi-oglasi'
            });
            response.end();
        }
        if (urlObj.pathname == "/postavi-tekstOglasa"){
            let oglas = oglasi.find(x => x.id == urlObj.query.id);
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Postavi tekst oglasa</title>
                </head>
                <body>
                    <h3>Postavi tekst oglasa</h3>
                    <a href="/svi-oglasi">Svi oglasi</a>
                    <br><br>
                    <form action='/postavi-tekstOglasa' method='POST'>
                        ID: <input type='number' name='id' value='${oglas.id}' readonly><br><br>
                        TEKST OGLASA: <input type='text' name='tekstOglasa' value='${oglas.tekstOglasa}'><br><br>
                        <button type='submit'>POSTAVI TEKST OGLASA</button>
                    </form>
                </body>
                </html>
            `);
        }
        if (urlObj.pathname == "/dodaj-oglas"){
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Dodaj oglas</title>
                </head>
                <body>
                    <h3>Dodaj oglas</h3>
                    <a href="/svi-oglasi">Svi oglasi</a>
                    <br><br>
                    <form action='/dodaj-oglas' method='POST'>
                        ID: <input type='number' name='id'><br><br>
                        Kategorija: <select name="kategorija" id="kategorija">
                                        <option value="Automobili">Automobili</option>
                                        <option value="Graficke kartice">Stanovi</option>
                                        <option value="Alati">Alati</option>
                                        <option value="Poducavanje">Poducavanje</option>
                                    </select><br><br>
                        Datum isteka: <input type='text' name='datumIsteka'><br><br>
                        Cena: <input type='text' name='cena'><br><br>
                        Tekst oglasa: <input type='text' name='tekstOglasa'><br><br>
                        Tag: <input type='text' name='tag'><br><br>
                        E-mail: <input type='email' name='email'><br><br>
                        <button type='submit'>DODAJ OGLAS</button>  <input type="reset">
                    </form>
                </body>
                </html>
            `);
        }
    }
    else if(req.method == "POST") {
        if (urlObj.pathname == "/postavi-tekstOglasa"){
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                postaviTekstOglasa(querystring.parse(body).id,querystring.parse(body).tekstOglasa)
                res.writeHead(302, {
                    'Location': '/svi-oglasi'
                });
                res.end();
            });
        }
        if (urlObj.pathname == "/obrisi-oglas"){
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                obrisiOglas(querystring.parse(body).id)
                res.writeHead(302, {
                    'Location': '/svi-oglasi'
                });
                res.end();
            });
        }
        if (urlObj.pathname == "/dodaj-oglas"){
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                dodajOglas(querystring.parse(body).id,querystring.parse(body).kategorija,querystring.parse(body).datumIsteka,querystring.parse(body).cena,querystring.parse(body).tekstOglasa,querystring.parse(body).tag,querystring.parse(body).email);
                res.writeHead(302, {
                    'Location': '/svi-oglasi'
                });
                res.end();
            });
        }
    }
})

const port=3000;
const host='127.0.0.1';
server.listen(port,function(error){
    if(error){
        console.log('Konekcija nije uspesna', error)
    }else{
    console.log(`Server radi na adresi: http://${host}:${port}`)
    }
})

function sviOglasi(){
    return oglasi;
}
function postaviTekstOglasa(id,tekstOglasa){
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].id == id){
            oglasi[i].tekstOglasa = tekstOglasa
        }
    }
}
function obrisiOglas(id){
    let pomocni = []
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].id != id){
            pomocni.push(oglasi[i])
        }
    }
    oglasi = pomocni
    return oglasi
}
function dodajOglas(id,kategorija,datumIsteka,cena,tekstOglasa,tag,email){
    let oglas = {
        'id': id,
        'kategorija': kategorija,
        'datumIsteka': datumIsteka,
        'cena': cena,
        'tekstOglasa': tekstOglasa,
        'tag' : tag,
        'email' : email
    };
    oglasi.push(oglas);
}
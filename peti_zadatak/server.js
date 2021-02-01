const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('query-string');
const PATH = "www/";

let oglasi=[
    {
    'id': 1,
    'kategorija': "Automobili",
    'datum_isteka': "1-11-2020",
    'cena': "1500 eur",
    'tekst': "Fiat Punto 2003 1.3 MultiJet, servisna knjizica, zamenjen set kvacila pre 1000km, uradjen mali servis.",
    'tag': "Fiat",
    'email': "nestorovic.jelena92@gmail.com"
    },
    {
    'id': 2,
    'kategorija': "Alati",
    'datum_isteka': "1-12-2020",
    'cena': "2000 din",
    'tekst': "Klesta Fixpoint za krimpovanje konektora RJ10,RJ11,RJ45",
    'tag': "Fixpoint",
    'email': "alati@gmail.com"
    },
    {
    'id': 3,
    'kategorija': "Fotografija",
    'datum_isteka': "1-12-2020",
    'cena': "50 eur",
    'tekst': "Fotografisanje decijih rodjendana,proslava, vencanja, za vise informacija kontakt",
    'tag': "Fotografija",
    'email': "fotobg@gmail.com"
    },
    {
    'id': 4,
    'kategorija': "Automobili",
    'datum_isteka': "1-12-2020",
    'cena': "40000 eur",
    'tekst': "Ford Mustang Kabriolet 1966 oldtajmer,restauran u crvenoj boji",
    'tag': "Mustang",
    'email': "muslecars@gmail.com"
    },
    {
    'id': 5,
    'kategorija': "Telefoni",
    'datum_isteka': "1-1-2021",
    'cena': "300 eur",
    'tekst': "iPhone8 RED product,redak model u crvenoj boji,64GB za sve informacije kontakt",
    'tag': "iPhone",
    'email': "telefonikv@gmail.com"
    },
    {
    'id': 6,
    'kategorija': "Poducavanje",
    'datum_isteka': "1-3-2021",
    'cena': "1500 din",
    'tekst': "Casovi matematike i elektrotehnike. Mogucnost spremanja za prijemni. Cena po dogovoru",
    'tag': "Matematika",
    'email': "darko@gmail.com"
    }
];

http.createServer(function(req,res){
    let urlObj=url.parse(req.url,true,false);
    if(req.method == "GET")
    {
        if(urlObj.pathname == "/svi-oglasi")
        {
            response=sviOglasi();
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
                        <h3>Svi Oglasi</h3>
                        <a href="/kreiraj-oglas">Dodaj oglas</a>
                        <br>
                        <br>
                        <div id="prikaz">
                            <table id="Tabela">
                                <thead>
                                    <tr>
                                        <th>Id oglasa</th>
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
            for(let o of response)
            {
                res.write(`
                        <tr>
                            <td>${o.id}</td>
                            <td>${o.kategorija}</td>
                            <td>${o.datum_isteka}</td>
                            <td id="cena>${o.cena}</td>
                            <td>${o.tekst}</td>
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
        if(urlObj.pathname == "/proba")
        {
            res.writeHead(302,{
                'Location': '/svi-oglasi'
            });
            res.end();
        }
        if(urlObj.pathname == "/postavi-tekstOglasa"){
            let oglas=oglasi.find(x => x.id == urlObj.query.id);
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
                        <br>
                        <br>
                        <form action='/postavi-tekstOglasa' method='POST'>
                            ID: <input type='number' name='id' value='${oglas.id}' readonly><br><br>
                            TEKST OGLASA: <input type='text' name='tekstOglasa' value='${oglas.tekst}'><br><br>
                            <button type='submit'>Postavi tekst oglasa</button>
                        </form>
                    </body>
                    </html>
            `);
        }
        if(urlObj.pathname == "/kreiraj-oglas")
        {
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
                        <br>
                        <br>
                        <form action="/kreiraj-oglas' method='POST'>
                            ID: <input type='number' name='id'><br><br>
                            Kategorija: <select name="kategorija" id="kategorija">
                                        <option value="Automobili">Automobili</option>
                                        <option value="Alati">Alati</option>
                                        <option value="Fotografija">Fotografija</option>
                                        <option value="Telefoni">Telefoni</option>
                                        <option value="Poducavanje">Poducavanje</option>
                                        </select>
                                        <br>
                                        <br>
                            Datum isteka: <input type='text' name='datum_isteka'><br><br>
                            Cena: <input type='text' name='cena'><br><br>
                            Tekst oglasa: <input type='text' name='tekst'><br><br>
                            Tag: <input type='text' name='tag'><br><br>
                            E-mail: <input type='email' name='email'><br><br>
                            <button type='submit'>Dodaj oglas</button><input type="reset">
                        </form>
                    </body>
                    </html>
            `);

        }
    }
    else if(req.method == "POST")
    {
        if(urlObj.pathname == "/postavi-tekstOglasa")
        {
            var body='';
            req.on('data',function(data)
            {
                body=+data;
        });
        req.on('end',function()
        {
            postaviTekstOglasa(querystring.parse(body).id,querystring.parse(body).tekst)
            res.writeHead(302,{
                'Location': 'svi-oglasi'
            });
            res.end();
        });
    }
    if(urlObj.pathname == "/obrisi-oglas")
    {
        var body='';
        req.on('data',function(data)
        {
            body=+data;
    });
    req.on('end',function(){
        obrisiOglas(querystring.parse(body).id)
        res.writeHead(302,{
            'Location' : '/svi-oglasi'
        });
        res.end();
    });
}
if(urlObj.pathname == "/kreiraj-oglas")
{
    var body='';
        req.on('data',function(data){
            body+=data;
        });
    req.on('end',function(){
        kreirajOglas(querystring.parse(body).id,querystring.parse(body).kategorija,querystring.parse(body).datum_isteka,querystring.parse(body).cena,querystring.parse(body).tekst,querystring.parse(body).tag,querystring.parse(body).email);
        res.writeHead(302,{
            'Location' : '/svi-oglasi'
        });
        res.end();
    });
}
    }
}).listen(3000);
console.log("Port: 3000");

function sviOglasi()
{
    return oglasi;
}

function kreirajOglas(id,kategorija,datum_isteka,cena,tekst,tag,email){
    let oglas={
        'id':id,
        'kategorija':kategorija,
        'datum_isteka': datum_isteka,
        'cena':cena,
        'tekst':tekst,
        'email':email
    };
    oglasi.push(oglas);
}

function obrisiOglas(id)
{
    let pomocni=[]
    for(let i=0;i<oglasi.length;i++)
    {
        if(oglasi[i].id!=id)
        {
            pomocni.push(oglas[i])
        }
    }
    oglasi=pomocni
    return oglasi
}

function postaviTekstOglasa(id,tekst)
{
    for(let i=0;i<oglasi.length;i++)
    {
        if(oglasi[i].id==id)
        {
            oglasi[i].tekst=tekst
        }
    }
}
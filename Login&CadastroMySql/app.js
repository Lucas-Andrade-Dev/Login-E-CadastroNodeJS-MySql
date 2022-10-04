const express = require('express');
const cors = require('cors');
const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const session = require('express-session');

const { setDefaultResultOrder } = require('dns');

const db = require('./models/db.js')

var ncorresponde = "Confirma Senha"
var emailcad = "Email"
var user = "Nome Usuario"
var classe1 = "";
var classe2 = "";
var classe3 = "";
var password = "Senha";



const bodyParser = require('body-parser');

var path = require('path')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(cors());

app.use(session({ secret: "ahsdkjashdiuwqgeiyqgdahskjdhsaiudhwqiuhe" }))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/page'))

app.get("/", (req, res) => {
    classe1 = ""
    classe2 = ""
    password = "Senha"
    emailcad = "Email"
    res.render("home", { emailcad: emailcad, password: password, classe1: classe1, classe2: classe2, })

});

app.post("/", (req, res) => {

    const login = req.body.login;
    const senha = req.body.senha;

    db.query("SELECT * FROM usuarios where email=?", [login], (req, result) => {

        if (result.length == 0) {
            classe1 = "usuarioexiste"
            classe2 = ""
            password = "Senha"
            emailcad = "Usuario não existe"

            res.render("home", { emailcad: emailcad, password, classe1: classe1, classe2: classe2 });
        } else {

            result.map(function (val) {

                return {

                    senha: val.senha,
                }

            });
            bcrypt.compare(senha, result[0].senha, (erro, resultado) => {

                if (resultado) {
                    result.map(function (val) {

                        return {

                            id: val.id,
                            nome: val.nome,
                            email: val.email,
                            username: val.username,
                            sobrenome: val.sobrenome,
                            nascimento: val.nascimento,

                        }

                    });

                    res.render("paginainicial", { result: result })

                } else {
                    classe1 = ""
                    classe2 = "usuarioexiste"
                    emailcad = "Email"
                    password = "Senha invalida"
                    res.render("home", { emailcad: emailcad, password: password, classe1: classe1, classe2: classe2 })
                }

            })






        }
    })

});

app.get("/cadastrar", (req, res) => {

    classe1 = ""
    classe2 = ""
    classe3 = ""
    ncorresponde = "Confirma Senha"
    emailcad = "Email"
    user = "Nome Usuario"
    res.render("cadastro", { ncorresponde: ncorresponde, emailcad: emailcad, user: user, classe1: classe1, classe2: classe2, classe3: classe3 })

});

app.post("/registrar", (req, res) => {

    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
    const username = req.body.username;
    const senha = req.body.senha;
    const confirmsenha = req.body.confirmsenha;
    const data = req.body.data;



    if (senha == confirmsenha) {

        db.query("SELECT * FROM usuarios WHERE email=?", [email], (err, result) => {
            if (err) {
                res.send(err);
            }
            if (result.length == 0) {
                db.query("SELECT * FROM usuarios WHERE username=?", [username], (err, result) => {
                    if (err) {
                        res.send(err);
                    }
                    if (result.length == 0) {

                        bcrypt.hash(senha, saltRounds, (err, hash) => {

                            db.query("INSERT into usuarios(nome,sobrenome,email,senha,nascimento,username) values (?,?,?,?,?,?)", [nome, sobrenome, email, hash, data, username], (err, result) => {
                                if (err) {
                                    res.send(err)
                                }
                                res.render("redirect", {})
                            });


                        })


                    } else {
                        ncorresponde = "Confirma Senha"
                        emailcad = "Email";
                        user = "Usuario já cadastrado";
                        classe1 = "usuarioexiste"
                        classe2 = "";
                        classe3 = "";
                        res.render("cadastro", { user: user, emailcad: emailcad, ncorresponde: ncorresponde, classe1: classe1, classe2: classe2, classe3: classe3 })
                    }
                });
            } else {
                user = "Usuario"
                ncorresponde = "Confirma Senha"
                emailcad = "Email já cadastrado"
                classe1 = "";
                classe3 = "";
                classe2 = "emailexiste"
                res.render("cadastro", { emailcad: emailcad, user: user, ncorresponde: ncorresponde, classe1: classe1, classe2: classe2, classe3: classe3 })
            }

        });



    } else {
        user = "Usuario"
        emailcad = "Email"
        ncorresponde = "As senhas não correspondem"
        classe1 = ""
        classe2 = ""
        classe3 = "senhaincorreta"
        res.render("cadastro", { emailcad: emailcad, user: user, ncorresponde: ncorresponde, classe1: classe1, classe2: classe2, classe3: classe3 })
    }


});

app.listen(8000, () => {

    console.log("Servidor iniciado na porta 8000: http//localhost:8000")

})


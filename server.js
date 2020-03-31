//Express para configurar o meu server
const express = require('express')
const server = express()

const db = require("./db.js")

// configurar arquivos estáticos
server.use(express.static("public"))

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))


const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

// criação de uma rota
server.get("/", function(req, resp) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return resp.send("Erro no banco de dados !")
        }

         const reversedIdeas = [...rows].reverse()

         let lastIdeas = []
         for (let idea of reversedIdeas) {
             if (lastIdeas.length < 2) {
                 lastIdeas.push(idea)
             }
         }
         
         return resp.render("index.html", { ideas: lastIdeas} )

     })

})

server.get("/ideias", function(req, resp) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return resp.send("Erro no banco de dados !")
        }

        const reversedIdeas = [...rows].reverse()
        return resp.render("ideias.html", { ideas: reversedIdeas})
    }) 

})

server.post("/ideias", function(req, resp) {
})

server.post("/", function(req, resp) {

     //Insert on Table
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
     ) VALUES (?,?,?,?,?);
     `
     const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]
    
     db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return resp.send("Erro no banco de dados !")
        }

        return resp.redirect("/ideias")
     })

})

// porta para execução no servidor
server.listen(3000)
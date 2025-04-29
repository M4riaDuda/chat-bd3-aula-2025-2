const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

const ejs = require('ejs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
// console.log(path.join(__dirname, 'public'));

app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {
    res.render('index.html')
});

// Lógica do Socket.io - Envio e propagação de mensagens

// Array que simula o banco de dados
let messages = [];

// Estrutura de conexão do Socket.io
io.on('connection', socket => {

    // Teste de conexão
    console.log('NOVO USUÁRIO CONECTADO: ' + socket.id);

    // Recupera e mantém (exibe) as mensagens entre front e o back
    socket.emit('previousMessage', messages);

    // Lógica de chat quando uma mensagem é enviada
    socket.on('sendMessage', data => {

        // Adiciona a mensagem no final do array de mensagens
        messages.push(data);

        socket.broadcast.emit('receiveMessage', data);

    });

});


server.listen(3000, () => {
    console.log('CHAT RODANDO EM - HTTP://localhost:3000')
});
import express from 'express';

const server = express();
let PORT = 3000;

server.listen(PORT, () => {
    console.log('Listeniing on port ' + PORT);
})
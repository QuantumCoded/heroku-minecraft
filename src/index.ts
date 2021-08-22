import { spawn } from 'child_process';
import { Server } from 'ws';
import express from 'express';
import { createConnection } from 'net';
import * as path from 'path';

const app = express()
    .use((req, res) => res.sendFile(req.path || 'index.html', { root: process.cwd() }))
    .listen(process.env.PORT || 3000);

const minecraft = spawn('../jdk-16.0.2/bin/java', ['-jar', 'server.jar', '--nogui'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: path.join(process.cwd(), 'minecraft'),
}).on('data', d => {
    if ((d as Buffer).toString().includes('Done')) {
        const wss = new Server({ server: app });

        wss.on('connection', ws => {
            const s = createConnection(25565, 'localhost');

            s.on('ready', () => {
                ws.on('message', m => s.write(m.toString()));
                ws.on('close', () => s.end());

                s.on('data', d => ws.send(d));
                s.on('end', () => ws.close());
            });
        });
    }
});

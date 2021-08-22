import { spawn } from 'child_process';
import { Server } from 'ws';
import express from 'express';
import * as path from 'path';

const app = express()
    .use((req, res) => res.sendFile(req.path || 'index.html', { root: process.cwd() }))
    .listen(process.env.PORT || 3000);

const wss = new Server({ server: app });

wss.on('connection', (ws) => {
    const minecraft = spawn('../jdk-16.0.2/bin/java', ['-jar', 'server.jar', '--nogui'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.join(process.cwd(), 'minecraft'),
    });

    minecraft.stdout.on('data', d => ws.send(d.toString()));

	ws.on('message', m => {
		/* const a = m.toString().replace(/\n+$/, '').split(' ');
		const p = spawn(a.shift() || '', a, { stdio: ['pipe', 'pipe', 'pipe'] });
		p.on('error', console.error);
		p.stdout.setEncoding('utf-8').on('data', s => ws.send(s.replace(/\n+$/, '')));
		p.stderr.setEncoding('utf-8').on('data', s => ws.send(s.replace(/\n+$/, ''))); */

        minecraft.stdin.write(m.toString() + '\n');
	});
});

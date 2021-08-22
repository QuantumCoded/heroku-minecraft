import { spawn } from 'child_process';
import { createServer } from 'http';
import { createReadStream } from 'fs';
import * as path from 'path';

const minecraft = spawn('../jdk-16.0.2/bin/java', ['-jar', 'server.jar', '--nogui'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: path.join(process.cwd(), 'minecraft'),
});

minecraft.stdout.pipe(process.stdout);

createServer((req, res) => {
    createReadStream('index.html').pipe(res);
}).listen(process.env.PORT);
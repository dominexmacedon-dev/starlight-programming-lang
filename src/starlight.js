const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const readline = require('readline');
const readlineSync = require('readline-sync');
const MarkdownIt = require('markdown-it');
const mdTaskLists = require('markdown-it-task-lists');
const mdFootnote = require('markdown-it-footnote');

const Lexer = require('./lexer');
const Parser = require('./parser');
const Evaluator = require('./evaluator');

const VERSION = '1.1.19';

const COLOR = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    green: '\x1b[32m',
    magenta: '\x1b[35m',
    white: '\x1b[37m'
};

function waitAndExit(code = 0) {
    try { process.stdin.setRawMode(true); } catch {}
    console.error(COLOR.gray + '\nPress any key to exit...' + COLOR.reset);
    process.stdin.resume();
    process.stdin.once('data', () => process.exit(code));
}

function fatal(msg) {
    console.error(COLOR.white + msg + COLOR.reset);
    waitAndExit(1);
}
function renderMarkdown(mdPath) {
    let markdown;
    try {
        markdown = fs.readFileSync(mdPath, 'utf8');
    } catch (e) {
        console.error(COLOR.white + `Failed to read markdown: ${e.message}` + COLOR.reset);
        return waitAndExit(1);
    }

    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
    })
        .use(mdTaskLists, { enabled: true })
        .use(mdFootnote);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${path.basename(mdPath)}</title>
<style>
    body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        padding: 40px;
        max-width: 900px;
        margin: auto;
        background: #0e0e11;
        color: #eaeaea;
        line-height: 1.6;
    }
    h1, h2, h3, h4 {
        border-bottom: 1px solid #2a2a35;
        padding-bottom: 6px;
    }
    pre {
        background: #1e1e2e;
        padding: 16px;
        overflow-x: auto;
        border-radius: 8px;
    }
    code {
        background: #1e1e2e;
        padding: 2px 6px;
        border-radius: 4px;
        color: #f8f8f2;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 20px 0;
    }
    th, td {
        border: 1px solid #2a2a35;
        padding: 8px;
    }
    th {
        background: #1b1b25;
    }
    a {
        color: #7aa2f7;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
    blockquote {
        border-left: 4px solid #7aa2f7;
        padding-left: 16px;
        color: #c0caf5;
        margin: 20px 0;
    }
</style>
</head>
<body>
${md.render(markdown)}
</body>
</html>`;

    const tempHtml = path.join(
        os.tmpdir(),
        `starlight-md-${Date.now()}.html`
    );

    fs.writeFileSync(tempHtml, html, 'utf8');

    openURL(`file://${tempHtml}`);

    setTimeout(() => {
        try { fs.unlinkSync(tempHtml); } catch {}
    }, 3000);
}

function highlightCode(line) {
    return line
        .replace(/"(?:\\.|[^"])*"/g, m => COLOR.yellow + m + COLOR.reset)
        .replace(/\b\d+(\.\d+)?\b/g, m => COLOR.magenta + m + COLOR.reset)
        .replace(
            /\b(sldeploy|import|from|let|if|else|for|while|func|return|break|continue|define|ask)\b/g,
            m => COLOR.blue + m + COLOR.reset
        );
}

function openURL(url) {
    const platform = process.platform;
    let command;

    if (platform === 'win32') command = `start "" "${url}"`;
    else if (platform === 'darwin') command = `open "${url}"`;
    else command = `xdg-open "${url}"`;

    exec(command);
}

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
${COLOR.bold}Starlight Programming Language${COLOR.reset}
${COLOR.magenta}Developed by Macedon${COLOR.reset}

Usage:
  starlight <file.sl>        Run a Starlight file
  starlight -v              Show version
  starlight --help          Show help
  starlight --learn         Open learning guide
  starlight --writedirectly Interactive editor
`);
    process.exit(0);
}

if (args[0] === '-v' || args[0] === '--version') {
    console.log(`${COLOR.bold}Starlight CLI v${VERSION}${COLOR.reset}`);
    console.log(`${COLOR.magenta}Developed by Dominex Macedon${COLOR.reset}`);
    process.exit(0);
}

if (args[0] === '--help') {
    console.log(`
${COLOR.bold}Starlight CLI v${VERSION}${COLOR.reset}
${COLOR.magenta}Developed by Macedon${COLOR.reset}

Commands:
  ${COLOR.green}starlight <file.sl>${COLOR.reset}
      Run a Starlight source file

  ${COLOR.green}starlight -v${COLOR.reset}
      Show CLI version

  ${COLOR.green}starlight --help${COLOR.reset}
      Show this help message

  ${COLOR.green}starlight --learn${COLOR.reset}
      Open the official learning guide

  ${COLOR.green}starlight --writedirectly${COLOR.reset}
      Interactive editor mode
`);
    process.exit(0);
}

if (args[0] === '--learn') {
    openURL('https://programming-lang.pages.dev/learning-guide');
    process.exit(0);
}

if (args[0] === '--writedirectly') {
    const tempFile = path.join(os.tmpdir(), `starlight-${Date.now()}.sl`);
    const lines = [];

    console.log(COLOR.green + 'Interactive Starlight Editor' + COLOR.reset);
    console.log(COLOR.gray + 'Type code. Use :run to execute.\n' + COLOR.reset);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    process.stdout.write(COLOR.cyan + '> ' + COLOR.reset);

    rl.on('line', (line) => {
        if (line.trim() === ':run') {
            rl.close();
            fs.writeFileSync(tempFile, lines.join('\n'), 'utf8');
            runFile(tempFile, true, () => savePrompt(lines));
            return;
        }

        lines.push(line);
        process.stdout.write(
            COLOR.cyan + '> ' + COLOR.reset + highlightCode(line) + '\n'
        );
    });

    return;
}

function savePrompt(lines) {
    try { process.stdin.setRawMode(false); } catch {}

    const save = readlineSync
        .question(COLOR.cyan + 'Do you want to save this code? (y/n): ' + COLOR.reset)
        .trim()
        .toLowerCase();

    if (save !== 'y') return waitAndExit(0);

    const dir = readlineSync.question(
        COLOR.cyan + 'Folder path: ' + COLOR.reset
    ).trim();

    if (!fs.existsSync(dir)) {
        console.log(COLOR.yellow + 'Invalid folder.' + COLOR.reset);
        return waitAndExit(0);
    }

    const name = readlineSync.question(
        COLOR.cyan + 'File name: ' + COLOR.reset
    ).trim();

    if (!name) return waitAndExit(0);

    const file = path.join(dir, name.endsWith('.sl') ? name : name + '.sl');
    fs.writeFileSync(file, lines.join('\n'), 'utf8');

    console.log(COLOR.green + `Saved to ${file}` + COLOR.reset);
    waitAndExit(0);
}

async function runFile(filePath, isTemp = false, callback) {
    let code;
    try {
        code = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        console.error(COLOR.white + `Failed to read file: ${e.message}` + COLOR.reset);
        return waitAndExit(1);
    }

    let tokens, ast;
    try {
        const lexer = new Lexer(code);
        tokens = lexer.getTokens();

        const parser = new Parser(tokens, code);
        ast = parser.parse();  // <-- parser errors caught here
    } catch (e) {
        console.error(COLOR.white + ` ${e.message}` + COLOR.reset);
        return waitAndExit(1); // stop execution without Node.js stack trace
    }

    const evaluator = new Evaluator(code);

    try {
        await evaluator.evaluate(ast);
    } catch (e) {
        if (e.name === 'RuntimeError' || e.name === 'SyntaxError') {
            console.error(COLOR.white + e.message + COLOR.reset);
        } else {
            console.error(COLOR.white + `Unexpected Error: ${e.message || e}` + COLOR.reset);
        }
        return waitAndExit(1);
    }

    if (callback) callback();

    if (isTemp) {
        try { fs.unlinkSync(filePath); } catch {}
    }
}
if (!args[0].startsWith('--')) {
    const file = path.resolve(args[0]);
    const ext = path.extname(file).toLowerCase();

    if (ext === '.md') {
        renderMarkdown(file);
    } else if (ext === '.sl') {
        runFile(file);
    } else {
        console.error(COLOR.red + 'Incorrect file extension. Create .sl or .md to be able to run correctly.' + COLOR.reset);
        waitAndExit(1);
    }
}


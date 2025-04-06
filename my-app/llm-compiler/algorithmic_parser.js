import Parser from 'tree-sitter'
import CPP from 'tree-sitter-cpp'
import fs from 'fs'
import { dir } from 'console';
import path from 'path';


function findSourceFiles() {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    const files = [];

    for (const entry of entries) {
        const res = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findSourceFiles(res));
        } else if (res.match(/\.(cpp|h|hpp)$/)) {
            files.push(res);
        }
    }

    return files;
}

function extractSymbols (tree) {
    const symbosl = [];

}

function parseFile (filePath) {
    // const isCpp = filePath.endsWith('.cpp') || filePath.endsWith('.hpp');
    const parser = new Parser();
    parser.setLanguage(CPP);

    const code = fs.readFileSync(filePath, 'utf-8');
    const tree = parser.parse(code);

    return {tree, code};
}
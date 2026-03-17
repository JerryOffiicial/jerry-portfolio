const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walkSync(filepath, filelist);
        } else {
            filelist.push(filepath);
        }
    }
    return filelist;
}

const files = walkSync('app/admin').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('\\"')) {
        console.log(`Fixing ${file}`);
        fs.writeFileSync(file, content.replace(/\\"/g, '"'), 'utf8');
    }
}
console.log('Done!');

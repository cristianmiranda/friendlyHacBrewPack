const fs = require('fs');
const util = require('util');
const readline = require('readline');
const exec = require('child_process').exec;

const args = require('minimist')(process.argv.slice(2), {
    alias: {
        t: 'titleName',
        c: 'coreNroPath',
        r: 'romPath',
        i: 'imagePath',
        k: 'keysPath',
        o: 'outputPath',
    }
});
const titleName = args.t;
const coreNroPath = args.c;
const romPath = args.r;
const imagePath = args.i;
const keysPath = args.k;
const outputPath = args.o;

var titleId = '05';
for (var i = 0; i < 10; i++) {
  let hex = Math.floor(Math.random() * Math.floor(15));
  switch (hex) {
      case 15: titleId += 'F'; break;
      case 14: titleId += 'E'; break;
      case 13: titleId += 'D'; break;
      case 12: titleId += 'C'; break;
      case 11: titleId += 'B'; break;
      case 10: titleId += 'A'; break;
      default: titleId += hex; break;
  }
}
titleId += '0000';
console.log('Randomized Title ID:' + titleId);

const COMMAND = util.format('./hacbrewpack -k %s --titleid %s --titlename \'%s\' --titlepublisher Nintendo --nspdir %s', keysPath, titleId, titleName, outputPath);

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'y' || key.name === 'Y') {

    /*
     * MAIN PROCESS
     */

    const nextNroPath = util.format('sdmc:%s', coreNroPath);
    fs.writeFile("./romfs/nextNroPath", nextNroPath, function(err) {
      const nextArgv = util.format('sdmc:%s "sdmc:%s"', coreNroPath, romPath);
      fs.writeFile("./romfs/nextArgv", nextArgv, function(err) {
        fs.copyFile(imagePath, './control/icon_AmericanEnglish.dat', (err) => {
          exec(COMMAND, (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            process.exit();
          });
        });
      });
    });

  } else {
    console.log('Aborting...');
    process.exit();
  }
});

console.log('Please review the following:');
console.log(' ');
console.log('Title ID: ' + titleId);
console.log('Title Name: ' + titleName);
console.log('Core: ' + coreNroPath);
console.log('ROM: ' + romPath);
console.log('Image: ' + imagePath);
console.log('Switch keys: ' + keysPath);
console.log('NSP output path: ' + outputPath);
console.log(' ');
console.log('Press (y/Y) if the above is correct and you wish to continue...');

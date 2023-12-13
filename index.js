const pjson = require('./package.json');
// require modules
const fs = require('fs');
const archiver = require('archiver');

// create a file to stream archive data to.
const output = fs.createWriteStream(__dirname + `releases/LootGoblinsHeim-${pjson.version}.zip`);
const archive = archiver('zip', {
    zlib: { level: 5 } // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.directory('package/', false);

archive.finalize();
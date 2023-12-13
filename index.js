const fs = require('fs');
const archiver = require('archiver');

const pjson = require('./package.json');
const CURRENT_PACKAGE_VERSION = pjson.version;
const RELEASES_DIR = './releases';

updateManifestVersion();
archivePackage();



function archivePackage() {
    if(!fs.existsSync(RELEASES_DIR))
        fs.mkdirSync(RELEASES_DIR);
    
    const output = fs.createWriteStream(__dirname + `/releases/LootGoblinsHeim-${CURRENT_PACKAGE_VERSION}.zip`);
    const archive = archiver('zip', {
        zlib: { level: 5 } // Sets the compression level.
    });

    output.on('end', function() {
        console.log('Data has been drained');
    });

    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.pipe(output);

    archive.directory('package/', false);

    archive.finalize().then(() => {
        console.log(`/releases/LootGoblinsHeim-${CURRENT_PACKAGE_VERSION}.zip is ready to deploy`);
    });
}


function updateManifestVersion() {
    const fileName = './package/manifest.json';
    const file = require(fileName);
    
    if(file.version_number === CURRENT_PACKAGE_VERSION) {
        console.log(`No need to update manifest version_number`);
        return;
    }
    console.log(`Updating manifest.version_number from [${file.version_number}] to [${CURRENT_PACKAGE_VERSION}]`);

    file.version_number = CURRENT_PACKAGE_VERSION;

    fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
        console.log('writing to ' + fileName);
    });
}
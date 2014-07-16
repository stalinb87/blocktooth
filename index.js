var btSerial = new(require('bluetooth-serial-port')).BluetoothSerialPort();
var exec = require('child_process').exec;
var isFound = false;
var isLock = false;
var device = 'E8:99:C4:58:CE:D7';
btSerial.on('found', function (address, name) {
    if (address === device) {
        isFound = true;
        console.log('device ' + name + ' found');
    }
});
btSerial.on('finished', function () {
    if (isFound) {
        if (isLock) {

            exec('gnome-screensaver-command -d', function (error, stdout, stderr) {
                console.log('unlocking...');
                isLock = false;
            });
        }
    } else {
        exec('gnome-screensaver-command -l', function (error, stdout, stderr) {
            console.log('blocking...');
            isLock = true;
        });

    }
    setTimeout(function () {
        isFound = false;
        btSerial.inquire();
    }, 2000);
});
console.log('searching for devices');
btSerial.inquire();
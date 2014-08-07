//rasperry pi car
//gpio
//dc motor control
//servo motor control
//camera stream
// enver küçükkülahlı


var io = require('socket.io').listen(8085)

// Load required modules.
var sys = require('sys'),
exec = require('child_process').exec

// Path to Raspbian's gpio driver, used for sending signals to the remote.
var path = '/sys/class/gpio/',
// Pin numbers on the Raspberry Pi connected to the car's remote.
pins = [23, 24, 25, 10, 9, 11];
//servo0=7=gpio4 servo1=11=gpio17 servo motorlar icin kullanılacak

var servoKucuk=50;
var servoBuyuk=250;

// Enable sending signals to the car's remote control
// which is connected to the Raspberry Pi.
initPins()

function calistir(command) {
    exec(command, function (error, stdout, stderr) {
        if (error !== null)
            console.log('exec error: ' + error)
    })
}



// Listen for connections
io.sockets.on('connection', function (socket) {
    console.log('baglanti oldu galiba');

    //command = 'mjpg_streamer -i "input_uvc.so -f 10 -y YUYV" -o "output_http.so  -p 8080  -w /usr/local/www"';
    // calistir(command);
    // Listen for direction messages from the app.
    socket.on('ping', function (data) {
        console.log('ping');

    });


    command = ''

    socket.on('leftThrottle', function (data) {
        // console.log('leftThrottle: ' + data);
        if (data < 0.5) {
            //console.log('geri ');
            command = 'echo 1 > ' + path + 'gpio23/value';
            calistir(command);

            command = 'echo 1 > ' + path + 'gpio24/value';
            calistir(command);
        }
        else if (data > 0.5) {
            //console.log('ileri ');
                command = 'echo 1 > ' + path + 'gpio23/value';
                calistir(command);

                command = 'echo 1 > ' + path + 'gpio25/value';
                calistir(command);
            }
            else {
                //console.log('dur ');
                command = 'echo 0 > ' + path + 'gpio23/value';
                calistir(command);

                command = 'echo 0 > ' + path + 'gpio24/value';
                calistir(command);

                command = 'echo 0 > ' + path + 'gpio25/value';
                calistir(command);

            }
    });

    socket.on('rightThrottle', function (data) {
        // console.log('rightThrottle: ' + data);
        if (data < 0.5) {
            //console.log('geri ');
            command = 'echo 1 > ' + path + 'gpio11/value';
            calistir(command);

            command = 'echo 1 > ' + path + 'gpio9/value';
            calistir(command);
        }
        else if (data > 0.5) {
            //console.log('ileri ');
            command = 'echo 1 > ' + path + 'gpio11/value';
            calistir(command);

            command = 'echo 1 > ' + path + 'gpio10/value';
            calistir(command);
        }
        else {
            //console.log('dur ');
            command = 'echo 0 > ' + path + 'gpio11/value';
            calistir(command);

            command = 'echo 0 > ' + path + 'gpio10/value';
            calistir(command);

            command = 'echo 0 > ' + path + 'gpio9/value';
            calistir(command);

        }
    });


    socket.on('yawServo', function (data) {
        //data işlenip 60-240 arasına çevrilecek
        var sonuc = (servoBuyuk - servoKucuk) * data + servoKucuk;
        command= 'echo 0=' + sonuc + ' > /dev/servoblaster';
        calistir(command);
    });
    socket.on('pitchServo', function (data) {
        var sonuc = (servoBuyuk - servoKucuk) * data + servoKucuk;
        command = 'echo 1=' + sonuc + ' > /dev/servoblaster';
        calistir(command);
    });



    /*
        socket.on('camStatus', function (data) {
            // console.log('leftThrottle: ' + data);
            if (data == 'open')
            {
                command = 'mjpg_streamer -i "input_uvc.so -f 10 -y YUYV" -o "output_http.so  -p 8080  -w /usr/local/www"';
                calistir(command);
            }
            else if (data == 'close')
            {
                command = 'mjpg-streamer stop';
                calistir(command);
            }
        });
    */

})

function initPins() {
    //kamerayı calistir
    command = 'mjpg_streamer -i "input_uvc.so -f 10 -y YUYV" -o "output_http.so  -p 8080  -w /usr/local/www"';
    calistir(command);
    command='sudo /usr/local/sbin/servod  --p1pins=7,11,0,0,0,0,0,0'
    calistir(command);


    // Enable control of the Raspberry Pi's gpio pins.
    // Read more at http://elinux.org/RPi_Low-level_peripherals#Bash_shell_script.2C_using_sysfs.2C_part_of_the_raspbian_operating_system
    for (var pin in pins) {
        console.log('Creating port ' + pins[pin] + '...')

        // The command first checks whether the port already exists.
        var command = 'if (! [ -f ' + path + 'gpio' + pins[pin] + '/direction ]); then ' +
                        'echo ' + pins[pin] + ' > ' + path + 'export; fi';

        // Create the ports using Raspbian's command line.
        exec(command, function (error, stdout, stderr) {
            if (error === null)
                console.log('Successfully created port.')
            else
                console.log('Error when creating port: ' + error + ' (' + stderr + ').')
        })
    }

    // Configure the Raspberry Pi's gpio pins as output ports which enables signals
    // to be sent to the car's remote control.
    // Read more at http://elinux.org/RPi_Low-level_peripherals#Bash_shell_script.2C_using_sysfs.2C_part_of_the_raspbian_operating_system
    for (var pin in pins) {
        console.log('Configuring port ' + pins[pin] + '...')

        // The command configures the pin as an output port.
        var command = 'echo out > ' + path + 'gpio' + pins[pin] + '/direction'

        // Configure the ports using Raspbian's command line.
        exec(command, function (error, stdout, stderr) {
            if (error === null)
                console.log('Successfully configured pin.')
            else
                console.log('Error when configuring port: ' + error + ' (' + stderr + ').')
        })
    }
}

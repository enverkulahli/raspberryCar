﻿try
{
    var socket = io.connect('http://192.168.2.6:8085')
}
catch (error) { }

var oncekiLeftThrottle = 0.5;
var oncekiRightThrottle=0.5;


    $(function () {
	            $('#leftThrottle').joystick({
		            xAxis: false,
		            ySnap: true,
		            //moveEvent: function(pos) { console.log('y:' + pos.y) },
		            //endEvent: function(pos) { console.log('y:' + pos.y) }
	            });
	
	            $('#rightThrottle').joystick({
	                xAxis: false,
	                ySnap: true,
	            });

	            $('#camServo').joystick({

	            });

	            $('#leftThrottle').joystick('value', 0.5, 0.5);
	            $('#rightThrottle').joystick('value', 0.5, 0.5);
	            $('#camServo').joystick('value', 0.5, 0.5);


                //ekrana yazdırma işi burda
	            
              //console.log(y);


        //socket uzerinden verinin gonderilmesi
                //leftThrottle'in gonderilmesi
	            $('#leftThrottle').on('touchmove', function (e) {
	                $("#leftThrottleValue").html($('#leftThrottle').joystick('value').y);
	                
	                if ((oncekiLeftThrottle <= 0.5 && $('#leftThrottle').joystick('value').y >= 0.5) || (oncekiLeftThrottle >= 0.5 && $('#leftThrottle').joystick('value').y <= 0.5))
	                {
	                    //veriyi gonder
	                    //console.log('onceki: ' + oncekiLeftThrottle + '  simdiki: ' + $('#leftThrottle').joystick('value').y);
	                    try {
	                        socket.emit('leftThrottle', 0.5);
	                        socket.emit('leftThrottle', $('#leftThrottle').joystick('value').y);
	                        oncekiLeftThrottle = $('#leftThrottle').joystick('value').y;
	                    } catch (error) {
	                        console.log(error);
	                    }
	                }
	                

	            });
	            $('#leftThrottle').on('touchend', function (e) {
	                $("#leftThrottleValue").html(0.5);
	                try {
	                    socket.emit('leftThrottle', 0.5)
	                    oncekiLeftThrottle = 0.5;
	                } catch (error) { }

	            });
                //rightThrottle'in gonderilmesi
	            $('#rightThrottle').on('touchmove', function (e) {
	                $("#rightThrottleValue").html($('#rightThrottle').joystick('value').y);
	                if ((oncekiRightThrottle <= 0.5 && $('#rightThrottle').joystick('value').y >= 0.5) || (oncekiRightThrottle >= 0.5 && $('#rightThrottle').joystick('value').y <= 0.5))
	                {
	                    //veriyi gonder
	                    try {
	                        socket.emit('rightThrottle', 0.5);
	                        socket.emit('rightThrottle', $('#rightThrottle').joystick('value').y);
	                        oncekiRightThrottle = $('#rightThrottle').joystick('value').y;
	                    } catch (error) {
	                        console.log(error);
	                    }
	                }
	                

	            });
	            $('#rightThrottle').on('touchend', function (e) {
	                $("#rightThrottleValue").html(0.5);
	                try {
	                    socket.emit('rightThrottle', 0.5)
	                    oncekiRightThrottle = 0.5;
	                } catch (error) { }

	            });
                //yaw pitch servolarin gonderilmesi
	            //$('#camServo').on('touchmove', function (e) { $("#yawServoValue").html($('#camServo').joystick('value').x); });
	            //$('#camServo').on('touchmove', function (e) { $("#pitchServoValue").html($('#camServo').joystick('value').y); });
	            $('#camServo').on('touchmove', function (e) {
	                $("#yawServoValue").html($('#camServo').joystick('value').x);
	                $("#pitchServoValue").html($('#camServo').joystick('value').y);
	                    try {
	                        socket.emit('yawServo', $('#camServo').joystick('value').x);
	                        socket.emit('pitchServo', $('#camServo').joystick('value').y);
	                    } catch (error) {
	                        console.log(error);
	                    }

	            });

            });



$(document).ready(function () {  //ilk çalıştığında fonksiyonu çalıştır
    boyutlandir();
    try {
        // Connect to the server running on the Raspberry Pi.
     
        socket.on('connect', function () {
            alert('connected');
            //hyper.log('connected!');
        })
    } catch (error) {
        alert('Failed to connect to the Raspberry Pi!')
    }
});

//$(window).on("resize",function () { //pencere boyutu değiştiiinde 
//    boyutlandir();
//}).resize();




function boyutlandir() {

    
    var y1 = $('#camServo').joystick('value').y;
    var x1 = $('#camServo').joystick('value').x;

    var winwidth = $(window).width(); // pencere genişliği
    var winheight = $(window).height(); // pencere yüksekliği
    var ortabolumyukseklik = winheight - 120;//pencerenin yüksekliğinden üstteki iki divin yüksekliklerini çıkarıyorum



    //orta bolum yüksekliği alttaki divlere uyguluyorum. orta ust ve orta alta da yarısını
    $("#sol").css('height', ortabolumyukseklik + 'px');
    $("#orta").css('height', ortabolumyukseklik + 'px');
    $("#sag").css('height', ortabolumyukseklik + 'px');
    $('#ortaust').css('height', ortabolumyukseklik / 2 + 'px');
    $('#ortaalt').css('height', ortabolumyukseklik / 2 + 'px');

    $('#camServo').css('height', ortabolumyukseklik / 2 -20+ 'px');
    $('#camServo').css('width', $('#ortaust').width()-20);

   

    var left1 = ($(".joystick").width() / 2) - ($(".joystick .handle").width() / 2);
    var top1 = ($(".joystick").height() / 2) - ($(".joystick .handle").height() / 2);
    $(".joystick .handle").css('left', left1);
    $(".joystick .handle").css('top', top1);



    $('#camServo').joystick('value', x1, y1);


}





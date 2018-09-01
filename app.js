var assetsPath = 'assets/kelden-jp-1.mp3';
var spriteSheet = {
    '1': [1000, 400],
    '2': [2000, 400],
    '3': [3000, 525],
    '4': [4000, 400],
    '5': [5000, 400],
    '6': [5900, 400],
    '7': [7000, 400],
    '8': [8000, 400],
    '9': [9080, 400],
    '10': [10000, 425],
    '100': [11000, 425],
    '1000': [12000, 450],
    '10000': [13000,425]
}

    // '2': [14000, 400],
    // '2b': [2000, 400],

var speed = 1;
var html5 = true;

var sound = new Howl({
    src: [assetsPath],
    sprite: spriteSheet,
    rate: speed,
    html5: html5
});

Howl.prototype.playJapanese = function(arr) {
    var currentLetter;
    var last = false;

    if (arr.length == 1) {
        currentLetter = arr[0];
        last = true;
    } else {
        currentLetter = arr[0];
    }
    
    // if (currentLetter == "2" && (arr[1] == 10 || last)) currentLetter = "2b";

    if (last) {
        console.log(arr);
        console.log("PLAY: ", currentLetter)
        this.play(currentLetter)
    }

    else if (arr.length > 0 && !last) {
        var nextSound = new Howl({
            src: [assetsPath],
            sprite: spriteSheet,
            rate: speed,
            html5: html5
        });

        nextSound.on('end', function() {
            arr.shift();
            nextSound.playJapanese(arr);
        });

        console.log(arr);
        console.log("PLAY: ", currentLetter)
        nextSound.play(currentLetter)
    }
}

function convertToArray(str) {
    var returnArray = [];
    for (var i = 0; i < str.length; i++) {
        returnArray.push(str.substring(i, i+1))
    }
    return returnArray;
}

function convertNumberToHun(n, stringOutput) {
  if (n == 0) return [0];
  var arr = [];
  var i = 1;

  while (n > 0) {
    // arr.unshift((n % 10) * i);
    if (i != 1) arr.unshift(i);
    if (!(n % 10 == 1 && i == 10)) arr.unshift(n % 10);


    n = Math.floor(n / 10);
    i *= 10
  }

  return arr.map(String); // Convert it to a string
}
// console.log(convertNumberToHun(56969))

// sound.playJapanese(convertNumberToHun(69));


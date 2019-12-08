//var config = require('./config.js');
//const Kuroshiro = require('./lib/kuroshiro.js');

/*
** Speaking Section
** This is how to speak the translation
*/
var assetsPath = 'assets/kelden-full-jp-1.mp3';
var spriteSheet = {
	"a": [0, 360],
	"i": [1000, 400],
	"u": [2000, 320],
	"e": [3000, 320],
	"o": [4000, 400],
	"ka": [5000, 400],
	"ga": [6000, 600],
	"ki": [7000, 400],
	"kya": [8000, 500],
	"kyu": [9000, 400],
	"kyo": [10000, 400],
	"gi": [11000, 280],
	"gya": [12000, 360],
	"gyu": [13000, 380],
	"gyo": [14000, 500],
	"ku": [15000, 410],
	"gu": [16000, 450],
	"ke": [17000, 450],
	"ge": [18000, 500],
	"ko": [19000, 390],
	"go": [20000, 245],
	"sa": [21000, 460],
	"za": [22000, 360],
	"si": [23000, 400],
	"sha": [24000, 380],
	"shu": [25000, 420],
	"sho": [26000, 200],
	"ji": [27000, 370],
	"ja": [28000, 640],
	"ju": [29000, 500],
	"jo": [30000, 250],
	"su": [31000, 500],
	"zu": [32000, 500],
	"se": [33000, 380],
	"ze": [34000, 400],
	"so": [35000, 440],
	"zo": [36000, 500],
	"ta": [37000, 250],
	"da": [38000, 250],
	"ti": [39000, 500],
	"cha": [40000, 440],
	"chu": [41000, 550],
	"cho": [42000, 320], 
	"di": [43000, 480],
	"dya": [44000, 500],
	"dyu": [45000, 450],
	"dyo": [46000, 420],
	"tsu": [47000, 450],
	"du": [48000, 480],
	"te": [49000, 320],
	"de": [50000, 320],
	"to": [51000, 440],
	"do": [52000, 320],
	"na": [53000, 400],
	"ni": [54000, 300],
	"nya": [55000, 500],
	"nyu": [56000, 420],
	"nyo": [57000, 350],
	"nu": [58000, 280],
	"ne": [59000, 250],
	"no": [60000, 240],
	"ha": [61000, 260],
	"ba": [62000, 280],
	"pa": [63000, 250],
	"hi": [64000, 260],
	"hya": [65000, 380],
	"hyu": [66000, 360],
	"hyo": [67000, 310],
	"bi": [68000, 360],
	"bya": [69000, 320],
	"byu": [70000, 360],
	"byo": [71000, 280],
	"pi": [72000, 340],
	"pya": [73000, 320],
	"pyu": [74000, 320],
	"pyo": [75000, 260],
	"hu": [76000, 300],
	"fa": [77000, 500],
	"fi": [78000, 300],
	"fe": [79000, 240],
	"fo": [80000, 290],
	"fya": [81000, 400],
	"fyu": [82000, 250],
	"fyo": [83000, 260],
	"bu": [84000, 300],
	"pu": [85000, 300],
	"he": [86000, 320],
	"be": [87000, 320],
	"pe": [88000, 280],
	"ho": [89000, 230],
	"bo": [90000, 250],
	"po": [91000, 200],
	"ma": [92000, 375],
	"mi": [93000, 330],
	"mya": [94000, 460],
	"myu": [95000, 300],
	"myo": [96000, 350],
	"mu": [97000, 420],
	"me": [98000, 300],
	"mo": [99000, 290],
	"ya": [100000, 500],
	"yu": [101000, 230],
	"yo": [102000, 360],
	"ra": [103000, 350],
	"ri": [104000, 360],
	"rya": [105000, 300],
	"ryu": [106000, 400],
	"ryo": [107000, 300],
	"ru": [108000, 240],
	"re": [109000, 260],
	"ro": [110000, 200],
	"wa": [111000, 320],
	"wi": [112000, 210],
	"we": [113000, 330],
	"wo": [114000, 290],
	"n": [115000, 320],
	"-": [116000, 150],
	"--": [116000, 350]
}

var speed = 1.5;
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
    
    if (last) {
        // console.log(arr);
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

        // console.log(arr);
        console.log("PLAY: ", currentLetter)
        nextSound.play(currentLetter)
    }
}









var hiraganaAlphabet = ["-", "--", "a","i","u","e","o","ka","ga","ki","kya","kyu","kyo","gi","gya","gyu","gyo","ku","gu","ke","ge","ko","go","sa","za","si","sha","shu","sho","ji","ja","ju","jo","su","zu","se","ze","so","zo","ta","da","ti","cha","chu","cho","di","dya","dyu","dyo","tsu","du","te","de","to","do","na","ni","nya","nyu","nyo","nu","ne","no","ha","ba","pa","hi","hya","hyu","hyo","bi","bya","byu","byo","pi","pya","pyu","pyo","hu","fa","fi","fe","fo","fya","fyu","fyo","bu","pu","he","be","pe","ho","bo","po","ma","mi","mya","myu","myo","mu","me","mo","ya","yu","yo","ra","ri","rya","ryu","ryo","ru","re","ro","wa","wi","we","wo","n"]

translate.engine = 'google';
translate.key = config.GOOGLE_API_KEY;



function translateToJapanese(userInput, outputId) {
	outputId.innerHTML = "Thinking...";

	translate(userInput, 'ja').then(text => {
		var kuroshiro = new Kuroshiro();

		console.log(kuroshiro);
		console.log("Loading dict...");
		kuroshiro.init(new KuromojiAnalyzer({ dictPath: "dict" }))
		.then(function() {
			console.log("Dict loaded!");
			console.log("returning the kuroshiro~");
			console.log()
			return kuroshiro.convert(text, { to: "romaji", mode: "spaced" });
		}) 
		.then(function(result) {
			outputId.innerHTML = "";

			console.log(text);
			outputId.innerHTML += text + "<br/>";

			console.log("Pronunciation")
			console.log(result);
			result = hiraToArray(result);
			var displayResult = result.join("");
			displayResult = displayResult.replace(/--/g, " ")
			var romanji = document.createElement("SPAN");
			romanji.innerHTML = displayResult;
			outputId.append(romanji);
			sound.playJapanese(result);
		})
	});
}

// Parameter: String
function hiraToArray(hiragana) {
	hiragana = hiragana.replace(/-/g, "");
	hiragana = hiragana.replace(/ッ/g, "-");
	hiragana = hiragana.replace(/,/g, "-");
	hiragana = hiragana.replace(/\s/g, "--");

	var returnArr = [];
	// Loop through the whole hiragana
	var k = 0;
	for (var i = 3; i > 0; i--) {
		// console.log(hiragana);
		var currSub = hiragana.substring(0, i);
		// console.log(k + ":" + (i+k) + " " + currSub)
		if (hiraganaAlphabet.indexOf(currSub) > -1) {
			// console.log("FOUND ONE");
			returnArr.push(currSub);
			hiragana = hiragana.substring(i);
			i = 4;
		}
	}

	return returnArr
}
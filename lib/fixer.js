var row = [];
var items = [];

//var data = 'ふぁ:"fa",ふぃ:"fi",ふぇ:"fe",ふぉ:"fo",ファ:"fa",フィ:"fi",フェ:"fe",フォ:"fo",きゃ:"kya",きゅ:"kyu",きょ:"kyo",しゃ:"sha",しゅ:"shu",しょ:"sho",ちゃ:"cha",ちゅ:"chu",ちょ:"cho",にゃ:"nya",にゅ:"nyu",にょ:"nyo",ひゃ:"hya",ひゅ:"hyu",ひょ:"hyo",みゃ:"mya",みゅ:"myu",みょ:"myo",りゃ:"rya",りゅ:"ryu",りょ:"ryo",キャ:"kya",キュ:"kyu",キョ:"kyo",シャ:"sha",シュ:"shu",ショ:"sho",チャ:"cha",チュ:"chu",チョ:"cho",ニャ:"nya",ニュ:"nyu",ニョ:"nyo",ヒャ:"hya",ヒュ:"hyu",ヒョ:"hyo",ミャ:"mya",ミュ:"myu",ミョ:"myo",リャ:"rya",リュ:"ryu",リョ:"ryo",ふゃ:"fya",ふゅ:"fyu",ふょ:"fyo",ぴゃ:"pya",ぴゅ:"pyu",ぴょ:"pyo",びゃ:"bya",びゅ:"byu",びょ:"byo",ぢゃ:"dya",ぢゅ:"dyu",ぢょ:"dyo",じゃ:"ja",じゅ:"ju",じょ:"jo",ぎゃ:"gya",ぎゅ:"gyu",ぎょ:"gyo",フャ:"fya",フュ:"fyu",フョ:"fyo",ピャ:"pya",ピュ:"pyu",ピョ:"pyo",ビャ:"bya",ビュ:"byu",ビョ:"byo",ヂャ:"dya",ヂュ:"dyu",ヂョ:"dyo",ジャ:"ja",ジュ:"ju",ジョ:"jo",ギャ:"gya",ギュ:"gyu",ギョ:"gyo",ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",だ:"da",ぢ:"di",づ:"du",で:"de",ど:"do",ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",パ:"pa",ピ:"pi",プ:"pu",ペ:"pe",ポ:"po",バ:"ba",ビ:"bi",ブ:"bu",ベ:"be",ボ:"bo",ダ:"da",ヂ:"di",ヅ:"du",デ:"de",ド:"do",ザ:"za",ジ:"ji",ズ:"zu",ゼ:"ze",ゾ:"zo",ガ:"ga",ギ:"gi",グ:"gu",ゲ:"ge",ゴ:"go",わ:"wa",ゐ:"wi",ゑ:"we",を:"wo",ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro",や:"ya",ゆ:"yu",よ:"yo",ま:"ma",み:"mi",む:"mu",め:"me",も:"mo",は:"ha",ひ:"hi",ふ:"hu",へ:"he",ほ:"ho",な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",た:"ta",ち:"ti",つ:"tsu",て:"te",と:"to",さ:"sa",し:"si",す:"su",せ:"se",そ:"so",か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko",あ:"a",い:"i",う:"u",え:"e",お:"o",ぁ:"a",ぃ:"i",ぅ:"u",ぇ:"e",ぉ:"o",ゃ:"ya",ゅ:"yu",ょ:"yo",ワ:"wa",ヰ:"wi",ヱ:"we",ヲ:"wo",ラ:"ra",リ:"ri",ル:"ru",レ:"re",ロ:"ro",ヤ:"ya",ユ:"yu",ヨ:"yo",マ:"ma",ミ:"mi",ム:"mu",メ:"me",モ:"mo",ハ:"ha",ヒ:"hi",フ:"hu",ヘ:"he",ホ:"ho",ナ:"na",ニ:"ni",ヌ:"nu",ネ:"ne",ノ:"no",タ:"ta",チ:"ti",ツ:"tsu",テ:"te",ト:"to",サ:"sa",シ:"si",ス:"su",セ:"se",ソ:"so",カ:"ka",キ:"ki",ク:"ku",ケ:"ke",コ:"ko",ア:"a",イ:"i",ウ:"u",エ:"e",オ:"o",ァ:"a",ィ:"i",ゥ:"u",ェ:"e",ォ:"o",ャ:"ya",ュ:"yu",ョ:"yo",ヶ:"ke",ヵ:"ka",ん:"n",ン:"n",ー:"-",';
// var data = "a i u e o ka ki ku ke ko kya kyu kyo sa shi su se so sha shu sho ta chi tsu te to cha chu cho na ni nu ne no nya nyu nyo ha hi fu he ho hya hyu hyo ma mi mu me mo mya myu myo ya i yu e yo ra ri ru re ro rya ryu ryo wa i u e o n ga gi gu ge go gya gyu gyo za ji zu ze zo ja ju jo da ji zu de do ja ju jo ba bi bu be bo bya byu byo pa pi pu pe po pya pyu pyo pause (no sound)"
// row = data.replace(" ", ",");
// var data = "a,i,u,e,o,ka,ki,ku,ke,ko,kya,kyu,kyo,sa,shi,su,se,so,sha,shu,sho,ta,chi,tsu,te,to,cha,chu,cho,na,ni,nu,ne,no,nya,nyu,nyo,ha,hi,fu,he,ho,hya,hyu,hyo,ma,mi,mu,me,mo,mya,myu,myo,ya,i,yu,e,yo,ra,ri,ru,re,ro,rya,ryu,ryo,wa,i,u,e,o,n,ga,gi,gu,ge,go,gya,gyu,gyo,za,ji,zu,ze,zo,ja,ju,jo,da,ji,zu,de,do,ja,ju,jo,ba,bi,bu,be,bo,bya,byu,byo,pa,pi,pu,pe,po,pya,pyu,pyo";
var data = 'あ:"a",い:"i",う:"u",え:"e",お:"o",か:"ka",が:"ga",き:"ki",きゃ:"kya",きゅ:"kyu",きょ:"kyo",ぎ:"gi",ぎゃ:"gya",ぎゅ:"gyu",ぎょ:"gyo",く:"ku",ぐ:"gu",け:"ke",げ:"ge",こ:"ko",ご:"go",さ:"sa",ざ:"za",し:"si",しゃ:"sha",しゅ:"shu",しょ:"sho",じ:"ji",じゃ:"ja",じゅ:"ju",じょ:"jo",す:"su",ず:"zu",せ:"se",ぜ:"ze",そ:"so",ぞ:"zo",た:"ta",だ:"da",ち:"ti",ちゃ:"cha",ちゅ:"chu",ちょ:"cho",ぢ:"di",ぢゃ:"dya",ぢゅ:"dyu",ぢょ:"dyo",つ:"tsu",づ:"du",て:"te",で:"de",と:"to",ど:"do",な:"na",に:"ni",にゃ:"nya",にゅ:"nyu",にょ:"nyo",ぬ:"nu",ね:"ne",の:"no",は:"ha",ば:"ba",ぱ:"pa",ひ:"hi",ひゃ:"hya",ひゅ:"hyu",ひょ:"hyo",び:"bi",びゃ:"bya",びゅ:"byu",びょ:"byo",ぴ:"pi",ぴゃ:"pya",ぴゅ:"pyu",ぴょ:"pyo",ふ:"hu",ふぁ:"fa",ふぃ:"fi",ふぇ:"fe",ふぉ:"fo",ふゃ:"fya",ふゅ:"fyu",ふょ:"fyo",ぶ:"bu",ぷ:"pu",へ:"he",べ:"be",ぺ:"pe",ほ:"ho",ぼ:"bo",ぽ:"po",ま:"ma",み:"mi",みゃ:"mya",みゅ:"myu",みょ:"myo",む:"mu",め:"me",も:"mo",や:"ya",ゆ:"yu",よ:"yo",ら:"ra",り:"ri",りゃ:"rya",りゅ:"ryu",りょ:"ryo",る:"ru",れ:"re",ろ:"ro",わ:"wa",ゐ:"wi",ゑ:"we",を:"wo",ん:"n"';
row = data.split(",")


for (var i = 0; i < row.length; i++) {
	var currRow = row[i].split(":");
	currRow[0] = "\"" + currRow[0] + "\"";
	console.log(currRow[1] + ",");
}
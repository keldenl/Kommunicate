![kuroshiro](http://hexenq.com/kuroshiro/kuroshiro.png)

# kuroshiro

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)

kuroshiroは日本語文をローマ字や仮名なとに変換できるライブラリです。フリガナ・送り仮名の機能も搭載します。

*ほかの言語：[English](README.md), [日本語](README.jp.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md)。*

## デモ
オンラインデモは[こちら](http://hexenq.com/kuroshiro/demo/index.html)です。初期化は少し時間がかかります、少々待ちください。

## バッジョン1.xでの重大な変更
- 形態素解析器がルビロジックから分離される。それゆえ、様々な形態素解析器（レディーメイドもカスタマイズも）を利用できることになります。
- ES2017の新機能「async/await」を利用します
- CommonJSからES Modulesへ移行します
    
## 形態素解析器プラグイン
*始まる前にプラグインの適合性をチェックしてください*

| 解析器 | Node.js サポート | ブラウザ サポート | レポジトリ | 開発者 |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API|✓|✓|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

## 使い方
### Node.js
npmでインストール:
```sh
$ npm install kuroshiro
```

kuroshiroをロードします:

*ES6 Module `import` と CommonJS `require`、どちらでもOK*
```js
import * as Kuroshiro from "kuroshiro";
```

インスタンス化します:
```js
const kuroshiro = new Kuroshiro();
```

形態素解析器のインスタンスを引数にしてkuroshiroを初期化する:
```js
// 这里使用了async/await, 你同样也可以使用Promise
await kuroshiro.init(new KuromojiAnalyzer());
```

変換の実行:
```js
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```

### ブラウザ
`dist/kuroshiro.min.js`を導入し、そしてHTMLに:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

インスタンス化します:
```js
var kuroshiro = new Kuroshiro();
```

形態素解析器のインスタンスを引数にしてkuroshiroを初期化するから，変換を実行します:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
```

## APIの説明
### コンストラクタ
__例__

```js
const kuroshiro = new Kuroshiro();
```

### インスタンス関数
#### init(analyzer)
形態素解析器のインスタンスを引数にしてkuroshiroを初期化する。前述の[形態素解析器プラグイン](#形態素解析器プラグイン)を利用できます。形態素解析器の初期化方法は各自のドキュメントを参照してください。

__引数__

* `analyzer` - 形態素解析器のインスタンス。

__例__

```js
await kuroshiro.init(new KuromojiAnalyzer());
```

#### convert(str, [options])
文字列を目標音節文字に変換します（変換モードが設置できます）。

__引数__

* `str` - 変換される文字列。
* `options` - *任意* 変換のパラメータ。下表の通り。

| オプション | タイプ | デフォルト値 | 説明 |
|---|---|---|---|
| to | String | 'hiragana' | 目標音節文字<br />`hiragana` (ひらがな),<br />`katakana` (カタカナ),<br />`romaji` (ローマ字) |
| mode | String | 'normal' | 変換モード<br />`normal` (一般),<br />`spaced` (スペースで組み分け),<br />`okurigana` (送り仮名),<br />`furigana` (フリガナ) |
| delimiter_start | String | '(' | 区切り文字 (始め) |
| delimiter_end | String | ')' | 区切り文字 (終り) |

__例__

```js
// normal (一般)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced (スペースで組み分け)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana (送り仮名)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana (フリガナ)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"furigana", to:"hiragana"});
// 結果: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

### 実用ツール
__例__
```js
Kuroshiro.Util.isHiragana("あ"));
```
#### isHiragana(input)
inputはひらがなかどうかを判断します。

#### isKatakana(input)
inputはカタカナかどうかを判断します。

#### isKana(input)
inputは仮名かどうかを判断します。

#### isKanji(input)
inputは漢字かどうかを判断します。

#### isJapanese(input)
inputは日本語かどうかを判断します。

#### hasHiragana(input)
inputにひらがながあるかどうかを確認する。

#### hasKatakana(input)
inputにカタカナがあるかどうかを確認する。

#### hasKana(input)
inputに仮名があるかどうかを確認する。

#### hasKanji(input)
inputに漢字があるかどうかを確認する。

#### hasJapanese(input)
inputに日本語があるかどうかを確認する。

## 貢献したい方
[CONTRIBUTING](CONTRIBUTING.md) を参考にしてみてください。

## 感謝
- kuromoji
- wanakana

## ライセンス
MIT
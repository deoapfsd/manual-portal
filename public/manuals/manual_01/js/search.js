//HTMLファイル格納パス
let htmlpath = './';

// Base64でコード
const Base64 = {
    encode: function(str) {
        return btoa(unescape(encodeURIComponent(str)));
    },
    decode: function(str) {
        return decodeURIComponent(escape(atob(str)));
    }
};

// --------------------
// 検索ボタン押下時処理
// --------------------
function openSearchResult(){
	const key = $('#searchText').val().trim();
	if (!key){
		// 検索キーワードが空の場合、パラメータなし
		window.open('search.html', '_self');
		return;
	}
	window.open('search.html?key=' + encodeURIComponent(key), '_self');
}

// --------------------
// 画面表示時処理
// --------------------
$(document).ready( function(){
	let params = getURLParams(document.location.search)
    if (params == null){
    	return;
    }
	// パラメータの数で処理が分かれる
	if (params !== false && Object.keys(params).length > 1){
		// ハイライト(load時に実行)
		return;
	}
	// 検索
	return search(params['key']);
});

// --------------------
// 画面表示時処理(画像読み込み後)
// --------------------
$(window).on('load', function() {
	let params = getURLParams(document.location.search)
    if (params == null){
    	return;
    }
	if (params !== false && Object.keys(params).length > 1){
		// ハイライト
		return setHighlight(params);
	}
});

// --------------------
// 検索用
// --------------------
// 検索
// - テキストキャッシュを検索、位置を取得
// - 位置からインデックスキャッシュを検索、タグ名と何個目のタグかを取得
// - 検索結果を検索表示に反映
function search(key){
	// 検索キーワード取得
	// const key = $('#searchText').val().trim();
	if (!key){
		// 検索キーワードが空の場合はなにもしない
    	showResultTextTitle();
    	return;
	}

	// 結果表示用テキスト
	let resulttext = showResultTextTitle(key);
	// キャッシュテキストをBase64デコード
	const decodeddata = Base64.decode(cachedata);

	let position = 0;
	let doneparagraph = [];
	let tagposition = '';
	let regexp = createRegExp(key);
	// テキストキャッシュから検索キーワードが見つかるまで検索実行
	while ((regarray = regexp.exec(decodeddata)) !== null){
		position = regarray.index;
 		// インデックスキャッシュから段落を取り出す
		for (i = 0; i< indexdata.length; i++){
			if (position >= indexdata[i][0] && position <= indexdata[i][1]){
				// 段落テキスト
				paragraph = decodeddata.substring(indexdata[i][0], indexdata[i][1]+1);
				// 取り出した段落テキストに検索キーワードが含まれなければ処理しない
				if (createRegExp(key).test(paragraph) == false) break;
				// 取り出した段落テキストが見出しを持たないページの場合処理しない
				if (indexdata[i][5] === '') break;
				// 段落(タグ)位置
				tagposition = indexdata[i][2] + indexdata[i][3] + indexdata[i][4];
				if (doneparagraph.indexOf(tagposition) == -1){
					// 段落がすでに処理されていない場合、段落から検索結果を取得
					let extracttext = searchParagraphCache(paragraph, indexdata, key);
					resulttext += extracttext;
					doneparagraph.push(tagposition);
				}
			}
		}
	}

	// 結果表示
	//$('#result').html(resulttext);
	showResultTextTitle(key, resulttext);
}

// 結果表示
function showResultTextTitle(key, resulttext)
{
	if (typeof key === 'undefined') key = '';
	if (typeof resulttext === 'undefined') resulttext = '';
	if (resulttext == '') {
		resulttext = '<h2 class="WS_H_N1">' + jQuery('<span/>').text(key).html() + '&nbsp;' + $('#main #topicpath ol li').text() + '</h2>';
	}
	// 結果表示
	$('#result').html(resulttext);
	return resulttext;
}

// 正規表現を作成
function createRegExp(key){
	// 検索キーワードをエスケープ処理
	let str = key.replace(/[\\^$.*?+()[\]{}|]/g, '\\$&');
	// 検索キーワードを全角から半角へ
	let strhalf = convertToHalfWidth(key);
	// 検索キーワードを半角から全角へ
	let strfull = convertToFullWidth(key);
	// 検索キーワードを追加変換
	let strex = convertToAdditionalChar(key);

	// 4通りを検索（検索キーワード、半角検索キーワード、全角キーワード、追加）
	return new RegExp((str + '|' + strhalf + '|' + strfull + '|' + strex), 'gi');
}

// 全角英数記号を半角英数記号へ
function convertToHalfWidth(str)
{
	/*
	//英数字記号を変換 エスケープ ワイルドカードを実装しないので*?はエスケープ
	str = str.replace(/[！-～]/g, function(tmpStr) {
		// 文字コードをシフト
		return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
	});
	*/

	// 全角半角を区別しない句読点などの文字
	// 　（全角スペース）		U+3000	→	 （半角スペース）		U+0020
	// ￥						U+FFE5	→	\						U+005C
	// ”(二重引用符)			U+201D	→	"(引用符)				U+0022
	// “(二重引用符)			U+201C	→	"(引用符)				U+0022
	// ’(単一引用符)			U+2019	→	 '(アポストロフィー)	U+0027
	// ‘(単一引用符)			U+2018	→	 '(アポストロフィー)	U+0027
	// ○						U+25CB	→	￮						U+FFEE
	// ↑						U+2191	→	￪						U+FFEA
	// ↓						U+2193	→	￬						U+FFEC
	// →						U+2192	→	￫						U+FFEB
	// ←						U+2190	→	￩						U+FFE9
	str = str.replace(/　/g, " ")
		.replace(/￥/g, "\\")
		.replace(/”/g, "\"")
		.replace(/“/g, "\"")
		.replace(/’/g, "'")
		.replace(/‘/g, "'")
		.replace(/○/g, "￮")
		.replace(/↑/g, "￪")
		.replace(/↓/g, "￬")
		.replace(/→/g, "￫")
		.replace(/←/g, "￩");

	// /記号をエスケープ処理
	str = str.replace(/[\\^$.*?+()[\]{}|]/g, '\\$&');

	//対応表を使用して全半角変換
	str = convertCharWidth(str, 1);

	return str;
}

// 半角英数字記号を全角英数字記号へ
function convertToFullWidth(str)
{
	/*
	//英数字記号を変換 エスケープ ワイルドカードを実装しないので*?はエスケープ
	str = str.replace(/[!-~]/g, function(tmpStr) {
		// 文字コードをシフト
		return String.fromCharCode( tmpStr.charCodeAt(0) + 0xFEE0 );
	});
	*/

	// 全角半角を区別しない句読点などの文字
	//  （半角スペース）		U+0020	→	　（全角スペース）		U+3000
	// \						U+005C	→	￥						U+FFE5
	// ¥						U+00A5	→	￥						U+FFE5
	// "(引用符)				U+0022	→	”(二重引用符)			U+201D
	//  '(アポストロフィー)		U+0027	→	’(単一引用符)			U+2019
	// ￮						U+FFEE	→	○						U+25CB
	// ￪						U+FFEA	→	↑						U+2191
	// ￬						U+FFEC	→	↓						U+2193
	// ￫						U+FFEB	→	→						U+2192
	// ￩						U+FFE9	→	←						U+2190
	str = str.replace(/ /g, "　")
		.replace(/\\/g, "￥")
		.replace(/¥/g, "￥")
		.replace(/"/g, "”")
		.replace(/'/g, "’")
		.replace(/￮/g, "○")
		.replace(/￪/g, "↑")
		.replace(/￬/g, "↓")
		.replace(/￫/g, "→")
		.replace(/￩/g, "←");

	// /記号をエスケープ処理
	str = str.replace(/[\\^$.*?+()[\]{}|]/g, '\\$&');

	//対応表を使用して全半角変換
	str = convertCharWidth(str, 0);

	return str;
}

// 追加変換
function convertToAdditionalChar(str)
{
	let convarray = [
		// 全角半角を区別しない句読点などの文字
		// '(アポストロフィー)	U+0027	→	 ‘(単一引用符)			U+2018
		["’","‘"],
		// 全角半角を区別しない句読点などの文字
		//  "(引用符)			U+0022	→	 “(二重引用符)			U+201C
		["\"","“"],
		// 全角どおしで区別しない句読点などの文字
		// ’(単一引用符)		U+2019	→	‘(単一引用符)			U+2018
		["'","‘"],
		// 全角どおしで区別しない句読点などの文字
		// ‘(単一引用符)		U+2018	→	’(単一引用符)			U+2019
		["‘","’"],
		// 全角どおしで区別しない句読点などの文字
		// ”(二重引用符)		U+201D	→	“(二重引用符)			U+201C
		["”","“"],
		// 全角どおしで区別しない句読点などの文字
		// “(二重引用符)		U+201C	→	”(二重引用符)			U+201D
		["“","”"],
		// 全角半角を区別しない句読点などの文字
		// ￥					U+FFE5	→	 ¥						U+00A5
		["￥","¥"],
		// 半角どおしで区別しない句読点などの文字
		// \					U+005C	→	 ¥						U+00A5
		["\\","¥"],
		// 半角どおしで区別しない句読点などの文字
		//  ¥					U+00A5	→	\						U+005C
		["¥","\\"]
	]

	let exparray = [];
	for(let i = 0; i < convarray.length; i++) {
		exparray.push(str.replace(convarray[i][0], convarray[i][1])
			.replace(/[\\^$.*?+()[\]{}|]/g, '\\$&'));
	}

	return exparray.join("|");
}

// 対応表を使用して全角/半角に変換
//- パラメータ
//- str:変換対象文字列
//- type: 0:半角から全角 1:全角から半角
//- 戻り値
//- 変換結果
function convertCharWidth(str, type) {
	let chr = [
	//カタカナ
	/*['ｶﾞ', 'ガ'],['ｷﾞ', 'ギ'],['ｸﾞ', 'グ'],['ｹﾞ', 'ゲ'],['ｺﾞ', 'ゴ'],
	['ｻﾞ', 'ザ'],['ｼﾞ', 'ジ'],['ｽﾞ', 'ズ'],['ｾﾞ', 'ゼ'],['ｿﾞ', 'ゾ'],
	['ﾀﾞ', 'ダ'],['ﾁﾞ', 'ヂ'],['ﾂﾞ', 'ヅ'],['ﾃﾞ', 'デ'],['ﾄﾞ', 'ド'],
	['ﾊﾞ', 'バ'],['ﾊﾟ', 'パ'],['ﾋﾞ', 'ビ'],['ﾋﾟ', 'ピ'],['ﾌﾞ', 'ブ'],
	['ﾌﾟ', 'プ'],['ﾍﾞ', 'ベ'],['ﾍﾟ', 'ペ'],['ﾎﾞ', 'ボ'],['ﾎﾟ', 'ポ'],
	['ｳﾞ', 'ヴ'],['ｰ', 'ー'],['ｧ', 'ァ'],['ｱ', 'ア'],['ｨ', 'ィ'],
	['ｲ', 'イ'],['ｩ', 'ゥ'],['ｳ', 'ウ'],['ｪ', 'ェ'],['ｴ', 'エ'],
	['ｫ', 'ォ'],['ｵ', 'オ'],['ｶ', 'カ'],['ｷ', 'キ'],['ｸ', 'ク'],
	['ｹ', 'ケ'],['ｺ', 'コ'],['ｻ', 'サ'],['ｼ', 'シ'],['ｽ', 'ス'],
	['ｾ', 'セ'],['ｿ', 'ソ'],['ﾀ', 'タ'],['ﾁ', 'チ'],['ｯ', 'ッ'],
	['ﾂ', 'ツ'],['ﾃ', 'テ'],['ﾄ', 'ト'],['ﾅ', 'ナ'],['ﾆ', 'ニ'],
	['ﾇ', 'ヌ'],['ﾈ', 'ネ'],['ﾉ', 'ノ'],['ﾊ', 'ハ'],['ﾋ', 'ヒ'],
	['ﾌ', 'フ'],['ﾍ', 'ヘ'],['ﾎ', 'ホ'],['ﾏ', 'マ'],['ﾐ', 'ミ'],
	['ﾑ', 'ム'],['ﾒ', 'メ'],['ﾓ', 'モ'],['ｬ', 'ャ'],['ﾔ', 'ヤ'],
	['ｭ', 'ュ'],['ﾕ', 'ユ'],['ｮ', 'ョ'],['ﾖ', 'ヨ'],['ﾗ', 'ラ'],
	['ﾘ', 'リ'],['ﾙ', 'ル'],['ﾚ', 'レ'],['ﾛ', 'ロ'],['ﾜ', 'ヮ'],
	['ﾜ', 'ワ'],['ｲ', 'ヰ'],['ｴ', 'ヱ'],['ｦ', 'ヲ'],['ﾝ', 'ン'],
	['ｶ', 'ヵ'],['ｹ', 'ヶ'],
	*/
	];
	for(let i = 0; i < chr.length; i++) {
		str = str.replace(new RegExp(chr[i][type], 'g'), chr[i][1 - type]);
	}
	return str;
}

// 段落から検索結果を取得
// - 段落から検索結果を作成し、返却
// - パラメータ
// - paragraph:Base64でコード済キャッシュテキストから取り出した段落
// - indexdata:インデックスキャッシュ
// - key:検索キーワード
// - 戻り値
// - 検索結果(HTMLテキスト)
function searchParagraphCache(paragraph, indexdata, key){
	let resulttext = '';
	let keypositions = '';
	let keylength = '';
	let regarray;
	let regexp = createRegExp(key);
	// 段落(タグ)テキストキャッシュから検索キーワード位置と長さをすべて取り出す
	while ((regarray = regexp.exec(paragraph)) !== null){
		keypositions += ',' + regarray.index;
		keylength += ',' + (Number(regexp.lastIndex) - Number(regarray.index));
	}
	// 検索キーワードを太字に設定
	paragraph = paragraph.replace(regexp, '<strong>' + '$&' + '</strong>')
	let paragraphtext = jQuery('<span/>').text(paragraph).html();
	paragraphtext = paragraphtext.replace(/&lt;strong&gt;/g, '<strong>').replace(/&lt;\/strong&gt;/g, '</strong>');
	// 検索結果(HTMLテキスト)を生成
	resulttext = '<div class="search_area"><p><a href="' + htmlpath + indexdata[i][4]
		+ '?key=' + encodeURIComponent(key)
		+ '&tag=' + indexdata[i][2]
		+ '&position=' + indexdata[i][3]
		+ '&keyposition=' + keypositions.slice(1)
		+ '&keylength=' + keylength.slice(1)
		+ '" target="_blank">'
		+ Base64.decode(indexdata[i][5]) + '</a></p><p>' + paragraphtext + '</p></div>';
	return resulttext;
}

// --------------------
// ハイライト表示用
// --------------------
// ハイライト開始タグ
const HLSTAG = '<strong class="highlight">';
const HLETAG = '</strong>';
// ハイライト設定
function setHighlight(params){

    // パラメータから検索キーワード取得
	let key = params['key'];
	// パラメータからタグ位置取得
	let position = params['position'];
	// パラメータからタグ名取得
	let tag = params['tag'];
	// パラメータから検索キーワード位置取得
	let keyposition = params['keyposition'];
	// パラメータから検索キーワード長さ取得
	let keylength = params['keylength'];

	// 検索キーワードがある場合
	if (key) {
		let tags = $('#main_contents').find(tag);
		// 検索キーワードを含む本文エレメントを取得
		let tagelm = tags[position];

		// 検索キーワードの一文字ずつにハイライトタグを設定
		// 検索キーワード位置にハイライトタグを設定した配列１を取得
		let keypositions = getKeyPositionArray(tagelm, key, keyposition, keylength);

		// 配列１に、本文と本文に含まれるタグを埋め込んむだ配列２を取得
		let htmls = [];
		getHtmlArray(tagelm, keypositions, htmls, false);

		// 配列２を文字列に結合してHTMLテキストとして反映
		tagelm.innerHTML = htmls.join('');

		// タグ位置付近にスクロール移動
		let p = $(tagelm).offset().top;
		// トップメニューがない場合の処理に修正（2020/9/10 大島）
//		let t = ($('header').height() + $('nav').height()) * 2;// *2は微調整
		let t = ($('header').height()) * 2;// *2は微調整
		$('html,body').animate({ scrollTop: p-t }, 'fast');

	}
}

// 検索キーワード位置にハイライトタグを設定した配列１を返却
// - パラメータ
// - tagelm:タグElement
// - key:検索キーワード
// - keyposition:検索キーワード位置
// - keylength:検索キーワード長さ
// - 戻り値
// - 配列１[本文位置][0]="ハイライト開始タグ"
// - 配列１[本文位置][1]="ハイライト終了タグ"
function getKeyPositionArray(tagelm, key, keyposition, keylength){
	let keypositions = [];
	let text = tagelm.textContent;
	let keypos = keyposition.split(',');
	let keylen = keylength.split(',');
	let textdone = 0;
	let trimnum = 0;
	if (typeof text.trimStart == 'undefined') {
		let spacelength = 0;
		for(let l = 0; l < text.length; l++) {
			if (text.charAt(l) == ' '
				|| text.charAt(l) == '\n'
				|| text.charAt(l) == '\t'
				|| text.charAt(l) == '\v'
				|| text.charAt(l) == '\f'
				|| text.charAt(l) == '\b'
				|| text.charAt(l) == '\r'
				|| text.charAt(l) == '\"'
				|| text.charAt(l) == '\''
				|| text.charAt(l) == '\\'
				) {
				spacelength++;
			} else {
				break;
			}
		}
		trimnum = text.length - (text.length - spacelength);
	} else {
		trimnum = text.length - text.trimStart().length;
	}
	// タグが階層になっているとtextContentでテキストを取得すると改行/タブが混入している
	// 先頭の改行/タブをずらしておく
	for(let k = 0; k < trimnum; k++) {
		keypositions.push(['','']);
	}
	for(let i = 0; i < keypos.length; i++){
		for(let j = textdone; j < text.length; j++){
			if (Number(keypos[i]) == j){
				// 検索キーワードの配列は[<ハイライト開始タグ>,</ハイライト終了タグ>]を設定
				let keycnt = Number(keylen[i]);
				for (let i = 0; i < keycnt; i++){
					keypositions.push([HLSTAG,HLETAG]);
				}
				textdone = j + keycnt;
				break;
			}
			// ハイライト以外の配列には['','']を設定
			keypositions.push(['','']);
		}
	}
	if (keypositions.length < text.length){
		// ハイライト位置を付け終わった以降の配列には['','']を設定
		let remainlen = text.length - keypositions.length;
		for (let i = 0; i < remainlen; i++){
			keypositions.push(['','']);
		}
	}
	return keypositions;
}

// 本文と本文に含まれるタグを埋め込んむだ配列を返却
// - パラメータ
// - tagelm:タグElement
// - keypositions:検索キーワード位置にハイライトタグを設定した配列１
// - htmls:本文と本文に含まれるタグとハイライトを埋め込んだ配列２
// - exist:本文に含まれるタグがあるか
// - 戻り値
// - 配列２[本文位置]="本文と本文に含まれるタグとハイライトを埋め込んだHTMLテキスト"
function getHtmlArray(tagelm, keypositions,  htmls, exist){
	let chnodes = $(tagelm).contents();
	for(let i = 0; i < chnodes.length; i++){
		if (chnodes[i].nodeType == 1){
			if (chnodes[i].childNodes.length == 0){
				// 本文に含まれる本体しかないタグはここで埋め込み 例：<br/>など
				if (chnodes[i].className !== ''){
					htmls[htmls.length -1] = htmls[htmls.length -1] + '<' + chnodes[i].tagName + ' class="' + chnodes[i].className  + '"></' + chnodes[i].tagName + '>';
				} else {
					htmls[htmls.length -1] = htmls[htmls.length -1] + '<' + chnodes[i].tagName + '/>';
				}
				htmls = getHtmlArray(chnodes[i], keypositions, htmls, true);
			} else {
				// 本文に含まれるタグは配下を文字列として取り出す
				htmls = getHtmlArray(chnodes[i], keypositions, htmls, true);
			}
		} else {
			let text = chnodes[i].data;
			// 開始タグ取得
			let starthtml = getStartTagHTML(chnodes[i].parentNode, exist);
			// 終了月取得
			let endhtml = getEndTagHTML(chnodes[i].parentNode, exist);
			for(let j = 0; j < text.length; j++){
				// 本文に含まれるタグとハイライトを含めて文字列として取得、配列に設定
				htmls.push(getTagHTML(text, j, keypositions, htmls, starthtml, endhtml));
			}
			exist = false;
		}
	}
	return htmls;
}

// 本文中に含まれる開始タグを文字列として返却
function getStartTagHTML(chnode, exist){
	if (!exist) return '';
	let starthtml = "<" + chnode.tagName;
	for (let k = 0; k < chnode.attributes.length; k++){
		starthtml += " " + chnode.attributes[k].name + "=\"" + chnode.attributes[k].value + "\"";
	}
	starthtml += ">";
	return starthtml;
}

// 本文中に含まれる終了タグを文字列として返却
function getEndTagHTML(chnode, exist){
	if (!exist) return '';
	return "</" + chnode.tagName + ">";
}

// 本文に含まれるタグとハイライトタグを含めて文字列として返却
function getTagHTML(text, j, keypositions, htmls, starthtml, endhtml){
	let contenttext = keypositions[htmls.length][0] + jQuery('<span/>').text(text[j]).html() + keypositions[htmls.length][1];

	if (j == 0 && text.length == 1){
		return starthtml + contenttext + endhtml;
	}
	if (j == 0){
		return starthtml + contenttext;
	}
	if (j == text.length - 1){
		return contenttext + endhtml;
	}
	return contenttext;
}

// URLパラメータ取得
function getURLParams (path) {
    if (!path) return false;

    var param = path.match(/\?([^?]*)$/);

    if (!param || param[1] === '') return false;

    var tmpParams = param[1].split('&');
    var keyValue  = [];
    var params    = {};

    for (var i = 0, len = tmpParams.length; i < len; i++) {
        keyValue = tmpParams[i].split('=');
        params[keyValue[0]] = decodeURIComponent(keyValue[1]);
    }

    return params;
};


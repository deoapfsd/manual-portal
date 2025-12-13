function this_content() {

	var menu_index;
	var isCheck;

	var head_menu_num = $('nav ul li');
	for ( var i = 1; i < head_menu_num.length; i++ ) {
		var doc = document.getElementById(head_menu_num[i].children[0].id);
		if (doc != null) {
			isCheck = doc.checked;
			if (isCheck == true) {
				document.getElementById(head_menu_num[i].children[1].id).style.backgroundColor = "#e6bbc9";
			}
		}
	}

	// 現在のファイル名を取得して、index.htmlだった場合、min-heightを0に設定する
	var this_file = document.location.href.split('/').pop();
//	alert( this_file );
	if ( this_file == "index.html") {
		var elements = document.getElementsByClassName("WS_P_0");
		for( var i = 0; i < elements.length; i++ ) {
			elements[i].style.minHeight = 0;
		}
	}
}

function menu_toggle() {
	var isCheck = document.getElementById( "menu-toggle" ).checked;

//	if (window.matchMedia('(max-width: 679px)').matches) {
		// ウィンドウサイズが679px以下の場合の処理
/*		document.getElementById( "side_menu" ).style.width = "75%";*/
/*		if ( isCheck == true ) {
			document.getElementById( "side_menu" ).style.display = "block";

			document.getElementById( "menu-toggle" ).checked = false;
		} else {
			document.getElementById( "side_menu" ).style.display = "none";

			document.getElementById( "menu-toggle" ).checked = true;
		}
	} else if (window.matchMedia('(min-width:680px)').matches) {*/
		// ウィンドウサイズが1001px以上の場合の処理
//		if (window.matchMedia('(min-width:1001px)').matches) {
/*			document.getElementById( "side_menu" ).style.width = "200px";*/
//		} else {
/*			document.getElementById( "side_menu" ).style.width = "20%";*/
//		}
		if ( isCheck == true )
		{
			document.getElementById( "side_menu" ).style.display = "none";

			if (window.matchMedia('(min-width:1001px)').matches)
			{
				// ウィンドウサイズが1001px以上の場合の処理
				document.getElementById( "main" ).style.marginLeft = "20px";
				document.getElementById( "nav_wrap" ).style.marginLeft = "20px";
				document.getElementById( "topicpath" ).style.paddingLeft = "20px";
			}
			else
			{
				document.getElementById( "main" ).style.marginLeft = "2%";
				document.getElementById( "nav_wrap" ).style.marginLeft = "2%";
				document.getElementById( "topicpath" ).style.paddingLeft = "2%";
			}

			document.getElementById( "menu-toggle" ).checked = false;
		}
		else
		{
			document.getElementById( "side_menu" ).style.display = "block";
			
			document.getElementById( "main" ).style.marginLeft = "";
			document.getElementById( "nav_wrap" ).style.marginLeft = "";
			document.getElementById( "topicpath" ).style.paddingLeft = "";

			document.getElementById( "menu-toggle" ).checked = true;
		}
//	}

}

$(function () {
	var html_nm = document.location.pathname.split('/').pop();		//htmlファイル名
	var html_id = '';												//内部リンクID
	var html_str = '';												//リンク文字列(htmlファイル名 + # + 内部リンクID)

	let params = getURLParams(document.location.search);			//search.jsの関数を使用
	if (params == false) {
		//通常の画面遷移
		html_id = location.href.split('#').pop();	//内部リンクID
	} else {
		//検索結果画面からの遷移
		let tags = $('#main_contents').find(params['tag']);
		let tagelm = tags[params['position']];		//ハイライトするタグ
		if (params['tag'] != 'h1' && params['tag'] != 'h2' && params['tag'] != 'h3' && params['tag'] != 'h4') {
			//検索対象タグがHタグ以外の場合、一番近い(前)のhタグを探し、そのid属性値を取得
			// 検索キーワードを含む本文エレメントを取得
			if ($(tagelm).prevAll('h4:first').length != 0) {
				html_id = $(tagelm).prevAll('h4:first').attr('id');
			} else if ($(tagelm).prevAll('h3:first').length != 0) {
				html_id = $(tagelm).prevAll('h4:first').attr('id');
			} else if ($(tagelm).prevAll('h2:first').length != 0) {
				html_id = $(tagelm).prevAll('h4:first').attr('id');
			}
		} else {
			//hタグの場合はそのid属性値を取得
			html_id = $(tagelm).attr('id');
		}
	}
	html_str = html_nm + '#' + html_id;		//リンク文字列
	
	//console.log('html_nm' + html_nm);
	//console.log('html_id' + html_id);
	//console.log('html_str' + html_str);
	
	var div = $("#side_menus");
	var p_div;
	var p_ul;
	
	var op_ul1;
	var op_ul2;
	var op_ul3;
	
	var sel_a;
	
	if (html_id!=undefined) {
		//リンクから飛んできた場合
		$.each(div.find("a"), function(idx, a) {
			if ($(a).attr("href") == html_str) {
				p_ul = $(a).closest("ul");
				p_div = $(a).closest("div");
				sel_a = a;
				return false;
			}
		});
	} else {
		//htmlを直接起動
		$.each(div.find("a"), function(idx, a) {
			if ($(a).attr("href").indexOf(html_nm)==0) {
				p_ul = $(a).closest("ul");
				p_div = $(a).closest("div");
				sel_a = a;
				return false;
			}
		});
	}
	
	if (html_nm!="index.html" && sel_a!=undefined) {
		//選択メニュ―に背景色を付ける
		var pa = $(sel_a).parent();
		if ($(pa).prop("tagName")=="LI") {
            $(pa).css('background-color','#ffefea');		//表示メニューに背景色を付ける
		} else {
			if ($(pa).attr('class').indexOf('chapter')!== -1) {
                $(pa).css('background-color','#ffefea');		//表示メニューに背景色を付ける
			} else {
                $(sel_a).closest('li').css('background-color','#ffefea');		//表示メニューに背景色を付ける
			}
		}
	}
	
	//要素が見つかった場合、再度メニューをアクティブ
	if (p_ul!=undefined) {
		var cnt = 0;
		do {
			if ($(p_ul).hasClass("inner") || $(p_ul).hasClass("inner2")) {
				$(p_ul).slideToggle();
				var tag = $(p_ul).prev();
				if ($(tag).prop("tagName")=="LI") {
					$(p_ul).prev('li').find('div').addClass('active');
				} else {
					$(p_ul).prev('div').addClass('active');
				}
				
				if ($(p_ul).hasClass("inner")) {
					//console.log("breakします。");
					break;
				}
				
				p_ul = $(p_ul).prev("li").closest("ul");
				cnt++;
				if (cnt==3) {
					break;
				}
			} else {
				break;
			}
		} while (!$(p_ul).closest("div").hasClass("side_menus"));

		//メニューを移動させる
		var top_pos = pa[0].offsetTop - 200
		$('#side_menus').animate({ scrollTop: top_pos }, 500);
	}
	
	
	//アコーディオンの動き
	$('.accordion div.arrow').click(function(){
		accordion_open(this);
	});
	
	//アコーディオンのKeydown
	$('.accordion div.arrow').keydown(function(){
		if (event.ctrlKey) {
			if (e.keyCode === 13) {
				void(0);
				accordion_open(this);
				return false;
			}
		}
	});
	
	//accordionクラスのdiv要素がフォーカスされている時にキーダウンされた時の処理
	function accordion_open(ctrl) {
		if($(ctrl).hasClass('top_chapter')){
			//1階層
			ul = $(ctrl).next('.accordion .inner');
			$(".accordion div.arrow").not(ctrl).removeClass("active");
			$(".accordion ul ul").not(ul).slideUp(300);
		} else {
			//それ以下
			ul = $(ctrl).parent().next('.accordion .inner2');
			div1 = $(ctrl).closest('ul.inner').prev('div');
			div2 = $(ctrl).closest('ul.inner2').prev('li').find('div');
			in1  = $(ctrl).closest('ul.inner');
			in2  = $(ctrl).closest('ul.inner2');
			if (div2.length==0) {
				$(".accordion div.arrow").not(ctrl).not(div1).removeClass("active");
				$(".accordion ul ul").not(ul).not(in1).slideUp(300);
			} else {
				$(".accordion div.arrow").not(ctrl).not(div1).not(div2).removeClass("active");
				$(".accordion ul ul").not(ul).not(in1).not(in2).css('background-color',"red");
				$(".accordion ul ul").not(ul).not(in1).not(in2).slideUp(300);
			}
			
		}
		$(ctrl).toggleClass('active');
		$(ul).slideToggle();
	}
//★2022/07　コメントアウト ST
//	
//	// accordionクラスのp要素がクリックされた時の処理
//	$('.accordion p').click(function(){
//
//		if ( $(this).prev('.accordion input').prop('checked') == false )
//		{
//			$(this).prev('.accordion input').prop('checked', true);
//		}
//		else
//		{
//			$(this).prev('.accordion input').prop('checked', false);
//		}
//
//		//?N???b?N????.accordion?????p?v?f??O??.accordion?????p?v?f???????.accordion?????.inner??????
//		//?N???b?N????.accordion?????p?v?f???????.accordion?????.inner???J??????????????B
//		$(this).next('.accordion .inner').slideToggle();
//		
//		// クリックされた以外の要素を閉じる
///*		$('.accordion p').not($(this)).next('.accordion .inner').slideUp();
//		
//		$('.accordion p').not($(this)).prev('.accordion input').prop('checked', false);
//*/		
//	});
//	
//	// accordionクラスのp要素がフォーカスされている時にキーダウンされた時の処理
//	$('.accordion p').keydown(function(e){
//		
//		if (event.ctrlKey)
//		{
//			if (e.keyCode === 13)
//			{
//				void(0);
//				
//				if ( $(this).prev('.accordion input').prop('checked') == false ) {
//					$(this).prev('.accordion input').prop('checked', true);
//				} else {
//					$(this).prev('.accordion input').prop('checked', false);
//				}
//				
//				$(this).next('.accordion .inner').slideToggle();
//
//				$('.accordion p').not($(this)).next('.accordion .inner').slideUp();
//
//				$('.accordion p').not($(this)).prev('.accordion input').prop('checked', false);
//		
//				return false;
//			}
//		}
//		
//	});
//★2022/07　コメントアウト En
	
	// nav liのa要素がフォーカスされた時の処理
	$('nav li a').focusin(function(e) {
		// チェックボックスがチェックされていない場合
		if ($(this).prev('input').prop('checked') == false )
		{
			$(this).parent().css('background-color','#dcd6d9');
		}
		// 要素を文字列の幅に応じて広げて、隠れていた文字列を表示する
		$(this).parent().css('flex-wrap','wrap');
		$(this).parent().css('overflow','visible');
	});
	
	// nav liのa要素からフォーカスがはずれた時の処理
	$('nav li a').focusout(function(e) {
		// フォーカスされた時の設定を元の設定に戻す
		if ($(this).prev('input').prop('checked') == false )
		{
			$(this).parent().css('background-color','');
		}
		$(this).parent().css('flex-wrap','nowrap');
		$(this).parent().css('overflow','hidden');
	});
	
	// accordionクラスのp要素がフォーカスされた時の処理
	$('.accordion p').focusin(function(e) {
		$(this).css('background-color','#ccc');
	});

	// accordionクラスのp要素からフォーカスがはずれた時の処理
	$('.accordion p').focusout(function(e) {
		$(this).css('background-color','');
	});

	// accordionクラスinnerクラスのli要素がフォーカスされた時の処理
	$('.accordion .inner li').focusin(function(e) {
		$(this).css('background-color','#dcd6d9');
	});

	// accordionクラスinnerクラスのli要素からフォーカスがはずれた時の処理
	$('.accordion .inner li').focusout(function(e) {
		$(this).css('background-color','');
	});

	// accordion_noneクラスのp要素がフォーカスされた時の処理
	$('.accordion_none p').focusin(function(e) {
		$(this).css('background-color','#ccc');
	});

	// accordion_noneクラスのp要素からフォーカスがはずれた時の処理
	$('.accordion_none p').focusout(function(e) {
		$(this).css('background-color','');
	});

	$(window).on('beforeunload', function() {
		if (typeof sessionStorage == 'undefined')
		{
			return;
		}
		// sessionStorageへデータを保存する
		let toggled = document.getElementById( "menu-toggle" ).checked;
		sessionStorage.setItem('toggled', toggled);
		window.sessionStorage.setItem('toggled', toggled);
		sessionStorage.toggled = toggled
	});

});

// ?y?[?W?g?b?v????{?^????\???E??\???????
$(document).ready(function(){

	var topLink = $('#top_link');
	if (topLink.length>0)
		topLink[0].style.display="none";
		//document.getElementById('top_link').style.display="none";

	$(window).scroll(function() {
		if($(this).scrollTop() > 200) { // 200px?X?N???[????????y?[?W?g?b?v????{?^????\??
			document.getElementById('top_link').style.display="block";
		} else {
			document.getElementById('top_link').style.display="none";
		}
	});
	
	if (typeof sessionStorage == 'undefined') {
		return;
	}
	// sessionStorageからデータを取得する
	toggled = sessionStorage.getItem('toggled');
	toggled = window.sessionStorage.getItem('toggled');
	toggled = sessionStorage.toggled

	if (toggled === "false") {
		document.getElementById( "side_menu" ).style.display = "none";
		if (window.matchMedia('(min-width:1001px)').matches)
		{
			// ウィンドウサイズが1001px以上の場合の処理
			document.getElementById( "main" ).style.marginLeft = "20px";
			document.getElementById( "nav_wrap" ).style.marginLeft = "20px";
			document.getElementById( "topicpath" ).style.paddingLeft = "20px";
		}
		else
		{
			document.getElementById( "main" ).style.marginLeft = "2%";
			document.getElementById( "nav_wrap" ).style.marginLeft = "2%";
			document.getElementById( "topicpath" ).style.paddingLeft = "2%";
		}
		document.getElementById( "menu-toggle" ).checked = false;
	}
	else
	{
		// 2023.2.14 ADD
		var side_menu = $('#side_menu');
		var main = $('#main');
		var nav_wrap = $('#nav_wrap');
		var topicpath = $('#topicpath');
		var menu_toggle = $('#menu-toggle');
		if (side_menu.length>0)
			side_menu[0].style.display = "block";
		if (main.length>0)
			main[0].style.marginLeft = "";
		if (nav_wrap.length>0)
			nav_wrap[0].style.marginLeft = "";
		if (topicpath.length>0)
			topicpath[0].style.paddingLeft = "";
		if (menu_toggle.length>0)
			menu_toggle[0].checked = true;
		/*
		document.getElementById( "side_menu" ).style.display = "block";
		document.getElementById( "main" ).style.marginLeft = "";
		document.getElementById( "nav_wrap" ).style.marginLeft = "";
		document.getElementById( "topicpath" ).style.paddingLeft = "";
		document.getElementById( "menu-toggle" ).checked = true;
		*/
	}

});

$(function() {
	
	// 特定の子要素を持つWS_SCROLLクラスにのみWS_SET_SCROLLクラスを適用する
	$('div.WS_SCROLL:has(table.WS_T_WFS_001)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WFS_002)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WFS_003)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WFS_004)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WFS_005)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WFS_101)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WFS_102)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WHS_001)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WHS_002)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WHS_003)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_WHS_004)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_PL001)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_PL002)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_PL003)').addClass('WS_SET_SCROLL');
	$('div.WS_SCROLL:has(table.WS_T_PL004)').addClass('WS_SET_SCROLL');
	
	// 特定の子要素を持つaccordionクラスのli要素にのみWS_SET_TOGGLEクラスを適用する
	$('ul.accordion li:has(ul.inner li)').addClass('WS_SET_TOGGLE');
	  
	// 特定の子要素を持つaccordionのli要素クラスの前にチェックボックス挿入する
//	if ($('ul.accordion li ul').hasClass('inner inner_open'))
//	{
		//$('ul.accordion li:has(ul.inner_open li)').prepend('<input type="checkbox" checked>');
//		$('ul.accordion li:has(ul.inner_open li).children(input[name="checkbox"])').prop("checked",true);
//	}
//	if ($('ul.accordion li ul').hasClass('inner'))
//	{
//		$('ul.accordion li:has(ul.inner li)').prepend('<input type="checkbox">');
//	}
	$('ul.accordion ul.inner_open').prevAll('input[type="checkbox"]').prop("checked",true);

});


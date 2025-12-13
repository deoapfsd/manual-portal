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

$(function() {

	// accordionクラスのp要素がクリックされた時の処理
	$('.accordion p').click(function(){

		if ( $(this).prev('.accordion input').prop('checked') == false )
		{
			$(this).prev('.accordion input').prop('checked', true);
		}
		else
		{
			$(this).prev('.accordion input').prop('checked', false);
		}

		//?N???b?N????.accordion?????p?v?f??O??.accordion?????p?v?f???????.accordion?????.inner??????
		//?N???b?N????.accordion?????p?v?f???????.accordion?????.inner???J??????????????B
		$(this).next('.accordion .inner').slideToggle();
		
		// クリックされた以外の要素を閉じる
/*		$('.accordion p').not($(this)).next('.accordion .inner').slideUp();
		
		$('.accordion p').not($(this)).prev('.accordion input').prop('checked', false);
*/		
	});
	
	// accordionクラスのp要素がフォーカスされている時にキーダウンされた時の処理
	$('.accordion p').keydown(function(e){
		
		if (event.ctrlKey)
		{
			if (e.keyCode === 13)
			{
				void(0);
				
				if ( $(this).prev('.accordion input').prop('checked') == false ) {
					$(this).prev('.accordion input').prop('checked', true);
				} else {
					$(this).prev('.accordion input').prop('checked', false);
				}
				
				$(this).next('.accordion .inner').slideToggle();

				$('.accordion p').not($(this)).next('.accordion .inner').slideUp();

				$('.accordion p').not($(this)).prev('.accordion input').prop('checked', false);
		
				return false;
			}
		}
		
	});
	
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
	
	document.getElementById('top_link').style.display="none";

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
		document.getElementById( "side_menu" ).style.display = "block";
		
		document.getElementById( "main" ).style.marginLeft = "";
		document.getElementById( "nav_wrap" ).style.marginLeft = "";
		document.getElementById( "topicpath" ).style.paddingLeft = "";
		
		document.getElementById( "menu-toggle" ).checked = true;
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


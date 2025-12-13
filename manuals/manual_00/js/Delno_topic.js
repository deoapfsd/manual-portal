const topicpath = document.getElementById("topicpath");
const regex = /[0-9]+(\.[0-9]+)?\s*/g;
topicpath.innerHTML = topicpath.innerHTML.replace(regex, "");

// h1〜h3要素のリストを取得
const headings = document.querySelectorAll("h1, h2, h3, h4");

// 各要素内にある <span class="WS_HEADLINE">数字</span> を削除する
headings.forEach((heading) => {
    const spans = heading.querySelectorAll("span.WS_HEADLINE");
    spans.forEach((span) => {
        const spanText = span.textContent.trim();
        heading.textContent = heading.textContent.replace(spanText, "");
    });
});
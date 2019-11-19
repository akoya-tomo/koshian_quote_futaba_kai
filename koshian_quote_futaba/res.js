const MENU_TEXT_MAX = 18;
const no_text_list = [
    // 本文無しリスト
    // [本文無し正規表現パターン, サーバー名 + "_" + パス名（空文字で全板）]
    [/^[ 　]*[>＞]*[ 　]*ｷﾀ[ 　]*━+[ 　]*\(ﾟ∀ﾟ\)[ 　]*━+[ 　]*[!！]+[ 　]*$/, ""],  //eslint-disable-line no-irregular-whitespace
    [/^[ 　]*[>＞]*[ 　]*本文無し[ 　]*$/, ""], //eslint-disable-line no-irregular-whitespace
    [/^[\u000a\u00a0\u00ad\u2002\u200c\u2029\u3000\u8204]+$/, ""],
];
const menu_offset_x = 1;    // 引用メニューの左へのオフセット量 (px)
const menu_offset_y = 1;    // 引用メニューの上へのオフセット量 (px)

let mcx = 0;
let mcy = 0;
let mbutton = 0;
let textarea = null;
let show_idip = false;
let show_number = false;
let show_quote = true;
let show_quotemove = true;
let show_copy = true;
let show_copymove = true;
let res_filename = false;
let res_number = false;
let quote_only_unquoted = false;
let quickquote_number = false;
let delete_unnecessary_space = true;
let serverName = document.domain.match(/^[^.]+/);
let pathName = location.pathname.match(/[^/]+/);
let serverFullPath = serverName + "_" + pathName;
let has_del = document.getElementsByClassName("del").length > 0;
let has_cno = document.getElementsByClassName("cno").length > 0;

class QuoteMenu {
    constructor() {
        this.selection = "";
        this.idip = "";
        this.number = "";

        this.menu = document.createElement("div");
        this.menu.className = "KOSHIAN_QuoteMenu";
        this.menu.hidden = true;

        this.menu_text = document.createElement("div");
        this.menu_text.className = "KOSHIAN_QuoteMenuText";

        this.menu.appendChild(this.menu_text);

        if (show_idip) {
            this.menu.idipMenu = this.createMenuItem("ID･IP", () => {
                this.selection = this.idip;
                this.quote();
            });

            this.menu.appendChild(this.menu.idipMenu);
        }
        if (show_number) {
            this.menu.appendChild(this.createMenuItem("No.", () => {
                this.selection = this.number;
                this.quote();
            }));
        }
        if (show_quote) {
            this.menu.appendChild(this.createMenuItem("引用", () => {
                this.quote();
            }));
        }
        if (show_quotemove) {
            this.menu.appendChild(this.createMenuItem("引用して移動", () => {
                this.quote();
                this.moveToTextarea();
            }));
        }
        if (show_copy) {
            this.menu.appendChild(this.createMenuItem("コピー", () => {
                this.addToTextarea(this.selection);
            }));
        }
        if (show_copymove) {
            this.menu.appendChild(this.createMenuItem("コピーして移動", () => {
                this.addToTextarea(this.selection);
                this.moveToTextarea();
            }));

        }

        document.body.appendChild(this.menu);
    }

    show(text) {
        this.selection = text;
        if (show_idip) {
            this.idip = getResponseIdIp();
            if (this.idip) {
                this.menu.idipMenu.hidden = false;
            } else {
                this.menu.idipMenu.hidden = true;
            }
        }
        if (show_number) {
            this.number = getResponseNo();
        }

        let cw = document.documentElement.clientWidth;
        let ch = document.documentElement.clientHeight;

        this.menu_text.textContent = text.length > MENU_TEXT_MAX ? text.slice(0, MENU_TEXT_MAX) + `...` : text;

        this.menu.style.right = `${cw - mcx + menu_offset_x}px`;
        this.menu.style.bottom = `${ch - mcy + menu_offset_y}px`;
        this.menu.hidden = false;
    }

    hide(force = false) {
        if (this.menu.hidden) {
            return;
        }

        if (!force) {
            let rect = this.menu.getBoundingClientRect();
            if (rect.left < mcx && mcx < rect.left + rect.width && rect.top < mcy && mcy < rect.top + rect.height) {
                return;
            }
        }

        this.menu_text.textContent = "";
        this.menu.hidden = true;
    }

    quote() {
        let text = "";
        for(let i = 0, lines = this.selection.split(/\n|\r\n/); i < lines.length; ++i){
            if (lines[i]) {
                if (delete_unnecessary_space) {
                    lines[i] = lines[i].replace(/^\s+/, "");
                }
                if (!lines[i]) {
                    continue;
                }
            }
            text += `>${lines[i]}\n`;
        }

        this.addToTextarea(text);
    }

    copy() {
        this.addToTextarea(this.selection);
    }

    addToTextarea(text) {
        if(text.length == 0){
            return;
        }

        let exist = textarea.value;
        if (exist && exist[exist.length - 1] != `\n`) {
            textarea.value += `\n`;
        }

        textarea.value += text;
        
        if(text[text.length - 1] != `\n`){
            textarea.value += `\n`;
        }

        document.dispatchEvent(new CustomEvent("KOSHIAN_quote"));
    }

    moveToTextarea() {
        textarea.focus();

        let rect = textarea.getBoundingClientRect();
        let sy = document.documentElement.scrollTop + rect.top - document.documentElement.clientHeight / 2;

        document.documentElement.scrollTo(document.documentElement.scrollLeft, sy);

        textarea.scrollTop = textarea.scrollTopMax;
    }

    createMenuItem(text, callback) {
        let item = document.createElement("div");
        item.className = "KOSHIAN_QuoteMenuItem";
        item.textContent = text;
        item.onclick = () => {
            if (this.selection == "") {
                return;
            }

            callback();

            this.hide(true);
        };
        return item;
    }
}

function getResponseText() {
    let pointed = document.elementFromPoint(mcx, mcy);
    let thre_rtd = pointed.closest(".rtd, .thre, .KOSHIAN_response");

    if (!thre_rtd) {
        return "";
    }

    let blockquote = thre_rtd.querySelector(":scope > blockquote");

    if (blockquote) {
        let inner_text = getInnerText(blockquote, /KOSHIAN_PreviewSwitch|KOSHIAN_response/);
        inner_text = inner_text.replace(/(\n|\r\n)>*(\n|\r\n)/g, "\n").replace(/^(\n|\r\n)+/, "");
        if (quote_only_unquoted) {
            let text = "";
            for(let i = 0, lines = inner_text.split(/\n|\r\n/); i < lines.length; ++i){
                if (!/^>/.test(lines[i])) {
                    text += `${lines[i]}\n`;
                }
            }
            if(text.length){
                text = text.slice(0,-1);
                return text;
            } else if (res_number) {
                return "";
            }
        }
        return inner_text;
    }
    return "";
}

function getResponseNo() {
    let pointed = document.elementFromPoint(mcx, mcy);
    let thre_rtd = pointed.closest(".rtd, .thre, .KOSHIAN_response");

    if (thre_rtd) {
        let number_button = thre_rtd.querySelector(":scope > .cno") || thre_rtd.querySelector(":scope > .KOSHIAN_NumberButton");
        if (number_button) {
            return number_button.textContent;
        }
        for (let node = thre_rtd.firstChild; node; node = node.nextSibling) {
            if (node.nodeName == "BLOCKQUOTE") {
                return "";
            } else if (node.nodeType == Node.TEXT_NODE) {
                let matches = node.nodeValue.match(/No\.[0-9]+/);
                if (matches) {
                    return matches[0];
                }
            }
        }
    }
    return "";
}

function getResponseFilename() {
    let pointed = document.elementFromPoint(mcx, mcy);
    let anchor = null;

    if (pointed.tagName == "A") {
        anchor = pointed;
    } else if (pointed.parentElement.tagName == "A" && pointed.className != "fancybox-image") { // futaba lightboxのポップアップでは引用メニューを無効
        anchor = pointed.parentElement;
    } else if (pointed.tagName == "VIDEO") {
        // WebM再生画面でのaタグ検索
        let elem = pointed.parentElement.nextElementSibling;
        if (elem.tagName == "A") {
            anchor = elem;
        }
    }

    if (anchor && anchor.href) {
        let matches = anchor.href.match(/\/(([sf].?)?[0-9]+\.[0-9A-Za-z]+$)/);
        if (matches) {
            return matches[1];
        }
    }
    return "";
}

function getResponseIdIp() {
    let pointed = document.elementFromPoint(mcx, mcy);
    let thre_rtd = pointed.closest(".rtd, .thre, .KOSHIAN_response");

    if (thre_rtd) {
        for (let node = thre_rtd.firstChild; node; node = node.nextSibling) {
            if (node.nodeName == "BLOCKQUOTE") {
                return "";
            } else if (node.nodeType == Node.TEXT_NODE) {
                let matches = node.nodeValue.match(/(ID:\S{8}|IP:\w+[.:]\w+\.\*\(.+\))/);
                if (matches) {
                    return matches[0];
                }
            } else if (node.nodeName == "A") {
                let matches1 = node.name.match(/I[DP]:\S{8}/);
                if (matches1) {
                    node = node.nextSibling;
                    if (node.nodeType == Node.TEXT_NODE) {
                        let matches2 = node.nodeValue.match(/.*\)/);
                        if (matches2) {
                            return matches1[0] + matches2[0];
                        }
                    }
                    return matches1[0];
                }
            } else if (node.classList.contains("cnw")) {
                let matches = node.textContent.match(/(ID:\S{8}|IP:\w+[.:]\w+\.\*\(.+\))/);
                if (matches) {
                    return matches[0];
                }
            }
        }
    }
    return "";
}

// 何故か必要
function onMouseMove(e) {
    mcx = e.clientX;
    mcy = e.clientY;
}

function onMouseUp() {
    if (mbutton == 2) {
        // なぜかここじゃダメ
        //mcx = e.clientX;
        //mcy = e.clientY;

        onContextMenu();
    }
}

function onMouseDown(e) {
    mbutton = e.button;
    quote_menu.hide();
}

function onBlur() {
    quote_menu.hide(true);
}

function getSelectedText(use_select) {
    let sel ="";

    if (res_filename) {
        sel = getResponseFilename();
        if (sel) {
            return sel;
        }
    }

    if (use_select) {
        sel = window.getSelection().toString();
    }

    if (sel.length == 0) {
        sel = getResponseText();
        if (sel.length) {
            //dispCharCode(sel);
            if (res_number) {
                for (let i = 0; i < no_text_list.length; i++) {
                    let no_text = no_text_list[i][0].test(sel);
                    let board_matched = (serverFullPath == no_text_list[i][1] || !no_text_list[i][1]);
                    if (no_text && board_matched) {
                        sel = getResponseNo();
                        //console.log("res.js res_num: " + sel);
                        break;
                    }
                }
            }
        }
    }

    if (sel.length == 0 && res_number) {
        sel = getResponseNo();
        //console.log("res.js res_num: " + sel);
    }

    return sel;

    function dispCharCode(str) {    //eslint-disable-line no-unused-vars
        // strのキャラクターコードを表示（開発用）
        for (let i =0; i < str.length; i++) {
            console.log("res.js: str[" + i + "] = 0x" + ("0000" + str.charCodeAt(i).toString(16).toUpperCase()).substr(-4));    //eslint-disable-line no-console
        }
    }
}

function onContextMenu() {
    let sel = getSelectedText(true);

    if (sel.length == 0) {
        return;
    }

    quote_menu.show(sel);
}

function quickQuote() {
    let sel = getSelectedText();

    if (sel.length == 0) {
        return;
    }

    quote_menu.selection = sel;
    quote_menu.quote();
}

/**
 * 要素のテキストを指定したクラス名のテキストを除外して取得
 * @param {Element} element テキストを取得する要素
 * @param {string|RegExp} class_name テキスト取得を除外するクラス名
 * @return {string} 取得したテキスト
 */
function getInnerText(element, class_name) {
    let text = "";
    if (!element) {
        return text;
    }
    for (let node = element.firstChild; node; node = node.nextSibling) {
        if (class_name.test(node.className)) {
            continue;
        } else if (node.nodeName == "FONT") {
            // 引用（fontタグ）は更に子ノードのテキストを取得
            text += getInnerText(node, class_name);
        } else if (node.nodeName == "BR") {
            text += "\n";
        } else {
            text += node.textContent;
        }
    }
    return text;
}

function putNumberButton(parent) {
    let number_button = parent.getElementsByClassName("KOSHIAN_NumberButton")[0];
    if (number_button){
        // 既存のNo.ボタンがあればonclick再設定
        number_button.onclick = quickQuote;
        return;
    }

    let cnw = parent.getElementsByClassName("cnw")[0];
    if (cnw) {
        cnw.classList.add("KOSHIAN_NumberButton");
        cnw.onclick = quickQuote;
        return;
    }

    for (let node = parent.firstChild; node; node = node.nextSibling) {
        // parentの子要素を検索
        if (node.nodeName == "BLOCKQUOTE") {
            return;
        } else if (node.nodeType == Node.TEXT_NODE) {
            let matches = node.nodeValue.match(/(.*)(No\.[0-9]+)(.*)/);
            if (matches) {
                let text1 = document.createTextNode(matches[1]);
                let text2 = document.createTextNode(matches[3]);
                let btn = document.createElement("a");
                btn.className = "KOSHIAN_NumberButton";
                btn.href="javascript:void(0)";
                btn.textContent = matches[2];
                btn.onclick = quickQuote;
                parent.insertBefore(text1, node);
                parent.insertBefore(btn, node);
                parent.insertBefore(text2, node);
                parent.removeChild(node);
                return;
            }
        }
    }
}

function quickputNumberButton(del) {
    for (let node = del.previousSibling; node; node = node.previousSibling) {
        // delの前方を検索（通常はdelの一つ前のnodeがNo.）
        if (node.nodeName == "A" && node.className == "KOSHIAN_NumberButton") {
            // 既存のNo.ボタンがあればonclick再設定
            node.onclick = quickQuote;
            return;
        } else if (node.nodeType == Node.TEXT_NODE) {
            let matches = node.nodeValue.match(/(.*)(No\.[0-9]+)(.*)/);
            if (matches) {
                let block = node.parentNode;
                let text1 = document.createTextNode(matches[1]);
                let text2 = document.createTextNode(matches[3]);
                let btn = document.createElement("a");
                btn.className = "KOSHIAN_NumberButton";
                btn.href="javascript:void(0)";
                btn.textContent = matches[2];
                btn.onclick = quickQuote;
                block.insertBefore(text1, node);
                block.insertBefore(btn, node);
                block.insertBefore(text2, node);
                block.removeChild(node);
                return;
            }
        }
    }
}

function putPopupNumberButton() {
    let popupNumbers = document.getElementsByClassName("KOSHIAN_PopupNumber");
    for (let popupNumber of popupNumbers) {
        popupNumber.onclick = quickQuote;
        popupNumber.className = "KOSHIAN_NumberButton";
    }
}

let last_process_num = 0;

function process(beg = 0){
    //let start_time = Date.now();  //処理時間計測開始（開発用）

    let end;

    if (!has_cno && has_del) {
        let dels = document.getElementsByClassName("del");
        end = dels.length - 1; 
        if (beg >= end) {
            return;
        }
        for (let i = beg; i < end; ++i) {
            quickputNumberButton(dels[i+1]);
        }
    } else {
        let responses = document.getElementsByClassName("rtd");
        end = responses.length;
        if (beg >= end) {
            return;
        }
        for (let i = beg; i < end; ++i) {
            putNumberButton(responses[i]);
        }
    }

    last_process_num = end;

    //console.log("KOSHIAN_quote/res.js process() time: " + (Date.now() - start_time) + "msec");    //処理時間表示
}

let quote_menu = null;

function main() {
    textarea = document.documentElement.querySelector("#ftxa");
    if (textarea == null) {
        return;
    }

    quote_menu = new QuoteMenu();

    document.addEventListener("mousemove", onMouseMove);
    //document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("contextmenu", onMouseUp);    // Gesturefy対策
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("blur", onBlur);

    if (quickquote_number) {
        let del = document.querySelector(".thre > .del");
        if (del && !has_cno) {
            quickputNumberButton(del);
        } else {
            let thre = document.getElementsByClassName("thre")[0];
            if (thre) {
                putNumberButton(thre);
            }
        }

        process();

        // KOSHIAN リロード監視
        document.addEventListener("KOSHIAN_reload", () => {
            process(last_process_num);
        });

        // ふたば リロード監視
        let contdisp = document.getElementById("contdisp");
        if (contdisp) {
            checkFutabaReload(contdisp);
        }
    }

    document.addEventListener("KOSHIAN_popupQuote", () => {
        putPopupNumberButton();
    });

    function checkFutabaReload(target) {
        let status = "";
        let reloading = false;
        let config = { childList: true };
        let observer = new MutationObserver(function() {
            if (target.textContent == status) {
                return;
            }
            status = target.textContent;
            if (status == "・・・") {
                reloading = true;
            } else if (reloading && status.endsWith("頃消えます")) {
                process(last_process_num);
                reloading = false;
            } else {
                reloading = false;
            }
        });
        observer.observe(target, config);
    }
}

function safeGetValue(value, default_value) {
    return value === undefined ? default_value : value;
}

function onError() {
}

function onSettingGot(result) {
    show_idip = safeGetValue(result.show_idip, false);
    show_number = safeGetValue(result.show_number, false);
    show_quote = safeGetValue(result.show_quote, true);
    show_quotemove = safeGetValue(result.show_quotemove, true);
    show_copy = safeGetValue(result.show_copy, true);
    show_copymove = safeGetValue(result.show_copymove, true);
    res_filename = safeGetValue(result.res_filename, false);
    res_number = safeGetValue(result.res_number, false);
    quote_only_unquoted = safeGetValue(result.quote_only_unquoted, false);
    quickquote_number = safeGetValue(result.quickquote_number, false);
    delete_unnecessary_space = safeGetValue(result.delete_unnecessary_space, true);

    main();
}

browser.storage.local.get().then(onSettingGot, onError);
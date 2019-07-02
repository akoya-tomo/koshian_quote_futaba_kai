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
                if (delete_unnecessary_space) lines[i] = lines[i].replace(/^\s+/, "");
                if (!lines[i]) continue;
            }
            text += `>${lines[i]}\n`;
        }

        this.addToTextarea(text);
        document.dispatchEvent(new CustomEvent("KOSHIAN_quote"));
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
    let thre_rtd = null;

    for (let elem = pointed; elem; elem = elem.parentElement) {
        let class_name = elem.className;
        if (class_name == "rtd" || class_name == "thre" || class_name == "KOSHIAN_response") {
            thre_rtd = elem;
            break;
        }
        if (elem.tagName == "BLOCKQUOTE") {
            let inner_text = elem.innerText;
            if (elem.getElementsByClassName("KOSHIAN_PreviewSwitch").length) {
                inner_text = inner_text.replace(/\[見る\]|\[隠す\](\n|\r\n)?/g, "");
            }
            if (quote_only_unquoted) {
                let text = "";
                for(let i = 0, lines = inner_text.split(/\n|\r\n/); i < lines.length; ++i){
                    if (lines[i].indexOf(">") !== 0) {
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
    }

    if (!thre_rtd) return "";

    let blockquote = thre_rtd.getElementsByTagName("blockquote")[0];

    if (blockquote) {
        let inner_text = blockquote.innerText;
        if (blockquote.getElementsByClassName("KOSHIAN_PreviewSwitch").length) {
            inner_text = inner_text.replace(/\[見る\]|\[隠す\](\n|\r\n)?/g, "");
        }
        if (quote_only_unquoted) {
            let text = "";
            for(let i = 0, lines = inner_text.split(/\n|\r\n/); i < lines.length; ++i){
                if (lines[i].indexOf(">") !== 0) {
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
    let thre = false;
    let thre_rtd = null;

    for (let elem = pointed; elem; elem = elem.parentElement) {
        let class_name = elem.className;
        if (class_name == "rtd" || class_name == "KOSHIAN_response") {
            thre_rtd = elem;
            break;
        } else if (class_name == "thre") {
            thre_rtd = elem;
            thre = true;
            break;
        }
    }

    if (thre_rtd) {
        if (quickquote_number) {
            if (thre) {
                let number_button = document.querySelector(".thre>.KOSHIAN_NumberButton");
                if (number_button) {
                    return number_button.textContent;
                }
            } else {
                let number_buttons = thre_rtd.getElementsByClassName("KOSHIAN_NumberButton");
                if (number_buttons.length) {
                    return number_buttons[0].textContent;
                }
            }
        }
        for (let node = thre_rtd.firstChild; node; node = node.nextSibling) {
            if (node.tagName == "BLOCKQUOTE") {
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
    let anchor = "";

    if (pointed.tagName == "A") {
        anchor = pointed;
    // futaba lightboxのポップアップでは引用メニューを無効
    } else if (pointed.parentElement.tagName == "A" && pointed.className != "fancybox-image") {
        anchor = pointed.parentElement;
    // WebM再生画面でのaタグ検索
    } else if (pointed.tagName == "VIDEO") {
        let elem = pointed.parentElement.nextElementSibling;
        if (elem.tagName == "A") {
            anchor = elem;
        }
    }

    if (anchor) {
        let matches = anchor.href.match(/\/(([sf].?)*[0-9]+\.[0-9A-Za-z]+$)/);
        if (matches) {
            return matches[1];
        }
    }
    return "";
}

function getResponseIdIp() {
    let pointed = document.elementFromPoint(mcx, mcy);
    let thre_rtd = "";

    for (let elem = pointed; elem; elem = elem.parentElement) {
        let class_name = elem.className;
        if (class_name == "rtd" || class_name == "thre" || class_name == "KOSHIAN_response") {
            thre_rtd = elem;
            break;
        }
    }

    if (thre_rtd) {
        for (let node = thre_rtd.firstChild; node; node = node.nextSibling) {
            if (node.tagName == "BLOCKQUOTE") {
                return "";
            } else if (node.nodeType == Node.TEXT_NODE) {
                let matches = node.nodeValue.match(/(ID:\S{8}|IP:\w+[.:]\w+\.\*\(.+\))/);
                if (matches) {
                    return matches[0];
                }
            } else if (node.tagName == "A") {
                let matches1 = node.name.match(/I[DP]:\S{8}/);
                if (matches1) {
                    node = node.nextSibling;
                    if (node.nodeType == Node.TEXT_NODE) {
                        let matches2 = node.nodeValue.match(/.*\)/);
                        if (matches2) {
                            return matches1[0]+matches2[0];
                        }
                    }
                    return matches1[0];
                }
            }
        }
        return "";
    } else {
        return "";
    }
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
        if (sel) return sel;
    }

    if (use_select) sel = window.getSelection().toString();

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

function putNumberButton(block) {
    let number_buttons = block.getElementsByClassName("KOSHIAN_NumberButton");
    if (number_buttons.length){
        // 既存のNo.ボタンがあればonclick再設定
        number_buttons[0].onclick = quickQuote;
        return;
    }

    for (let node = block.firstChild; node; node = node.nextSibling) {
        // blockの子要素を検索
        if (node.tagName == "BLOCKQUOTE") {
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
                btn.style.color = "inherit";
                block.insertBefore(text1, node);
                block.insertBefore(btn, node);
                block.insertBefore(text2, node);
                block.removeChild(node);
                return;
            }
        }
    }
}

function quickputNumberButton(del) {
    for (let node = del.previousSibling; node; node = node.previousSibling) {
        // delの前方を検索（通常はdelの一つ前のnodeがNo.）
        if (node.tagName == "A" && node.className == "KOSHIAN_NumberButton") {
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
                btn.style.color = "inherit";
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

    let dels = document.getElementsByClassName("del");
    let end;

    if (dels.length) {
        end = dels.length - 1; 
        if (beg >= end) return;
        for (let i = beg; i < end; ++i) {
            quickputNumberButton(dels[i+1]);
        }
    } else {
        let responses = document.getElementsByClassName("rtd");
        end = responses.length;
        if (beg >= end) return;
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
        let del = document.querySelector(".del");
        if (del) {
            quickputNumberButton(del);
        } else {
            let thre = document.querySelector(".thre");
            if (thre) {
                putNumberButton(thre);
            }
        }

        process();

        document.addEventListener("KOSHIAN_reload", () => {
            process(last_process_num);
        });

        let contdisp = document.getElementById("contdisp");
        if (contdisp) {
            check2chanReload(contdisp);
        }
    }

    document.addEventListener("KOSHIAN_popupQuote", () => {
        putPopupNumberButton();
    });

    function check2chanReload(target) {
        let status = "";
        let reloading = false;
        let config = { childList: true };
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (target.textContent == status) return;
                status = target.textContent;
                if (status == "・・・") {
                    reloading = true;
                } else
                if (reloading && status.endsWith("頃消えます")) {
                    process(last_process_num);
                    reloading = false;
                } else {
                    reloading = false;
                }
            });
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
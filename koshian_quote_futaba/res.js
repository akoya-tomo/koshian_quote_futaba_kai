const MENU_TEXT_MAX = 18;
const no_text_list = [
    // 本文無しリスト
    // [本文無し正規表現パターン, サーバー名 + "_" + パス名（空文字で全板）]
    [/^[ 　]*[>＞]*[ 　]*ｷﾀ[ 　]*━+[ 　]*\(ﾟ∀ﾟ\)[ 　]*━+[ 　]*[!！]+[ 　]*$/, ""],
    [/^[ 　]*[>＞]*[ 　]*本文無し[ 　]*$/, ""],
    // [/^[ 　]*[>＞]*[ 　]*そうだね[ 　]*$/, "dec_71"],
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
        }
        if (show_number) {
            this.number = getResponseNo();
        }

        if (this.idip) {
            this.menu.idipMenu.hidden = false;
        } else {
            this.menu.idipMenu.hidden = true;
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

    for (let elem = pointed; elem; elem = elem.parentElement) {
        if (elem.classList.contains("KOSHIAN_response")) {
            break;
        }
        if (elem.tagName == "BLOCKQUOTE") {
            return elem.innerText;
        }
    }

    let blockquote = pointed.getElementsByTagName("blockquote")[0];

    if (blockquote) {
        return blockquote.innerText;
    } else {
        return "";
    }
}

function getResponseNo() {
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
                let matches = node.nodeValue.match(/No\.[0-9]+/);
                if (matches) {
                    return matches[0];
                }
            }
        }
        return "";
    } else {
        return "";
    }
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
        let matches = anchor.href.match(/[0-9]+\.[0-9A-Za-z]+$/);
        if (matches) {
            return matches[0];
        }
    } else {
        return "";
    }
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

function onContextMenu() {
    let sel = window.getSelection().toString();

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

    if (sel.length == 0 && res_filename) {
        sel = getResponseFilename();
        //console.log("res.js filename: " + sel);
    }

    if (sel.length == 0 && res_number) {
        sel = getResponseNo();
        //console.log("res.js res_num: " + sel);
    }

    if (sel.length == 0) {
        return;
    }

    quote_menu.show(sel);

    function dispCharCode(str) {
        for (let i =0; i < str.length; i++) {
            console.log("res.js: str[" + i + "] = 0x" + ("0000" + str.charCodeAt(i).toString(16).toUpperCase()).substr(-4));
        }
    }
}

let quote_menu = null;

function main() {
    textarea = document.documentElement.querySelector("#ftxa");
    if (textarea == null) {
        return;
    }

    quote_menu = new QuoteMenu();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("blur", onBlur);
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

    main();
}

browser.storage.local.get().then(onSettingGot, onError);
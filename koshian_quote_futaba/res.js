const MENU_TEXT_MAX = 12;

let mcx = 0;
let mcy = 0;
let mbutton = 0;
let textarea = null;
let show_quote = true;
let show_quotemove = true;
let show_copy = true;
let show_copymove = true;

class QuoteMenu {
    constructor() {
        this.selection = "";

        this.menu = document.createElement("div");
        this.menu.className = "KOSHIAN_QuoteMenu";
        this.menu.hidden = true;

        this.menu_text = document.createElement("div");
        this.menu_text.className = "KOSHIAN_QuoteMenuText";

        this.menu.appendChild(this.menu_text);

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

        let cw = document.documentElement.clientWidth;
        let ch = document.documentElement.clientHeight;

        this.menu_text.textContent = text.length > MENU_TEXT_MAX ? text.slice(0, MENU_TEXT_MAX) + `...` : text;

        this.menu.style.right = `${cw - mcx}px`;
        this.menu.style.bottom = `${ch - mcy}px`;
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
        let item = document.createElement("div")
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
    }

    if (sel.length == 0) {
        return;
    }

    quote_menu.show(sel);
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
    show_quote = safeGetValue(result.show_quote, true);
    show_quotemove = safeGetValue(result.show_quotemove, true);
    show_copy = safeGetValue(result.show_copy, true);
    show_copymove = safeGetValue(result.show_copymove, true);

    main();
}

browser.storage.local.get().then(onSettingGot, onError);
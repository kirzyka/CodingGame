console.log('CONTENT');

var addListenerOfExtension = function() {
    chrome.extension.onMessage.addListener(function(msg) {
        if(msg.to == 'CONTENT') {
            console.log('CONTENT Msg:', msg);
            switch(msg.action) {
                case GET_CODE_TEXT_REQUEST:
                    document.body.dispatchEvent(new Event(GET_CODE_TEXT_REQUEST));
                    break;
                case SET_CODE_TEXT_REQUEST:
                    document.body.dispatchEvent(new CustomEvent(SET_CODE_TEXT_REQUEST, { detail: msg.data }));
                    break;
            }
        }
    });
};

var injectScript = function(script) {
    var iScript = document.createElement('script');
    iScript.innerText = script;
    (document.head||document.documentElement).appendChild(iScript);
};

var injectScriptFile = function(script) {
    var iScript = document.createElement('script');
    iScript.src = chrome.extension.getURL(script);
    iScript.onload = function() {};
    (document.head||document.documentElement).appendChild(iScript);
};

addListenerOfExtension();
injectScript('var EXT_ID=\'' + chrome.runtime.id + '\'');
injectScriptFile('global.js');
injectScriptFile('content/inject.js');


//chrome.extension.sendMessage({greeting: "hello from content"});












console.log('BACKGROUND');

var lastId = 0;

var addListenerOfWebPage = function () {
    chrome.runtime.onMessageExternal.addListener(
        function (msg, sender, sendResponse) {
            console.log('BG Msg from Page:', msg);
            switch (msg.action) {
                case GET_CODE_TEXT_RESPONSE:
                    chrome.extension.sendMessage({
                        to: 'POPUP',
                        from: 'BG',
                        action: GET_CODE_TEXT_RESPONSE,
                        data: msg.data
                    });
                    break;
            }
        });
}

var addListenerOfExtension = function () {
    chrome.extension.onMessage.addListener(function (msg) {
        if (msg.to == 'BG') {
            console.log('BG Msg:', msg);
            switch (msg.action) {

                case GET_LIST_OF_SOLUTIONS_REQUEST:
                    var list = [];
                    for (var key in localStorage) {
                        if (key.indexOf('sol') > -1) {
                            var item = getFromLS(key.replace('sol', ''));
                            list.push(item);
                            if(lastId < item.id-0) lastId = item.id-0;
                        }
                    }
                    chrome.extension.sendMessage({
                        to: 'POPUP',
                        from: 'BG',
                        action: GET_LIST_OF_SOLUTIONS_RESPONSE,
                        data: list
                    });
                    break;

                case SET_SOLUTION_REQUEST:
                    lastId++;
                    setToLS(lastId, {id: lastId, name: msg.data.name, fullText: msg.data.text});
                    break;

                case DELETE_SOLUTION_REQUEST:
                    removeFromLS(msg.data.id);
                    break;

                case IMPORT_FROM_FILE_REQUEST:
                    localStorage.clear();
                    for(var i=0; i<msg.data.solutions.length; i++) {
                        var solution = msg.data.solutions[i];
                        setToLS(solution.id, {id: solution.id, name: solution.name, fullText: solution.text});
                    }
                    break;
            }
        }
    });
};

var getFromLS = function (id) {
    return JSON.parse(localStorage.getItem('sol' + id));
}
var setToLS = function (id, data) {
    localStorage.setItem('sol' + id, JSON.stringify(data));
}

var removeFromLS = function(id) {
    localStorage.removeItem('sol' + id);
}

addListenerOfWebPage();
addListenerOfExtension();


/*
 setInterval(function(){
 chrome.extension.sendMessage({greeting: "hello from BG"});

 }, 5000);*/



console.log('INJECT');

var addListenerOfWebPage = function() {

    document.body.addEventListener(GET_CODE_TEXT_REQUEST, function (e) {
        chrome.runtime.sendMessage(EXT_ID, {
            to: 'BG',
            from: 'PAGE',
            action: GET_CODE_TEXT_RESPONSE,
            data: { text: angular.element(document.getElementById('ideFrame'))[0].contentWindow.angular.element('#ace_edit').scope().editor.getSession().getValue()}});
    }, false);

    document.body.addEventListener(SET_CODE_TEXT_REQUEST, function (e) {
        angular.element(document.getElementById('ideFrame'))[0].contentWindow.angular.element('#ace_edit').scope().editor.getSession().setValue(e.detail.text);
    }, false);

};

addListenerOfWebPage();







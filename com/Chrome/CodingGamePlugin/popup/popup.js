$(document).ready(function () {

    var solutions = [];

    var addListenerOfExtension = function () {
        chrome.extension.onMessage.addListener(function (msg) {
            if (msg.to == 'POPUP') {
                switch (msg.action) {

                    case GET_CODE_TEXT_RESPONSE:
                        $('#txtCode').val(msg.data.text);
                        break;

                    case GET_LIST_OF_SOLUTIONS_RESPONSE:
                        $('#tblSolutions').find('tbody').empty();
                        solutions = msg.data;
                        for (var i=0; i<msg.data.length; i++) {
                            var item = msg.data[i];
                            $("#tblSolutions").find('tbody')
                                .append($('<tr data-sol-id="' + item.id + '">')
                                    .append($('<td>')
                                        .append(item.id)
                                )
                                    .append($('<td>')
                                        .append(item.name)
                                )
                                    .append($('<td>')
                                        .html('<div class="icon sol-go"></div>'+
                                                '<div class="icon sol-mini"></div>'+
                                                '<div class="icon sol-edit"></div>'+
                                                '<div class="icon sol-delete"></div>')
                                )
                            );
                        }
                        break;
                }
            }
        });
    };

    var sendToContent = function (action, data) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                to: 'CONTENT',
                from: 'POPUP',
                action: action,
                data: data
            });
        });
    }

    var sendToBG = function (action, data) {
        chrome.extension.sendMessage({
            to: 'BG',
            from: 'POPUP',
            action: action,
            data: data
        });
    }

    var getSolutionByID = function(id) {
        var item = null;
        for(var i=0; i<solutions.length; i++) {
            if(solutions[i].id == id) item = solutions[i];
        }
        return item;
    }

    // Tab switch
    $('.tab-panel .tab-link a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');
        $('.tab-panel ' + currentAttrValue).slideDown(400).siblings().slideUp(400);
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });

    // Listeners
    // Tab 1( List )
    $('#tblSolutions').on('click', '.sol-go', function(e) {
        var solId = $(this).closest('tr').data('sol-id')-0;
        var solution = getSolutionByID(solId);
        sendToContent(SET_CODE_TEXT_REQUEST, {text: solution.fullText});
    });

    $('#tblSolutions').on('click', '.sol-mini', function(e) {
        var solId = $(this).closest('tr').data('sol-id')-0;
        var solution = getSolutionByID(solId);
        $.post("http://closure-compiler.appspot.com/compile",
            {
                js_code: solution.fullText,
                compilation_level: "ADVANCED_OPTIMIZATIONS",
                output_format: "text",
                output_info: "compiled_code"
            })
            .done(function(data){
                console.log( data);
                sendToContent(SET_CODE_TEXT_REQUEST, {text: data.responseText});
            })
            .fail(function(data) {
                console.log( data);
                sendToContent(SET_CODE_TEXT_REQUEST, {text: data.responseText});
            });

    });

    $('#tblSolutions').on('click', '.sol-delete', function(e) {
        var solId = $(this).closest('tr').data('sol-id')-0;
        sendToBG(DELETE_SOLUTION_REQUEST, {id: solId});
        sendToBG(GET_LIST_OF_SOLUTIONS_REQUEST);
    });

    // Tab 2( Code )
    $('#btnGetCode').on('click', function (e) {
        sendToContent(GET_CODE_TEXT_REQUEST);
    });

    $('#btnSendCode').on('click', function (e) {
        sendToContent(SET_CODE_TEXT_REQUEST, {text: $('#txtCode').val()});
    });

    $("#btnMinimize").click(function(){
        $.post("http://closure-compiler.appspot.com/compile",
            {
                js_code: "var abcdeRTY=0;console.log( 'Test' + abcdeRTY ); ",
                compilation_level: "ADVANCED_OPTIMIZATIONS",
                output_format: "text",
                output_info: "compiled_code"
            })
            .done(function(data){
                console.log( data);
            })
            .fail(function(data) {
                console.log( data);
            });
    });

    $('#btnSaveSolution').on('click', function (e) {
        sendToBG(SET_SOLUTION_REQUEST, {text: $('#txtCode').val(), name: $('#inpSolutionName').val()});
        sendToBG(GET_LIST_OF_SOLUTIONS_REQUEST);
    });

    // Tab 3( Sync )
    $('#btnExport').on('click', function (e) {
        var text = '{\n\t"solutions": [\n';
        var rows = [];
        for(var i=0; i < solutions.length; i++) {
            var solution = solutions[i];
            var row = '\t\t{\n';
            row += '\t\t\t"id": ' + solution.id + ',\n';
            row += '\t\t\t"name": "' + solution.name + '",\n';
            row += '\t\t\t"text": ' + JSON.stringify(solution.fullText)/*.replace(/\\n/g, '\n')*/ + '\n';
            row += '\t\t}';
            rows.push(row);
        }
        text += rows.join(',\n')
        text += '\n\t]\n}';
        $('#txtData').val(text);
    });

    $('#btnImport').on('click', function (e) {
        var text = $('#txtData').val();
        var list = JSON.parse(text);
        sendToBG(IMPORT_FROM_FILE_REQUEST, list);
        sendToBG(GET_LIST_OF_SOLUTIONS_REQUEST);
    });


    //---------------------

    addListenerOfExtension();
    sendToBG(GET_LIST_OF_SOLUTIONS_REQUEST);
});
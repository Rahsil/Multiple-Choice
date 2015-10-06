/*global newLvl1Exercise*/
/*global newLvl2Exercise*/
/*global exampleExercise*/

$(document).ready(function () {


    var INITIALIZATION = 0, IN_DYNAMIC_EXERCISE = 1, NEXT_LEVEL = 2, EXERCISE_FINISHED = 3, IN_STATIC_EXERCISE = 4;
    var state = INITIALIZATION;

    var lvlArray;
    var numbLvl;
    var currentLvl = 0;
    var numbExDefault = 3;
    var numbRightSol = 0; // for progressbar
    var progressbarMax = numbExDefault;
    var solChecked = false;


    // Strings
    var nxtLvlLabel = "Next Level";
    var exFinLabel = "Exercise finished";
    var newExerciseLabel = "New Exercise";
    var wrongLabel = "Wrong!";
    var correctLabel = "Correct!";
    var sendLabel = "Send";
    var finalLabel = "All exercises finished! Well done.";
    var explanationLabel = "Explanation";
    var hintLabel = "Hint";
    var newHintLabel = "new Hint";

    var lvlProblem;
    var problem = {};
    var numberOfChoices;
    var numbExCurrLvl = 0;
    var currExProblem = 0;
    var hintNo = 0;


    initiate();

    function initiate() {
        $('.progress-bar').attr("aria-valuemax", progressbarMax);
        $('#sendBtn').click(onSendBtn);
        $('#nextBtn').click(onNextBtn);
        $('#hintBtn').click(onHintBtn);
        $('#nextBtn').hide();

        lvlArray = [newLvl1Exercise, exampleExercise, newLvl2Exercise];
        numbLvl = lvlArray.length;
        lvlProblem = lvlArray[0];
        if (!lvlProblem()["isStatic"]) {
            state = IN_DYNAMIC_EXERCISE;
            setUpDynamicExercise(lvlProblem);
        } else {
            state = IN_STATIC_EXERCISE;
            setUpStaticExercise(lvlProblem);
        }
    }

    function setUpDynamicExercise(lvlProblem) {
        problem[0] = lvlProblem();
        numbExCurrLvl = numbExDefault;
        progressbarMax = numbExCurrLvl;
        numberOfChoices = problem[0]["answers"].length;
        createCheckboxes();
        $('.panel-heading').click(onPanelClick);
        setExerciseTitle(problem[0]["problem"]);
        if (typeof problem[0]["hint"] != 'undefined' && problem[0]["hint"][0] != "") {
            $('#hintBtn').removeClass('disabled');
            for (var i = 0; i < problem[0]["hint"].length; i++) {
                $('#exContainer').append(createCollapsedHint(problem[currExProblem]["hint"][i], i));
            }
        }
        $('#sendBtn').text(sendLabel);
    }

    function setUpStaticExercise(lvlProblem) {
        problem = lvlProblem();
        numbExCurrLvl = problem.length;
        progressbarMax = numbExCurrLvl;
        numberOfChoices = problem[currExProblem]["answers"].length;
        createCheckboxes();
        $('.panel-heading').click(onPanelClick);
        setExerciseTitle(problem[currExProblem]["problem"]);
        if (typeof problem[currExProblem]["hint"] != 'undefined' && problem[currExProblem]["hint"][0] != "") {
            $('#hintBtn').removeClass('disabled');
            for (var i = 0; i < problem[0]["hint"].length; i++) {
                $('#exContainer').append(createCollapsedHint(problem[currExProblem]["hint"][i], i));
            }
        }
        $('#sendBtn').text(sendLabel);
        for (i = 0; i < numberOfChoices; i++) {
            $('#explanation' + i).hide();
        }
    }

    function onPanelClick(){
        if(solChecked){
            return 0;
        }
        for(var i = 0; i < numberOfChoices; i++){
            if(this.getAttribute('id') === ('panel-heading-'+i)){
                if($('#ck' + i).is(":checked")){
                    $('#ck' + i).prop('checked', false);
                    break;
                } else{
                    $('#ck' + i).prop('checked', true);
                    break;
                }

            }
        }
    }

    function onSendBtn() {
        if (isRight() && !solChecked) {
            numbRightSol++;
        } else if (state === IN_STATIC_EXERCISE && !solChecked) {
            numbRightSol++;
        }
        setColors();
        updateState();
        if (!solChecked) {
            updateNextBtnLabel();
        }
        solChecked = true;
        updateProgressbar(numbRightSol);
        $('#nextBtn').show();
        for (var i = 0; i < numberOfChoices; i++) {
            $('#explanation' + i).show();
            $('#ck'+i).prop('disabled', true);
        }
    }

    function onHintBtn() {
        if (typeof problem[currExProblem]["hint"] === 'undefined') {
            $('#hintBtn').addClass('disabled');
            return 0;
        }
        if (!$('#hintBtn').hasClass('disabled') && hintNo < problem[currExProblem]["hint"].length) {
            $('#hintDiv' + hintNo).collapse();
            hintNo++;
        }
        if (hintNo === problem[currExProblem]["hint"].length) {
            $('#hintBtn').addClass('disabled');
            $('#hintBtn').removeAttr('data-toggle');
        } else {
            $('#hintBtn').text(newHintLabel);
        }
    }

    function onNextBtn() {
        clearExercise();
        switch (state) {
            case EXERCISE_FINISHED:
                exerciseFinished();
                break;
            case NEXT_LEVEL:
                lvlUp();
                break;
            case IN_DYNAMIC_EXERCISE:
                setUpDynamicExercise(lvlProblem);
                break;
            case IN_STATIC_EXERCISE:
                currExProblem++;
                setUpStaticExercise(lvlProblem);
                break;
        }
    }

    function lvlUp() {
        numbRightSol = 0;
        currExProblem = 0;
        currentLvl++;
        lvlProblem = lvlArray[currentLvl];
        updateState();
        if (state === IN_DYNAMIC_EXERCISE) {
            updateProgressbar(numbRightSol);
            setUpDynamicExercise(lvlProblem);
        } else if (state === IN_STATIC_EXERCISE) {
            updateProgressbar(numbRightSol);
            setUpStaticExercise(lvlProblem);
        } else {
            console.log("Illegal State! " + state);
        }
    }

    function isRight() {
        if (!checkRightAnswers()) {
            $('#sendBtn').text(wrongLabel);
            return false;
        }
        if (!checkWrongAnswers()) {
            $('#sendBtn').text(wrongLabel);
            return false;
        }
        $('#sendBtn').text(correctLabel);
        return true;
    }

    function checkRightAnswers() {
        for (var i = 0; i < problem[currExProblem]["rightSolIDs"].length; i++) {
            if (!$('#ck' + problem[currExProblem]["rightSolIDs"][i]).is(":checked")) {
                return false;
            }
        }
        return true;
    }

    function checkWrongAnswers() {
        for (var i = 0; i < numberOfChoices; i++) {
            if ($.inArray(i, problem[currExProblem]["rightSolIDs"]) > -1) {
                continue;
            }
            if ($('#ck' + i).is(":checked")) {
                return false;
            }
        }
        return true;
    }

    function updateState() {
        if (numbRightSol >= progressbarMax && state != NEXT_LEVEL) {
            if (currentLvl === (numbLvl - 1)) {
                state = EXERCISE_FINISHED;
            } else {
                state = NEXT_LEVEL;
            }
        } else {
            if (lvlProblem()["isStatic"]) {
                state = IN_STATIC_EXERCISE;
            } else {
                state = IN_DYNAMIC_EXERCISE;
            }
        }
    }

    function exerciseFinished() {
        $('#ckcontainer').empty();
        var endDiv = document.createElement('div');
        endDiv.textContent = finalLabel;
        $(endDiv).attr('class', 'alert alert-info');
        $(endDiv).attr('role', 'alert');
        $('#ckcontainer').append(endDiv);
        $('#sendBtn').hide();
        $('#hintBtn').hide();
    }





    ////////// APPEARANCE //////////

    function setExerciseTitle(exTitle) {
        $('#exercise').text(exTitle);
    }

    function updateNextBtnLabel() {
        switch (state) {
            case EXERCISE_FINISHED:
                $('#nextBtn').text(exFinLabel);
                break;
            case NEXT_LEVEL:
                $('#nextBtn').text(nxtLvlLabel);
                break;
            case IN_DYNAMIC_EXERCISE:
                $('#nextBtn').text(newExerciseLabel);
                break;
            case IN_STATIC_EXERCISE:
                $('#nextBtn').text(newExerciseLabel);
                break;
            default:
                $('#nextBtn').text(newExerciseLabel);
        }
    }

    function updateProgressbar(numbRightSol) {
        $('.progress-bar').attr("aria-valuenow", numbRightSol);
        $('.progress-bar').attr('aria-valuemax', numbExCurrLvl + 1);
        $('.progress-bar').attr('style', "width: " + (numbRightSol / progressbarMax) * 100 + "%;");
    }

    function createInputElement(inputType, inputId) {
        var newCkBx = document.createElement('input');
        newCkBx.type = inputType;
        newCkBx.id = inputId;
        return newCkBx;
    }

    function createSpanElement(spanID, spanTextContent) {
        var newSpan = document.createElement('span');
        newSpan.id = spanID;
        newSpan.textContent = spanTextContent;
        return newSpan;
    }

    function createExplanationBtn(btnId, i) {
        var btn = document.createElement('button');
        btn.type = "button";
        $(btn).attr('class', 'btn btn-default btn-xs collapsed pull-right');
        btn.id = btnId;
        $(btn).text(explanationLabel);
        $(btn).attr('data-toggle', 'collapse');
        $(btn).attr('data-target', '#collapse' + i);
        $(btn).attr('aria-expanded', 'false');
        $(btn).attr('aria-controls', 'collapse' + i);
        return btn;
    }

    function createCollapsedHint(txt, hintNo) {
        var div = document.createElement("div");
        var txtDiv = document.createElement("div");
        $(txtDiv).text(txt);
        $(txtDiv).attr('class', 'panel-body');
        $(div).append(txtDiv);
        $(div).attr('id', 'hintDiv' + hintNo);
        $(div).attr('class', 'collapse panel panel-default');
        return div;
    }

    function createCheckboxes() {
        for (var i = 0; i < numberOfChoices; i++) {
            createCheckboxPanel(i);
        }
    }

    function createCheckboxPanel(i) {
        var panelGroupDiv = createGroupDiv();
        var panelDefaultDiv = createPanelDefaultDiv(i);
        var panelHeadDiv = createPanelHeadDiv(i);

        $(panelDefaultDiv).append(panelHeadDiv);
        if (state === IN_STATIC_EXERCISE && problem[currExProblem]["explanation"][i] != "") {
            $(panelHeadDiv).append(createExplanationBtn('explanation' + i, i));
            $(panelDefaultDiv).append(createCollapsedExplanationPanel(problem[currExProblem]["explanation"][i], i));
        }
        $(panelGroupDiv).append(panelDefaultDiv);
        $('#ckcontainer').append(panelGroupDiv);

    }

    function createGroupDiv() {
        var panelGroupDiv = document.createElement('div');
        $(panelGroupDiv).attr('class', 'panel-group');
        return panelGroupDiv;
    }

    function createPanelDefaultDiv(i) {
        var panelDefaultDiv = document.createElement('div');
        $(panelDefaultDiv).attr('class', 'panel panel-default');
        $(panelDefaultDiv).attr('id', 'ckbx' + i);
        return panelDefaultDiv;
    }

    function createPanelHeadDiv(i) {
        var panelHeadDiv = document.createElement('div');
        $(panelHeadDiv).attr('class', 'panel-heading');
        $(panelHeadDiv).attr('id', 'panel-heading-'+i);
        $(panelHeadDiv).append(createInputElement('checkbox', 'ck' + i));
        $(panelHeadDiv).append(createSpanElement("cktxt" + i, problem[currExProblem]["answers"][i]));
        return panelHeadDiv;
    }

    function createCollapsedExplanationPanel(txt, i) {
        var collapsedDiv = document.createElement('div');
        var panelBodyDiv = document.createElement('div');

        $(collapsedDiv).attr('id', 'collapse' + i);
        $(collapsedDiv).attr('class', 'panel-collapse collapse');
        $(panelBodyDiv).attr('class', 'panel-body');
        $(panelBodyDiv).text(txt);
        $(collapsedDiv).append(panelBodyDiv);
        return collapsedDiv;
    }

    function createGlyphiconOk(){
        var span = document.createElement('span');
        $(span).prop('class', 'glyphicon glyphicon-ok pull-right text-success');
        return span;
    }

    function createGlyphiconRemove(){
        var span = document.createElement('span');
        $(span).prop('class', 'glyphicon glyphicon-remove pull-right text-danger');
        return span;
    }

    function setColors(){
        for(var i = 0; i < numberOfChoices; i++){
            if($.inArray(i, problem[currExProblem]["rightSolIDs"]) > -1){
                $('#ckbx'+i).prop('class', 'panel panel-success');
                if($('#ck'+i).is(":checked")){
                    $('#panel-heading-'+i).append(createGlyphiconOk());
                } else{
                    $('#panel-heading-'+i).append(createGlyphiconRemove());
                }
            } else{
                $('#ckbx'+i).prop('class', 'panel panel-danger');
                if($('#ck'+i).is(":checked")){
                    $('#panel-heading-'+i).append(createGlyphiconRemove());
                } else{
                    $('#panel-heading-'+i).append(createGlyphiconOk());
                }
            }
        }
    }

    function clearExercise() {
        $('#ckcontainer').empty();
        $('#nextBtn').hide();
        $('#hintBtn').addClass('disabled');
        $('#hintBtn').text(hintLabel);
        $('.collapse').remove();
        hintNo = 0;
        solChecked = false;
    }
});
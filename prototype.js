/*global newLvl1Exercise*/
/*global newLvl2Exercise*/
/*global exampleExercise*/

$(document).ready(function(){


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


    initiate();

    function initiate(){
        $('.progress-bar').attr("aria-valuemax", progressbarMax);
        $('.progress').width("50%");
        $('#sendBtn').click(checkSolution);
        $('#nextBtn').click(onNextBtn);
        $('#nextBtn').hide();
        $('#ckcontainer').width("50%");

        lvlArray = [newLvl1Exercise, exampleExercise, newLvl2Exercise];
        numbLvl = lvlArray.length;
        lvlProblem = lvlArray[0];
        if(!lvlProblem()["isStatic"]){
            state = IN_DYNAMIC_EXERCISE;
            setUpDynamicExercise(lvlProblem);
        } else{
            state = IN_STATIC_EXERCISE;
            setUpStaticExercise(lvlProblem);
        }
    }

    function setUpDynamicExercise(lvlProblem){
        numbExCurrLvl = numbExDefault;
        progressbarMax = numbExCurrLvl;
        problem[0] = lvlProblem();
        numberOfChoices = problem[0]["answers"].length;
        generateCheckboxes();
        setExerciseTitle(problem[0]["problem"]);
        console.log(problem[0]["hint"][0]);
        if(problem[0]["hint"][0] != ""){
            $('body').append(createCollapsedHints(problem[0]["hint"][0]));
            $('#hintBtn').removeClass('disabled');
            $('#hintBtn').attr('data-target', '#hintDiv');
            $('#hintBtn').attr('aria-controls', 'hintDiv');
        }
        $('#sendBtn').text(sendLabel);
    }

    function setUpStaticExercise(lvlProblem){
        problem = lvlProblem();
        numbExCurrLvl = problem.length;
        progressbarMax = numbExCurrLvl;
        numberOfChoices = problem[currExProblem]["answers"].length;
        generateCheckboxes();
        setExerciseTitle(problem[currExProblem]["problem"]);
        createHintBtn();
        createCollapsedHints();
        $('#sendBtn').text(sendLabel);
    }

    function lvlUp(){
        numbRightSol = 0;
        currExProblem = 0;
        currentLvl++;
        lvlProblem = lvlArray[currentLvl];
        updateState();
        if(state === IN_DYNAMIC_EXERCISE){
            updateProgressbar(numbRightSol);
            setUpDynamicExercise(lvlProblem);
        } else if(state === IN_STATIC_EXERCISE){
            updateProgressbar(numbRightSol);
            setUpStaticExercise(lvlProblem);
        } else{
            console.log("Illegal State! " + state);
        }
    }

    function exerciseFinished(){
        $('#ckcontainer').empty();
        allFinished();
    }

    function onNextBtn(){
        clearExercise();
        switch (state){
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

    function setExerciseTitle(exTitle){
        $('#exercise').text(exTitle);
    }

    function clearExercise(){
        $('#ckcontainer').empty();
        $('#nextBtn').hide();
        solChecked = false;
    }

    function isRight(){
        if(!checkRightAnswers()){
            $('#sendBtn').text(wrongLabel);
            return false;
        }
        if(!checkWrongAnswers()){
            $('#sendBtn').text(wrongLabel);
            return false;
        }
        $('#sendBtn').text(correctLabel);
        return true;
    }
    
    function checkSolution(){
        if(isRight() && !solChecked){
            numbRightSol++;
        } else if(state === IN_STATIC_EXERCISE){
            numbRightSol++;
        }
        setColors();
        solChecked = true;
        updateState();
        updateNextBtnLabel();
        $('#nextBtn').show();
        for(var i = 0; i < numberOfChoices; i++){
            $('#explanation' + i).show();
        }
    }
    
    function allFinished(){
        var endDiv = document.createElement("div");
        endDiv.textContent = finalLabel;
        $('#ckcontainer').append(endDiv);
        $('#sendBtn').hide();
    }
    
    function generateCheckboxes(){
       for(var i = 0; i < numberOfChoices; i++){
           $('#ckcontainer').append(createDivElement("ckbx", "ckbx" + i));
           $('#ckbx'+i).append(createInputElement("checkbox", "Aufgabe1", "ck"+i));
           $('#ckbx' +i).append(createSpanElement("cktxt"+i, problem[currExProblem]["answers"][i]));
           if(state === IN_STATIC_EXERCISE && problem[currExProblem]["explanation"][i] != ""){
               $('#ckbx' +i).append(createExplanationBtn("explanation" + i, i));
               $('#ckbx' + i).append(createCollapsedExplanation(problem[currExProblem]["explanation"][i], i));
               $('#explanation' + i).hide();
           }

        }        
    }
    
    function setColors(){
        for(var i = 0; i < numberOfChoices; i++){
            if($.inArray(i, problem[currExProblem]["rightSolIDs"]) > -1){
                if($('#ck' + i).is(":checked")){
                    $('#ckbx' + i).css("background-color", "green");    
                } else{
                    $('#ckbx' + i).css("background-color", "red");
                }
            } else{
                if($('#ck' + i).is(":checked")){
                    $('#ckbx' + i).css("background-color", "red");
                } else{
                    $('#ckbx' + i).css("background-color", "green");
                }
            }
        }
    }
    
    function checkRightAnswers(){
        for(var i = 0; i < problem[currExProblem]["rightSolIDs"].length; i++){
            if(!$('#ck' + problem[currExProblem]["rightSolIDs"][i]).is(":checked")){
                return false;
            }
        }
        return true;
    }
    
    function checkWrongAnswers(){
        for(var i = 0; i < numberOfChoices; i++){
            if($.inArray(i, problem[currExProblem]["rightSolIDs"]) > -1){
                continue;
            }
            if($('#ck'+ i).is(":checked")){
                return false;
            }
        }
        return true;
    }
    
    function createDivElement(divClass, divId){
            var newDiv = document.createElement("div");
            newDiv.class = divClass;
            newDiv.id = divId;
            return newDiv;
    }
    
    function createInputElement(inputType, inputName, inputId){
        var newCkBx = document.createElement('input');
        newCkBx.type = inputType;
        newCkBx.name = inputName;
        newCkBx.id = inputId;
        return newCkBx;
    }
    
    function createSpanElement(spanID, spanTextContent){
        var newSpan = document.createElement('span');
        newSpan.id = spanID;
        newSpan.textContent = spanTextContent;
        return newSpan;
    }

    function createExplanationBtn(btnId, i){
        var btn = document.createElement('BUTTON');
        btn.type = "button";
        $(btn).attr('class', 'btn btn-default btn-xs collapsed pull-right');
        btn.id = btnId;
        $(btn).text(explanationLabel);
        $(btn).attr('data-toggle', 'collapse');
        $(btn).attr('data-target', '#explanationDiv' + i);
        $(btn).attr('aria-expanded', 'false');
        $(btn).attr('aria-controls', 'explanationDiv' + i);
        return btn;
    }

    function createCollapsedExplanation(txt, i){
        var explanationDiv = document.createElement("div");
        var txtDiv = document.createElement("div");
        $(txtDiv).text(txt);
        txtDiv.class = "well";
        $(explanationDiv).attr('class', 'collapse');
        explanationDiv.id = ("explanationDiv" + i);
        $(explanationDiv).attr('aria-expanded', 'false');
        $(explanationDiv).attr("style", "height: 0px");
        $(explanationDiv).append($(txtDiv));
        return explanationDiv;
    }

    function createCollapsedHints(txt){
        var hintDiv = document.createElement("div");
        var txtDiv = document.createElement("div");
        txtDiv.class = "well";
        $(hintDiv).text(txt);
        $(hintDiv).attr('class','collapse');
        $(hintDiv).attr('id', 'hintDiv');
        $(hintDiv).attr('aria-expanded', 'false');
        $(hintDiv).attr("style", "height: 0px");
        $(hintDiv).append($(txtDiv));
        return hintDiv;
    }
    
    function updateState(){
        if(numbRightSol >= progressbarMax && state != NEXT_LEVEL){
            if(currentLvl === (numbLvl -1)){
                state = EXERCISE_FINISHED;
            } else{
                state = NEXT_LEVEL;
            }
        } else{
            if(lvlProblem()["isStatic"]){
                state = IN_STATIC_EXERCISE;
            } else{
                state = IN_DYNAMIC_EXERCISE;
            }
        }
    }
    
    function updateNextBtnLabel(){
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
            default:
                $('#nextBtn').text(newExerciseLabel);
        }
    }
    
    function updateProgressbar(numbRightSol){
        $('.progress-bar').attr("aria-valuenow", numbRightSol);
        $('.progress-bar').attr('aria-valuemax', numbExCurrLvl+1);
        $('.progress-bar').attr('style', "width: "+(numbRightSol/progressbarMax)*100+"%;");
    }
});
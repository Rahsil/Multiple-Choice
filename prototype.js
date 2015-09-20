/*global newLvl1Exercise*/
/*global newLvl2Exercise*/
/*global exampleExercise*/

$(document).ready(function(){
    
    var IN_EXERCISE = 0, NEXT_LEVEL = 1, EXERCISE_FINISHED = 2, IN_STATIC_EXERCISE = 3;
    var state = 0;
    
    //var lvlArray = new Array(numbLvl);
    var lvlArray = [newLvl1Exercise, exampleExercise, newLvl2Exercise]; // currently hard coded array, should be changed
    var numbLvl = lvlArray.length;
    var currentLvl = 0;
    var numbRightSol = 0; // for progressbar
    var progressbarMax = 2;
    var solChecked = false;
    
    
    $('.progress-bar').attr("aria-valuemax", progressbarMax);
    $('.progress').width("50%");
    $('#sendBtn').click(checkSolution);
    $('#nextBtn').click(generateExercise);
    $('#nextBtn').hide();
    $('#ckcontainer').width("50%");
    
    // Strings
    var nxtLvlLabel = "Next Level";
    var exFinLabel = "Exercise finished";
    var newExerciseLabel = "New Exercise";
    var wrongLabel = "Wrong!";
    var correctLabel = "Correct!";
    var sendLabel = "Send";
    var finalLabel = "All exercises finished! Well done.";
    
    
    var problem = {};
    var numberOfChoices;
    var numbExCurrLvl = 0;
    var currExProblem = 0;
    
    generateExercise();
    
    
    function generateExercise(){
        $('#nextBtn').hide();
        $('#ckcontainer').empty();
        if(state === EXERCISE_FINISHED){
            allFinished();
            return 0; // do not generate a new solution
        }
        if(state === IN_STATIC_EXERCISE){
            currExProblem++;
        }
        if(state === NEXT_LEVEL){
            currentLvl++;
            numbRightSol = 0;
            $('.progress-bar').attr('aria-valuenow', numbRightSol);
            $('.progress-bar').attr('style', "width: "+(numbRightSol/progressbarMax)*100+"%;");
            $('#nextBtn').text(newExerciseLabel);
            state = IN_EXERCISE;
        }
        solChecked = false;
        var lvlProblem = lvlArray[currentLvl];
        var testProblem = lvlProblem();
        if(!testProblem["isStatic"]){
            currExProblem= 0;
            problem = {};
            problem[0] = testProblem;
            state = IN_EXERCISE;
        } else{
            problem = testProblem;
            numbExCurrLvl = problem.length;
            progressbarMax = numbExCurrLvl;
            $('.progress-bar').attr('aria-valuemax', numbExCurrLvl+1);
            state = IN_STATIC_EXERCISE;
        }

        numberOfChoices = problem[currExProblem]["answers"].length;
        generateCheckboxes();
        $('#exercise').text(problem[currExProblem]["problem"]);
        $('#sendBtn').text(sendLabel);
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
            updateProgressbar(numbRightSol);
        }
        setColors();
        solChecked = true;
        updateState();
        updateNextBtnLabel();
        $('#nextBtn').show();
    }
    
    function allFinished(){
        var endDiv = document.createElement("div");
        endDiv.textContent = finalLabel;
        $('#ckcontainer').append(endDiv);
        $('#sendBtn').hide();
    }
    
    function generateCheckboxes(){
       for(var i = 0; i < numberOfChoices; i++){
           /*
           $('#ckcontainer').append(generateBootstrapCheckbox("...", i));
           $('.cktxt' + i).text = 'blabla';//*/
           //
           $('#ckcontainer').append(createDivElement("ckbx", "ckbx" + i));
           $('#ckbx'+i).append(createInputElement("checkbox", "Aufgabe1", "ck"+i));
           $('#ckbx' +i).append(createSpanElement("cktxt"+i, problem[currExProblem]["answers"][i]));
           //*/
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

    function generateBootstrapSpan(spanClass){
        var span = document.createElement('span');
        $(span).attr('class', spanClass);
        return $(span);
    }

    function generateBootstrapDiv(divClass){
        var div = document.createElement('div');
        $(div).attr('class', divClass);
        return $(div);
    }

    function generateBootstrapCheckbox(ariaLabel, i){
        var ckDivB = generateBootstrapDiv('row');
        var ckDivA = generateBootstrapDiv('col-lg-1');
        var ckSpan = generateBootstrapSpan('input-group-addon');
        var ckText = generateBootstrapSpan('cktxt' + i);



        var ckbx = document.createElement('input');
        ckbx.type = "checkbox";
        $(ckbx).attr('aria-label', ariaLabel);
        $(ckSpan).append($(ckbx));
        $(ckDivA).append($(ckSpan));
        $(ckDivA).append($(ckText));
        $(ckDivB).append($(ckDivA));
        return $(ckDivB);
    }
    
    function updateState(){
        if(numbRightSol >= progressbarMax){
            if(currentLvl === (numbLvl -1)){
                state = EXERCISE_FINISHED;
            } else{
                state = NEXT_LEVEL;
            }
        } else{
            if(problem["isStatic"]){
                state = IN_STATIC_EXERCISE;
            } else{
                state = IN_EXERCISE;
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
            case IN_EXERCISE:
                $('#nextBtn').text(newExerciseLabel);
                break;
            default:
                $('#nextBtn').text(newExerciseLabel);
        }
    }
    
    function updateProgressbar(numbRightSol){
        $('.progress-bar').attr("aria-valuenow", numbRightSol);
        $('.progress-bar').attr('style', "width: "+(numbRightSol/progressbarMax)*100+"%;");
    }
});
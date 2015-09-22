/**
 * Generates a new exercise
 *
 * @return {string|Array|Array<number>|boolean}
 */
var newLvl1Exercise = function(){
    this.numberOfChoices = 4; // < 10 !
    this.numberOfRightAnswers = 2;
    this.problem = "";
    this.answers = new Array(this.numberOfChoices);
    this.rightSolIDs = new Array(this.numberOfRightAnswers);
    this.isStatic = false;
    
    var a = getRndInt(1, 5);
    var b = getRndInt(1, 5);
    var rightSol = a+b;
    for(var i = 0; i < this.numberOfRightAnswers; i++){
        this.rightSolIDs[i] = getNewNumber(this.rightSolIDs, 0,this.numberOfChoices);
    }
    
    this.problem = "What is " + a + " + " + b + "?";
    for(var j = 0; j < this.rightSolIDs.length; j++){
        this.answers[this.rightSolIDs[j]] = rightSol;
    }
    this.answers = generateSolutions(this.rightSolIDs, this.answers);
    console.log(this.answers);
    return {
        "problem": this.problem,
        "answers": this.answers,
        "rightSolIDs": this.rightSolIDs,
        "isStatic": this.isStatic
    };
};


// checks if "number" is already in the array "answers"
function alreadyPosSol(number, answers){
    for(var i = 0; i < answers.length; i++){
        if(answers[i] === number){
            return true;
        }
    }
    return false;
}



function generateSolutions(rightSolIDs, answers){
    for(var i = 0; i< this.numberOfChoices; i++){
        if($.inArray(i, rightSolIDs) > -1){
            continue;
        }
        answers[i] = getNewNumber(answers, 1, 10);
    }   
    return answers;
}

function getRndInt(lower, upper){
    return  Math.floor((upper-lower+1)*Math.random()+lower);
}

function getNewNumber(array, lower, upper){
    var exists = true;
    var newNumber;
    while(exists){
        newNumber = getRndInt(lower, upper);
        exists  = alreadyPosSol(newNumber, array);
    }
    return newNumber;
}

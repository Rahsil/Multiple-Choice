/**
 * Generates a new exercise
 *
 * @return {{boolean}|{string}|{Object}|{number}}
 * 
 */
var exampleExercise = function(){

    this.problem = [];
    this.problem[0] = "Which of the following numbers are even?";
    this.problem[1] = "Which of the following are animals?";

    this.answers = [];
    this.answers[0] = [1, 2, 3, 4];
    this.answers[1] = ["Bird", "Apple", "Banana", "Horse", "House"];

    this.rightSolIDs = [];
    this.rightSolIDs[0] = [1, 3];
    this.rightSolIDs[1] = [0, 3];

    this.explanation = [];
    this.explanation[0] = ["", "Explanation", "Explanation", ""];
    this.explanation[1] = ["", "Explanation", "", "Explanation", ""];

    this.hint = [];
    this.hint[0] = ["This is ...", "... a hint!"];
    this.hint[1] = ["And this... ", "is also one!"];



    this.isStatic = true;

    var problemSet = [];
    problemSet["isStatic"] = this.isStatic;
    var numberOfProblems = problem.length;
    for(var i = 0; i < numberOfProblems; i++){
        problemSet[i] = {};
        problemSet[i]["problem"] = this.problem[i];
        problemSet[i]["answers"] = this.answers[i];
        problemSet[i]["rightSolIDs"] = this.rightSolIDs[i];
        problemSet[i]["explanation"] = this.explanation[i];
        problemSet[i]["hint"] = this.hint[i];
    }

    return problemSet;
};
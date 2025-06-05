import antlr4 from 'antlr4';
import BooleanFormulaParser from './BooleanFormulaParser.js';
import BooleanFormulaLexer from './BooleanFormulaLexer.js';
import BooleanFormulaVisitor from './BooleanFormulaVisitor.js';
import fs from 'fs';
import readline from 'readline';

class Formula {
  constructor(negated, literal, elements, op) {
    this.negated = negated;
    this.literal = literal;
    this.elements = elements;
    this.op = op;
  }

  stringRepresentation() {

    let str = "";

    if (this.negated) {
      str += "!";
    }

    if (this.literal) {
      str += this.literal;
    }

    if (this.elements) {
      str += "(";
      str += this.elements.map((e) => e.stringRepresentation()).join(this.op)
      str += ")";
    }

    return str;
  }

  operatorNesting() {
    if (this.elements) {
      return 1 + Math.max(...this.elements.map((e) => e.operatorNesting()));
    }
    return 0;
  }

  negationLevel() {
    if (this.negated) {
      return this.operatorNesting() + 1;
    }
    if (this.elements) {
      return Math.max(...this.elements.map((e) => e.negationLevel()));
    }
    return 0;
  }

  operatorCount() {
    if (this.elements) {
      return this.elements.map((e) => e.operatorCount()).reduce((sum, a) => sum + a, 0) + (this.elements.length - 1);
    }
    return 0;
  }

  literalCount() {

    const set = new Set();
    if (this.elements) {
      this.elements.forEach((e) => e.literalCount().forEach((l) => set.add(l)));
      return set;
    }

    set.add(this.literal);
    return set;
  }

  evaluate(assignment) {
    let res = null;

    if (this.literal && assignment.has(this.literal)) {
      res = assignment.get(this.literal);
    }

    if (" & " === this.op) {

      if (this.elements.some((e) => e.evaluate(assignment) === false)) {
        res = false;
      } else if (this.elements.every((e) => e.evaluate(assignment) === true)) {
        res = true;
      }
    }

    if (" | " === this.op) {

      if (this.elements.some((e) => e.evaluate(assignment) === true)) {
        res = true;
      } else if (this.elements.every((e) => e.evaluate(assignment) === false)) {
        res = false;
      }
    }

    if (" <-> " === this.op) {

      const b0 = this.elements[0].evaluate(assignment);
      const b1 = this.elements[1].evaluate(assignment);

      if ((b0 === true && b1 === true) || (b0 === false && b1 == false)) {
        res = true;
      } else if ((b0 === true && b1 === false) || (b0 === false && b1 == true)) {
        res = false;
      }
    }

    if (" -> " === this.op) {

      const b0 = this.elements[0].evaluate(assignment);
      const b1 = this.elements[1].evaluate(assignment);

      if (b0 === false || b1 === true) {
        res = true;
      } else if (b0 === true && b1 == false) {
        res = false;
      }
    }

    return (this.negated && res !== null) ? !res : res;
  }

  validateEquals(other) {


    const thisLiterals = this.literalCount();
    const otherLiterals = other.literalCount();

    const totalLiterals = new Set();
    thisLiterals.forEach(l => totalLiterals.add(l));
    otherLiterals.forEach(l => totalLiterals.add(l));

    for (let assgn = 0; assgn < Math.pow(2, totalLiterals.size); assgn++) {

      const assgnMap = new Map();

      let i = totalLiterals.size - 1;

      for (const literal of totalLiterals) {
        assgnMap.set(literal, (assgn & (1 << i)) != 0);
        i--;
      }

      if (this.evaluate(assgnMap) !== other.evaluate(assgnMap)) {
        return false;
      }
    }

    return true;
  }
}

class FormulaVisitor extends BooleanFormulaVisitor {

  visitFormula(ctx) {
    
    if (ctx.literal) {
      return new Formula(ctx.negated !== null, ctx.literal.text, null, null);
    }

    if (ctx.elements) {
      return new Formula(ctx.negated !== null, null, ctx.elements.map((e) => this.visitFormula(e)), ctx.op.text);
    }
  }
};


function parseFormula(input) {

    if (!input || input === "TODO") {
      return null;
    }

    const chars = new antlr4.InputStream(input);
    const lexer = new BooleanFormulaLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new BooleanFormulaParser(tokens);
    const visitor = new FormulaVisitor();
    return visitor.visitFormula(parser.formula());
  };


function readLine(line, formulas) {

  const cells = line.split(",");
  if (cells[0] === "Formula") return;

  const original = parseFormula(cells[0]);
  const origNegationLevel = original.negationLevel();
  const origOperatorCount = original.operatorCount();

  for (let i = 1; i < cells.length; i++) {

    const rewritten = parseFormula(cells[i]);
    if (rewritten === null) continue;

    const pair = {original:original, rewritten:rewritten};

    if (i === 1) {

      const rewrittenNegationLevel = rewritten.negationLevel();

      if (rewrittenNegationLevel > origNegationLevel) {
        formulas.get("REDUCE_NEGATION_COUNT_INCREASE_NEGATION_LEVEL_TRADEOFF").push(pair);
      } else if (rewrittenNegationLevel === 0) {
        formulas.get("ELIMINATE_NEGATION").push(pair);
      } else {
        formulas.get("REDUCE_NEGATION_COUNT").push(pair);
      }
    }

    if (i === 2) {
      formulas.get("REDUCE_NEGATION_LEVEL").push(pair);
    }

    if (i === 3) {
      formulas.get("REDUCE_OPERATOR_COUNT").push(pair);
    }

    if (i === 4) {

      const rewrittenOperatorCount = rewritten.operatorCount();

      if (rewrittenOperatorCount > origOperatorCount) {
        formulas.get("REDUCE_OPERATOR_NESTING_INCREASE_OPERATOR_COUNT_TRADEOFF_DNF").push(pair);
      } else {
        formulas.get("REDUCE_OPERATOR_NESTING").push(pair);
      }
    }

    if (i === 5) {
      formulas.get("REDUCE_OPERATOR_NESTING_INCREASE_OPERATOR_COUNT_TRADEOFF_CNF").push(pair);
    }

    if (!original.validateEquals(rewritten)) {
      throw new Error("Error in formulas table. Formula " + formula + " and " + rewritten + " are not semantically equivalent!");
    }
  }

}


export function parseTable(formulas, path) {

  return new Promise((resolve, reject) => {

    const readStream = fs.createReadStream(path);
    const readInterface = readline.createInterface({input: readStream});

    readInterface.on("line", (line) => readLine(line, formulas));
    readInterface.on("error", (err) => {
      console.log("Error processing CSV table: " + err);
      reject();
    });
    readInterface.on("close", () => {
      console.log("Finish processing CSV table");
      resolve();
    });
  });

}



export function parseFollowupTable(formulas, path) {

  return new Promise((resolve, reject) => {

    const readStream = fs.createReadStream(path);
    const readInterface = readline.createInterface({input: readStream});

    readInterface.on("line", (line) => {


      const cells = line.split(",");
      if (cells[0] === "Original") return;

      const original = parseFormula(cells[0]);
      const rewritten = parseFormula(cells[1]);

      formulas.push([original, rewritten]);

    });
    readInterface.on("error", (err) => {
      console.log("Error processing CSV table: " + err);
      reject();
    });
    readInterface.on("close", () => {
      console.log("Finish processing CSV table");
      resolve();
    });
  });

}





function getRandomInt(max) {
  return Math.floor(Math.random() * max);
};

export function prepareQuestions(formulas) {

    const questions = [];

    for (const category of formulas.keys()) {

      const categoryPairs = formulas.get(category);

      let pair = null;
      do {
        pair = categoryPairs[getRandomInt(categoryPairs.length)];
      } while (questions.map((q) => q.formula).includes(pair.original));

      const literalsSet = pair.original.literalCount();
      const assgnLength = getRandomInt(3) + literalsSet.size - 2;
      const assgn = new Map();
      const literals = [...literalsSet];

      for (let i = 0; i < assgnLength; i++) {

        let variable = null;
        do {
          variable = literals[getRandomInt(literals.length)];
        } while ([...assgn.keys()].includes(variable));

        assgn.set(variable, getRandomInt(2) === 0);
      }

      const sorted = new Map([...assgn].sort());

      const result = pair.original.evaluate(assgn);

      questions.push({category: category, isOriginal:true, formula:pair.original, assignment:sorted, result:result});
      questions.push({category: category, isOriginal:false, formula:pair.rewritten, assignment:sorted, result:result});
    }

    // Shuffle questions array
    for (let i = questions.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions;
}




export function prepareFollowupQuestions(formulas) {

    const TEST_SIZE = 8;

    const questions = new Array();

    for (let index = 0; index < TEST_SIZE; index++) {

      let pair = null;
      do {
        pair = formulas[getRandomInt(formulas.length)];
      } while (questions.map((q) => q.formula).includes(pair[0]));

      const literalsSet = pair[0].literalCount();
      const assgnLength = getRandomInt(3) + literalsSet.size - 2;
      const assgn = new Map();
      const literals = [...literalsSet];

      for (let i = 0; i < assgnLength; i++) {

        let variable = null;
        do {
          variable = literals[getRandomInt(literals.length)];
        } while ([...assgn.keys()].includes(variable));

        assgn.set(variable, getRandomInt(2) === 0);
      }

      const sorted = new Map([...assgn].sort());

      const result = pair[0].evaluate(assgn);

      questions.push({index:index, isOriginal:true, formula:pair[0], assignment:sorted, result:result});
      questions.push({index:index, isOriginal:false, formula:pair[1], assignment:sorted, result:result});
    }

    // Shuffle questions array
    for (let i = questions.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions;

}

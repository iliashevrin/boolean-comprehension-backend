// Generated from language/BooleanFormula.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';

// This class defines a complete generic visitor for a parse tree produced by BooleanFormulaParser.

export default class BooleanFormulaVisitor extends antlr4.tree.ParseTreeVisitor {

	// Visit a parse tree produced by BooleanFormulaParser#formula.
	visitFormula(ctx) {
	  return this.visitChildren(ctx);
	}



}
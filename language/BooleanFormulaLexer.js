// Generated from language/BooleanFormula.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';


const serializedATN = [4,0,8,44,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,
7,4,2,5,7,5,2,6,7,6,2,7,7,7,1,0,1,0,1,1,1,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,
1,3,1,4,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,1,6,1,6,1,7,1,7,0,0,8,1,
1,3,2,5,3,7,4,9,5,11,6,13,7,15,8,1,0,0,43,0,1,1,0,0,0,0,3,1,0,0,0,0,5,1,
0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,1,0,0,0,1,17,
1,0,0,0,3,19,1,0,0,0,5,21,1,0,0,0,7,25,1,0,0,0,9,29,1,0,0,0,11,34,1,0,0,
0,13,40,1,0,0,0,15,42,1,0,0,0,17,18,5,33,0,0,18,2,1,0,0,0,19,20,5,40,0,0,
20,4,1,0,0,0,21,22,5,32,0,0,22,23,5,124,0,0,23,24,5,32,0,0,24,6,1,0,0,0,
25,26,5,32,0,0,26,27,5,38,0,0,27,28,5,32,0,0,28,8,1,0,0,0,29,30,5,32,0,0,
30,31,5,45,0,0,31,32,5,62,0,0,32,33,5,32,0,0,33,10,1,0,0,0,34,35,5,32,0,
0,35,36,5,60,0,0,36,37,5,45,0,0,37,38,5,62,0,0,38,39,5,32,0,0,39,12,1,0,
0,0,40,41,5,41,0,0,41,14,1,0,0,0,42,43,2,65,71,0,43,16,1,0,0,0,1,0,0];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

export default class BooleanFormulaLexer extends antlr4.Lexer {

    static grammarFileName = "BooleanFormula.g4";
    static channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	static modeNames = [ "DEFAULT_MODE" ];
	static literalNames = [ null, "'!'", "'('", "' | '", "' & '", "' -> '", 
                         "' <-> '", "')'" ];
	static symbolicNames = [ null, null, null, null, null, null, null, null, 
                          "CONST" ];
	static ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", 
                      "CONST" ];

    constructor(input) {
        super(input)
        this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.atn.PredictionContextCache());
    }
}

BooleanFormulaLexer.EOF = antlr4.Token.EOF;
BooleanFormulaLexer.T__0 = 1;
BooleanFormulaLexer.T__1 = 2;
BooleanFormulaLexer.T__2 = 3;
BooleanFormulaLexer.T__3 = 4;
BooleanFormulaLexer.T__4 = 5;
BooleanFormulaLexer.T__5 = 6;
BooleanFormulaLexer.T__6 = 7;
BooleanFormulaLexer.CONST = 8;




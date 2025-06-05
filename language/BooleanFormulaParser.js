// Generated from language/BooleanFormula.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';
import BooleanFormulaListener from './BooleanFormulaListener.js';
import BooleanFormulaVisitor from './BooleanFormulaVisitor.js';

const serializedATN = [4,1,8,19,2,0,7,0,1,0,3,0,4,8,0,1,0,1,0,1,0,1,0,1,
0,4,0,11,8,0,11,0,12,0,12,1,0,1,0,3,0,17,8,0,1,0,0,0,1,0,0,1,1,0,3,6,20,
0,3,1,0,0,0,2,4,5,1,0,0,3,2,1,0,0,0,3,4,1,0,0,0,4,16,1,0,0,0,5,17,5,8,0,
0,6,7,5,2,0,0,7,10,3,0,0,0,8,9,7,0,0,0,9,11,3,0,0,0,10,8,1,0,0,0,11,12,1,
0,0,0,12,10,1,0,0,0,12,13,1,0,0,0,13,14,1,0,0,0,14,15,5,7,0,0,15,17,1,0,
0,0,16,5,1,0,0,0,16,6,1,0,0,0,17,1,1,0,0,0,3,3,12,16];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class BooleanFormulaParser extends antlr4.Parser {

    static grammarFileName = "BooleanFormula.g4";
    static literalNames = [ null, "'!'", "'('", "' | '", "' & '", "' -> '", 
                            "' <-> '", "')'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             "CONST" ];
    static ruleNames = [ "formula" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = BooleanFormulaParser.ruleNames;
        this.literalNames = BooleanFormulaParser.literalNames;
        this.symbolicNames = BooleanFormulaParser.symbolicNames;
    }



	formula() {
	    let localctx = new FormulaContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, BooleanFormulaParser.RULE_formula);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 3;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===1) {
	            this.state = 2;
	            localctx.negated = this.match(BooleanFormulaParser.T__0);
	        }

	        this.state = 16;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 8:
	            this.state = 5;
	            localctx.literal = this.match(BooleanFormulaParser.CONST);
	            break;
	        case 2:
	            this.state = 6;
	            this.match(BooleanFormulaParser.T__1);
	            this.state = 7;
	            localctx._formula = this.formula();
	            localctx.elements.push(localctx._formula);
	            this.state = 10; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            do {
	                this.state = 8;
	                localctx.op = this._input.LT(1);
	                _la = this._input.LA(1);
	                if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 120) !== 0))) {
	                    localctx.op = this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 9;
	                localctx._formula = this.formula();
	                localctx.elements.push(localctx._formula);
	                this.state = 12; 
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            } while((((_la) & ~0x1f) === 0 && ((1 << _la) & 120) !== 0));
	            this.state = 14;
	            this.match(BooleanFormulaParser.T__6);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

BooleanFormulaParser.EOF = antlr4.Token.EOF;
BooleanFormulaParser.T__0 = 1;
BooleanFormulaParser.T__1 = 2;
BooleanFormulaParser.T__2 = 3;
BooleanFormulaParser.T__3 = 4;
BooleanFormulaParser.T__4 = 5;
BooleanFormulaParser.T__5 = 6;
BooleanFormulaParser.T__6 = 7;
BooleanFormulaParser.CONST = 8;

BooleanFormulaParser.RULE_formula = 0;

class FormulaContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = BooleanFormulaParser.RULE_formula;
        this.negated = null;
        this.literal = null;
        this._formula = null;
        this.elements = [];
        this.op = null;
    }

	CONST() {
	    return this.getToken(BooleanFormulaParser.CONST, 0);
	};

	formula = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(FormulaContext);
	    } else {
	        return this.getTypedRuleContext(FormulaContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof BooleanFormulaListener ) {
	        listener.enterFormula(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof BooleanFormulaListener ) {
	        listener.exitFormula(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof BooleanFormulaVisitor ) {
	        return visitor.visitFormula(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




BooleanFormulaParser.FormulaContext = FormulaContext; 

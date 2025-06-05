grammar BooleanFormula;

formula:
	(negated='!')? 
	(
		literal=CONST | 
		( '(' elements+=formula (op=( ' | ' | ' & ' | ' -> ' | ' <-> ' ) elements+=formula)+ ')' )
	);

CONST:
  	'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
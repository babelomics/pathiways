var tables = [
{
	name : "PATHIWAY_INDIVIDUAL_TABLE",
	colNames : ["Subpathway Name","Mean","Upper limit","Lower Limit", "UP/DOWN", "Significance"],
	colTypes : ["string","string","string","string","string","string"],
	colVisibility : [1,1,1,1,1,1],
	colOrder : [0,1,2,3,4,5]
},
{
	name : "PATHIWAY_SUMMARY_TABLE",
	colNames : ["Pathway Name","Mean","Upper limit","Lower Limit", "UP/DOWN",  "Significance", "SubpathsUP(sign)","SubpathsDOWN(sign)","SubpathsNEUTRAL(sign)"],
	colTypes : ["string","string","string","string","string","string","string","string","string"],
	colVisibility : [1,1,1,1,1,1,1,1,1],
	colOrder : [0,1,2,3,4,5,6,7,8]
},
{
    name : "PATHIWAY_WILCOXON_TABLE",
    colNames : ["Subpathway Name","p-value","FDR p-value","UP/DOWN"],
    colTypes : ["string","string","string","string"],
    colVisibility : [1,1,1,1],
    colOrder : [0,1,2,3]
},
{
    name : "PATHIWAY_WILCOXON_SUMMARY",
    colNames : ["Pathway Name","SubpathsUP(sign)","SubpathsDOWN(sign)"],
    colTypes : ["string","string","string","string"],
    colVisibility : [1,1,1,1],
    colOrder : [0,1,2,3]
}
];

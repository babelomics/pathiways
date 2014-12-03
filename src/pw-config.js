//OPENCGA_HOST = "http://ws.bioinfo.cipf.es/opencga/rest";
//OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencga/rest";
OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencga-server-0.2.0/rest";
//OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencga-staging/rest";

if(window.location.host.indexOf("fsalavert")!=-1 ||
   window.location.host.indexOf("rsanchez")!=-1 ||
   window.location.host.indexOf("imedina")!=-1 ||
   window.location.href.indexOf("http://bioinfo.cipf.es/apps-beta")!=-1
){
//	OPENCGA_HOST = "http://mem15:8080/opencga/rest";
//	OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencga/rest";
//	OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencga-server-beta/rest";
}

SUITE_INFO = '<div style=" width: 800px;">'
    + '<h4>Overview</h4><br>'
    + '<h3>PATHiWAYS</h3>'
    + '<p align="justify">PATHiWAYS is a web tool for the interpretation of the consequences of the combined changes in expression levels of genes in the context of signaling pathways. Specifically, this tool allows the user to identify the stimulus-response subpathways that are significantly activated or deactivated in the typical case/control experiment. PATHiWAYS identifies all the stimulus-response subpathways of KEGG signaling pathways, calculates the probability of activation of each one, based on the individual gene expression values and identifies those with a significant differential activity between the two conditions compared.</p>'
    + '<br>'
    + '<h3>PATHiPRED</h3>'
    + '<p align="justify">The aim of PATHiPRED web tool is to provide a classifier that takes advantage of the activity values of signal transduction along the elementary components of signaling pathways. PATHiPRED differentiates between two classes or a continuous variable using activation probabilities of stimulus-response sub-pathways calculated by PATHiWAYS methodology. PATHiPRED performs a SVM modelling with cross-validation and the results include the prediction model, the statistical parameters that assess the goodness of the model, the confusion matrix of the prediction, the activation probabilities matrix, the mechanism-based biomarkers and pathways graphs with the selected sub-pathways highlighted. Moreover, the prediction model obtained can be applied to a new dataset within PATHiPRED web tool.</p>'
    + '<br>'
    + '<p align="justify"><h4>Note</h4><br>This web application makes an intensive use of new web technologies and standards like HTML5, so browsers that are fully supported for this site are: Chrome 14+, Firefox 7+, Safari 5+ and Opera 11+. Older browser like Chrome13-, Firefox 5- or Internet Explorer 9 may rise some errors. Internet Explorer 6 and 7 are no supported at all.</p>'
    + '</div>';





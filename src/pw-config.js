//OPENCGA_HOST = "http://ws.bioinfo.cipf.es/opencga/rest";
OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencga/rest";

if(window.location.host.indexOf("fsalavert")!=-1 ||
   window.location.host.indexOf("rsanchez")!=-1 ||
   window.location.host.indexOf("imedina")!=-1 ||
   window.location.href.indexOf("http://bioinfo.cipf.es/apps-beta")!=-1
){
//	OPENCGA_HOST = "http://mem15:8080/opencga/rest";
//	OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencga/rest";
//	OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencgabeta/rest";
}

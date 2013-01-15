function Pathiways (targetId,args){
	var _this=this;
	this.id = "Pathiways"+ Math.round(Math.random()*10000);
	this.suiteId = 22;
	this.tools = ["pathiways"];
	this.title = '<span class="emph">Path</span>i<span class="emph">ways</span>';
	this.title = 'PATH<span class="emph">i</span>WAYS';
	this.description = "";
	this.wum=true;
	
	
	this.width =  $(window).width();
	this.height = $(window).height();
	this.targetId=document.body;
	
	if (targetId != null){
		this.targetId=targetId;
	}
	if (args != null){
		if(args.wum != null){
			this.wum = args.wum;
		}
	}
	this.args = args;
	
	
		/** ID for sencha components**/
	this.eastPanelId = this.id + "_eastPanelID";
	this.centerPanelId = this.id + "_centerPanelID";
	
	/** create widgets **/
//	this.resultWidget = new ResultWidget({targetId:this.centerPanelId});
	
	this.jobListWidget = new JobListWidget({
		"timeout":4000,
		"suiteId":this.suiteId,
		"tools":this.tools,
		"pagedViewList":{
			"title": 'Jobs',
			"pageSize": 7, 
			"targetId": this.eastPanelId,
			"order" : 0,
			"width": 280,
			"height": 650,
			"mode":"view"
		}
	});
	//this.dataListWidget = new DataListWidget({
		//"timeout":4000,
		//"suiteId":this.suiteId,
		//"pagedViewList":{
			//"title": 'Data',
			//"pageSize": 7,
			//"targetId": this.eastPanelId,
			//"order" : 1,
			//"width": 280,
			//"height": 650,
			//"mode":"view"  //allowed grid | view
		//}
	//});
	
	
	/**Atach events i listen**/
	this.jobListWidget.pagedListViewWidget.onItemClick.addEventListener(function (sender, record){
		_this.jobItemClick(record);
	});
	
	//this.dataListWidget.pagedListViewWidget.onItemClick.addEventListener(function (sender, record){
		//_this.dataItemClick(record);		
	//});
	
	
	if (this.wum==true){
		this.headerWidget = new HeaderWidget({
			appname: this.title,
			description: this.description,
			suiteId : this.suiteId
		});
		
		/**Atach events i listen**/
		this.headerWidget.onLogin.addEventListener(function (sender){
			Ext.example.msg('Welcome', 'You logged in');
			_this.sessionInitiated();
		});
		
		this.headerWidget.onLogout.addEventListener(function (sender){
			Ext.example.msg('Good bye', 'You logged out');
			_this.sessionFinished();
		});

		this.headerWidget.gcsaBrowserWidget.onNeedRefresh.addEventListener (function (sender) {
			_this.getAccountInfo();
		});
		
		this.headerWidget.adapter.onGetAccountInfo.addEventListener(function (evt, response){
			_this.setAccountInfo(response);
		});
		
		this.headerWidget.userBarWidget.onProjectChange.addEventListener(function (sender){
			_this.jobListWidget.getResponse();
		});
	}
	//RESIZE EVENT
	$(window).smartresize(function(a){
		_this.setSize($(window).width(),$(window).height());
	});
	
};

Pathiways.prototype.sessionInitiated = function(){
	/*action buttons*/
	Ext.getCmp(this.id+"btnPathi").enable();
	
	Ext.getCmp(this.eastPanelId).expand();//se expande primero ya que si se hide() estando collapsed peta.
	Ext.getCmp(this.eastPanelId).show();

	/**LOAD GCSA**/
	this.getAccountInfo();//first call
	this.accountInfoInterval = setInterval(function(){_this.getAccountInfo();}, 4000);
	
	//this.jobListWidget.draw();
	//this.dataListWidget.draw();
	
};

Pathiways.prototype.sessionFinished = function(){
	/*action buttons*/
	Ext.getCmp(this.id+"btnPathi").disable();
	
	Ext.getCmp(this.eastPanelId).expand(); //se expande primero ya que si se hide() estando collapsed peta.
	Ext.getCmp(this.eastPanelId).hide();
	this.jobListWidget.clean();
	//this.dataListWidget.clean();
	
	while(Ext.getCmp(this.centerPanelId).items.items.length>1){
		Ext.getCmp(this.centerPanelId).remove(Ext.getCmp(this.centerPanelId).items.items[Ext.getCmp(this.centerPanelId).items.items.length-1]);
	}


	this.accountData = null;
	clearInterval(this.accountInfoInterval);

//	console.log(this.centerPanel.items.items)
//	this.centerPanel.removeChildEls(function(o) { return o.title != 'Home'; });
};

Pathiways.prototype.setAccountInfo = function(response) {
	_this = this;
	console.log("checking account info");
	console.log(response);
	if(response.accountId != null){
		this.accountData = response;
		this.headerWidget.setAccountData(_this.accountData);
		this.jobListWidget.setAccountData(_this.accountData);
		console.log("accountData has been modified since last call");
	}
};

Pathiways.prototype.getAccountInfo = function() {
	_this = this;
	var lastActivity = null;
	if(this.accountData != null){
		lastActivity =  this.accountData.lastActivity;
	}
	this.headerWidget.adapter.getAccountInfo($.cookie('bioinfo_account'), $.cookie('bioinfo_sid'), lastActivity);
};

Pathiways.prototype.setSize = function(width,height){
	if(width<500){width=500;}
	if(width>2400){width=2400;}//if bigger does not work TODO why?
	
	this.width=width;
	this.height=height;
	
	this._wrapPanel.setSize(width,height);
	
	this.getPanel().setSize(width,height-this.headerWidget.height);
	if(this.genomeViewer!=null){
		this.genomeViewer.setSize(Ext.getCmp(this.id+"_vcfViewer").getWidth(),Ext.getCmp(this.id+"_vcfViewer").getHeight());
	}
	
	this.headerWidget.setWidth(width);
	
	if(Ext.getCmp(this.jobListWidget.pagedListViewWidget.id+"view")!=null){
		Ext.getCmp(this.jobListWidget.pagedListViewWidget.id+"view").setSize(null,height-200);
		//Ext.getCmp(this.dataListWidget.pagedListViewWidget.id+"view").setSize(null,height-200);
	}
};

/** appInterface **/
Pathiways.prototype.draw = function(){
	
	if(this._wrapPanel==null){
		this._wrapPanel = Ext.create('Ext.panel.Panel', {
			renderTo:this.targetId,
//			renderTo:Ext.getBody(),
//			layout: {type:'vbox', align:'strech'},
			border:0,
			width:this.width,
			height:this.height,
			items: [this.headerWidget.getPanel(),this.getPanel()]
		});
	}
	if($.cookie('bioinfo_sid') != null){
		this.sessionInitiated();
	}else{
		this.sessionFinished();
	}
};



/*****/
Pathiways.prototype.getMenu = function(){
	var _this=this;
   var menuBarItems = [
		{
			id:this.id+"btnPathi",
			disabled:true,
			text: '<span class="emph">Press to run PATHiWAYS<span>',
			handler: function(){
				_this.showPathi();
			}
		}
//		{
//			id:this.id+"grnViewer",
//			disabled:true,
//		    text: 'GRN Viewer',
//			handler: function(){
//				_this.showGRNViewer();
//		    }
//		}
    ];
	var menubar = new Ext.create('Ext.toolbar.Toolbar', {
		dock: 'top',
		cls:'bio-menubar',
		height:27,
		padding:'0 0 0 10',
		style : 'border: 1',
		region:'north',
		minHeight:27,
		maxHeight:27,
		items:menuBarItems
	});
	return menubar;
};


Pathiways.prototype.jobItemClick = function (record){
	this.jobId = record.data.id;
	var _this=this;
	if(record.data.visites >= 0 ){
		
		if(!Ext.getCmp(this.eastPanelId).isHidden() || Ext.getCmp(this.eastPanelId).collapsed){
			Ext.getCmp(this.eastPanelId).collapse();
		}
		resultWidget = new ResultWidget({targetId:this.centerPanelId,application:'pathiway',app:this});
//		resultWidget.onRendered.addEventListener(function (sender, targetId){
//			_this.createGenomeMaps(targetId);
//		});
		resultWidget.draw($.cookie('bioinfo_sid'),record);
		//TODO: borrar
		this.resultWiget = resultWidget;
		
//		this.resultWidget.draw($.cookie('bioinfo_sid'),record);
	}
};
Pathiways.prototype.dataItemClick = function (record){
//	console.log(record.data.name);
//	_this.adapter.-------(record.data.DATAID, "js", $.cookie('bioinfo_sid'));	
};


Pathiways.prototype.showPathi = function (){
	var _this=this;
	pathiwaysForm = new PathiwaysForm(this);
	if(Ext.getCmp(pathiwaysForm.panelId)==null){
		var panel = pathiwaysForm.draw({title: "PATHiWAYS"});
		Ext.getCmp(this.centerPanelId).add(panel);
//		pathiwaysForm.onRun.addEventListener(function(sender,data){
//			Ext.getCmp(_this.eastPanelId).expand();
//		});
	}
	Ext.getCmp(this.centerPanelId).setActiveTab(Ext.getCmp(pathiwaysForm.panelId));
};

Pathiways.prototype.showGRNViewer= function (){
var _this = this;
	this.grnViewer = Ext.getCmp(this.id+"_grnViewer");
	if(this.grnViewer==null) {
		//Collapse to calculate width for CellBrowser
		pan = 26;
		if(!Ext.getCmp(this.eastPanelId).isHidden() || Ext.getCmp(this.eastPanelId).collapsed){
			Ext.getCmp(this.eastPanelId).collapse();
			pan=0;
		}
		var cellBrowserContainer = Ext.create('Ext.container.Container', {
			id:this.id+'contGRNViewer'
//			html:'<div id=grnViewerCellBrowser></div>'
		});
		
		this.grnViewer = Ext.create('Ext.panel.Panel', {
			id:this.id+"_grnViewer",
			border: false,
		    title: "Workspace",
//		    closable:true,
		    items: cellBrowserContainer
//		    autoScroll:true
		});
		
		Ext.getCmp(this.centerPanelId).add(this.grnViewer);

		//Once actived, the div element is visible, and CellBrowser can be rendered
		Ext.getCmp(this.centerPanelId).setActiveTab(this.grnViewer);
		this.networkViewer = new NetworkViewer(this.id+'contGRNViewer', {
			width:this.grnViewer.getWidth()-(0/*15+pan*/),
			height:this.grnViewer.getHeight()-0/*26*/,
			//menuBar:this.getMenuBar(),
			overview:true,
			version:'<span class="info">Cell Browser v'+this.version+'</span>'
		});
//		this.networkViewer.setSpeciesMenu(AVAILABLE_SPECIES);
		this.networkViewer.draw();
		
		this.nodeAttributeEditWidget = new AttributeEditWidget(this.networkViewer.getNetworkData().getNodeAttributes(), "Node");
		this.nodeAttributeFilterWidget = new AttributeFilterWidget(this.networkViewer.getNetworkData().getNodeAttributes(), "Node");
		
		this.edgeAttributeEditWidget = new AttributeEditWidget(this.networkViewer.getNetworkData().getEdgeAttributes(), "Edge");
		this.edgeAttributeFilterWidget = new AttributeFilterWidget(this.networkViewer.getNetworkData().getEdgeAttributes(), "Edge");
		
		this.networkViewer.onSelectionChange.addEventListener(function(sender,data){
			if(Ext.getCmp("editNodeAttrWindow")){
				_this.nodeAttributeEditWidget.selectRowsById(data);
			}
			if(Ext.getCmp("filterNodeAttrWindow")){
				_this.nodeAttributeFilterWidget.selectRowsById(data);
			}
		});
		
		this.nodeAttributeEditWidget.onSelectNodes.addEventListener(function(sender, data) {
			_this.networkViewer.selectNodes(data);
		});
		
		this.nodeAttributeFilterWidget.onSelectNodes.addEventListener(function(sender, data) {
			_this.networkViewer.selectNodes(data);
		});
		
		this.nodeAttributeFilterWidget.onDeselectNodes.addEventListener(function() {
			_this.networkViewer.deselectAllNodes();
		});
		
		this.nodeAttributeFilterWidget.onFilterNodes.addEventListener(function(sender, data) {
			_this.networkViewer.filterNodes(data);
		});
		
		this.nodeAttributeFilterWidget.onRestoreNodes.addEventListener(function() {
			_this.networkViewer.refresh();
		});


		_this.networkViewer
	}
	else {
		Ext.getCmp(this.centerPanelId).setActiveTab(this.grnViewer);
	}
};


Pathiways.prototype.getPanel = function(){
	
	if(this._centerPanel == null){
		
	//		var loginButton = new Ext.create('Ext.button.Button', {
	//		text:'Sign in',
	//		margin: '0 0 20 0',
	//		handler: function (){
	////			if($.cookie('bioinfo_sid') != null && $.cookie('bioinfo_sid') != "")
	////				this.hide();
	//		}
	//	});
	
		//background-image:url(\'http:\/\/jsapi.bioinfo.cipf.es\/libs\/resources\/img\/wordle_tuned_white_crop.jpg\')
		var suiteInfo =  '<div style=" width: 800px;">'
			+'<h1>Overview</h1><br>'
			+'<span align="justify">PATHiWAYS is a web tool for the interpretation of the consequences of the combined changes in expression levels of genes in the context of signaling pathways. Specifically, this tool allows the user to identify the stimulus-response subpathways that are significantly activated or deactivated in the typical case/control experiment. PATHiWAYS identifies all the stimulus-response subpathways of KEGG signaling pathways, calculates the probability of activation of each one, based on the individual gene expression values and identifies those with a significant differential activity between the two conditions compared.</span>'
			+'<br><br><br>'
			+'<p align="justify"><h1>Note</h1><br>This web application makes an intensive use of new web technologies and standards like HTML5, so browsers that are fully supported for this site are: Chrome 14+, Firefox 7+, Safari 5+ and Opera 11+. Older browser like Chrome13-, Firefox 5- or Internet Explorer 9 may rise some errors. Internet Explorer 6 and 7 are no supported at all.</p>'
			+'</div>';
		
		var loginInfo='<br><br><br><h1>Sign in</h1><br><p style=" width: 800px;">You must be logged in to use this Web application, you can <b><i>register</i></b> or use a <b><i>anonymous user</i></b> as shown in the following image by clicking on the <b><i>"Sign in"</i></b> button on the top bar</p><br><div style="float:left;"><img src="http://jsapi.bioinfo.cipf.es/libs/resources/img/loginhelpbutton.png"></div><img src="http://jsapi.bioinfo.cipf.es/libs/resources/img/loginhelp.png">';
		var homeLeft = Ext.create('Ext.panel.Panel', {
	//		title:'Home',
			padding : 30,
			border:false,
			autoScroll:true,
			html: suiteInfo+loginInfo,
			bodyPadding:30,
			flex:1
		});
	//	var homeRight = Ext.create('Ext.panel.Panel', {
	////		title:'Home',
	//		border:false,
	////		html:'<h1>Sign in</h1><br><p>You must be logged in to use this Web application, you can register or use a <i>anonymous</i> as shown in the following image.</p><br><img src="http://jsapi.bioinfo.cipf.es/libs/resources/img/loginhelp.png">',
	////		items:loginButton,
	//		bodyPadding:30,
	//		flex:0.3
	//	});
		
		var homepanel = Ext.create('Ext.panel.Panel', {
	//		padding : 30,
//			margin:"10 0 0 0",
			title:'Home',
	//		html: suiteInfo,
			border:0,
			layout: {
		        type: 'vbox',
		        align: 'stretch'
		    },
			items: [homeLeft]
		});
		var centerPanel = Ext.create('Ext.tab.Panel', {
			id: this.centerPanelId,
			region: 'center',
			border:false,
			activeTab: 0,
			items : homepanel
		});
		
		this._centerPanel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border:false,
			width:this.width,
			height:this.height-this.headerWidget.height,
			items:[centerPanel,this.getMenu(),this.getEastPanel()]
		});
		
	}
	
	return this._centerPanel;
};

Pathiways.prototype.getEastPanel = function(){
	//var eastPanel = Ext.create('Ext.tab.Panel', {
	var eastPanel = Ext.create('Ext.panel.Panel', {
		id: this.eastPanelId,
		region: 'east',
		style : 'border: 0',
		//title: 'Jobs & Data list',
		title: 'Jobs',
		collapsible : true,
		titleCollapse: true,
		animCollapse : false,
		width:280,
		collapseDirection:'top',
		activeTab:0
	});
	return eastPanel;
};

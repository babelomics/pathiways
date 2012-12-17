function Pathiways (targetId,args){
	var _this=this;
	this.id = "Pathiways"+ Math.round(Math.random()*10000);
	this.suiteId = 6;
//	this.title = 'Variant analysis tool';
	this.title = '<span class="emph">Path</span>i<span class="emph">ways</span>';
	this.title = 'Path<span class="emph">i</span>ways';
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
	Ext.getCmp(this.id+"btnVariantEffect").enable();
	Ext.getCmp(this.id+"btnVcfViewer").enable();
	Ext.getCmp(this.id+"btnVCFTools").enable();
	
	Ext.getCmp(this.eastPanelId).expand();//se expande primero ya que si se hide() estando collapsed peta.
	Ext.getCmp(this.eastPanelId).show();

	/**LOAD GCSA**/
	this.getAccountInfo();//first call
	this.accountInfoInterval = setInterval(function(){_this.getAccountInfo();}, 4000);
	
	this.jobListWidget.draw();
	//this.dataListWidget.draw();
	
};

Pathiways.prototype.sessionFinished = function(){
	/*action buttons*/
	Ext.getCmp(this.id+"btnVariantEffect").disable();
	Ext.getCmp(this.id+"btnVcfViewer").disable();
	
	Ext.getCmp(this.eastPanelId).expand(); //se expande primero ya que si se hide() estando collapsed peta.
	Ext.getCmp(this.eastPanelId).hide();
	this.jobListWidget.clean();
	this.dataListWidget.clean();
	
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
	console.log("checking account info")
	console.log(response)
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
		Ext.getCmp(this.dataListWidget.pagedListViewWidget.id+"view").setSize(null,height-200);
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
			id:this.id+"btnVCFTools",
			text: 'VCF Tools',
			disabled:true,
			handler: function(){
				_this.showVCFtools();
			}
		},
		{
			id:this.id+"btnGWAS",
			text: 'GWAS',
			disabled:true,
			hidden:true,
			handler: function(){
				
			}
		},
		{
			id:this.id+"btnVariantEffect",
			text: 'Variant effect',
			disabled:true,
			handler: function(){
				_this.showVariantEffect();
			}
		},
		{
			id:this.id+"btnVcfViewer",
		    text: 'VCF Viewer',
			disabled:true,
			handler: function(){
				_this.showVCFviewer();
		    }
		}
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
	this.jobId = record.data.jobId;
	var _this=this;
	if(record.data.visites >= 0 ){
		
		if(!Ext.getCmp(this.eastPanelId).isHidden() || Ext.getCmp(this.eastPanelId).collapsed){
			Ext.getCmp(this.eastPanelId).collapse();
		}
		
		resultWidget = new ResultWidget({targetId:this.centerPanelId,application:'variant',app:this});
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


Pathiways.prototype.showVariantEffect= function (){
	var _this=this;
	variantEffectJobFormPanel = new VariantEffectJobFormPanel({suiteId:this.suiteId});
	if(Ext.getCmp(variantEffectJobFormPanel.panelId)==null){
		variantEffectJobFormPanel.draw();
		Ext.getCmp(this.centerPanelId).add(variantEffectJobFormPanel.panel);
		variantEffectJobFormPanel.onRun.addEventListener(function(sender,data){
			Ext.getCmp(_this.eastPanelId).expand();
		});
	}
	Ext.getCmp(this.centerPanelId).setActiveTab(Ext.getCmp(variantEffectJobFormPanel.panelId));
};

Pathiways.prototype.showVCFtools= function (){
	var _this=this;
	vcfToolsJobFormPanel = new VCFToolsJobFormPanel({suiteId:this.suiteId});
	if(Ext.getCmp(vcfToolsJobFormPanel.panelId)==null){
		vcfToolsJobFormPanel.draw();
		Ext.getCmp(this.centerPanelId).add(vcfToolsJobFormPanel.panel);
		vcfToolsJobFormPanel.onRun.addEventListener(function(sender,data){
			Ext.getCmp(_this.eastPanelId).expand();
		});
	}
	Ext.getCmp(this.centerPanelId).setActiveTab(Ext.getCmp(vcfToolsJobFormPanel.panelId));
};

Pathiways.prototype.showVCFviewer = function (){
	var _this=this;
	this.vcfViewer = Ext.getCmp(this.id+"_vcfViewer");
	if(this.vcfViewer==null){
		//Collapse to calculate width for genomeMaps
		pan = 26;
		if(!Ext.getCmp(this.eastPanelId).isHidden() || Ext.getCmp(this.eastPanelId).collapsed){
			Ext.getCmp(this.eastPanelId).collapse();
			pan=0;
		}
		var genomeMapsContainer = Ext.create('Ext.container.Container', {
			id:this.id+'contVCFViewer'
		});
		
		this.vcfViewer = Ext.create('Ext.panel.Panel', {
			id:this.id+"_vcfViewer",
			border: false,
		    title: "VCF Viewer",
		    closable:true,
		    items: genomeMapsContainer
//		    autoScroll:true
		});
		
		Ext.getCmp(this.centerPanelId).add(this.vcfViewer);

		//Once actived, the div element is visible, and genomeMaps can be rendered
		Ext.getCmp(this.centerPanelId).setActiveTab(this.vcfViewer);
//				
//		console.log(this.vcfViewer.getWidth());
//		console.log(this.vcfViewer.getHeight());
		

		//Parse query params to get location.... Also in AVAILABLE_SPECIES, an example location is set.
		var url = $.url();
		var location = url.param('location');
		if(location != null) {
			var position = location.split(":")[1];
			var chromosome = location.split(":")[0];
		}

		this.genomeViewer = new GenomeViewer(this.id+"contVCFViewer", DEFAULT_SPECIES,{
            availableSpecies: AVAILABLE_SPECIES,
            sidePanelCollapsed:true,
			width:this.vcfViewer.getWidth(),
			height:this.vcfViewer.getHeight()
		});
		
		//var toolbarMenu = Ext.create('Ext.toolbar.Toolbar', {
			//cls:'bio-menubar',
			//height:27,
			//padding:'0 0 0 10',
			//margins : '0 0 0 5',
			//items : [
		 		//{
					//text : 'Add track from VCF file',
					//handler : function() {
						//var vcfFileWidget = new VCFFileWidget({viewer:_this.genomeViewer});
						//vcfFileWidget.draw();
						//vcfFileWidget.onOk.addEventListener(function(sender, event) {
							//console.log(event.fileName);
							//var vcfTrack = new TrackData(event.fileName,{
								//adapter: event.adapter
							//});
							//_this.genomeViewer.addTrack(vcfTrack,{
								//id:event.fileName,
								//featuresRender:"MultiFeatureRender",
									//histogramZoom:80,
								//height:150,
								//visibleRange:{start:0,end:100},
								//featureTypes:FEATURE_TYPES
							//});
						//});
					//}
				//} 
			//]
		//});
		//this.genomeViewer.setMenuBar(toolbarMenu);
		//this.genomeViewer.afterRender.addEventListener(function(sender,event){
			//_this.setTracks(_this.genomeViewer);
		//});
		this.genomeViewer.afterRender.addEventListener(function(sender,event){
			_this.setTracks(_this.genomeViewer);
			_this.genomeViewer.addSidePanelItems(_this.getGMSidePanelItems());
		});
		this.genomeViewer.draw();
	}else{
		Ext.getCmp(this.centerPanelId).setActiveTab(this.vcfViewer);
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
			+'<h1>Overview</h1><br><span align="justify">VARIANT (VARIant ANalysis Tool) can report the functional properties of any variant in all the human, mouse or rat genes (and soon new model organisms will be added) and the corresponding neighborhoods. Also other non-coding extra-genic regions, such as miRNAs are included in the analysis.<br><br>	VARIANT not only reports the obvious functional effects in the coding regions but also analyzes noncoding SNVs situated both within the gene and in the neighborhood that could affect different regulatory motifs, splicing signals, and other structural elements. These include: Jaspar regulatory motifs, miRNA targets, splice sites, exonic splicing silencers, calculations of selective pressures on the particular polymorphic positions, etc.</span>'
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

Pathiways.prototype.setTracks = function(genomeViewer){
	var geneTrack = new TrackData("gene",{
		adapter: new CellBaseAdapter({
			category: "genomic",
			subCategory: "region",
			resource: "gene",
			species: genomeViewer.species,
			featureCache:{
				gzip: true,
				chunkSize:50000
			}
		})
	});
	genomeViewer.trackSvgLayoutOverview.addTrack(geneTrack,{
		id:"gene",
		type:"gene",
		featuresRender:"MultiFeatureRender",
		histogramZoom:10,
		labelZoom:20,
		height:150,
		visibleRange:{start:0,end:100},
		titleVisibility:'hidden',
		featureTypes:FEATURE_TYPES
	});
	//end region track
	
	
	var seqtrack = new TrackData("Sequence",{
		adapter: new SequenceAdapter({
			category: "genomic",
			subCategory: "region",
			resource: "sequence",
			species: genomeViewer.species,
			featureCache:{
				gzip: true,
				chunkSize:1000
			}
		})
	});
	genomeViewer.addTrack(seqtrack,{
		id:"1",
		type:"Sequence",
		title:"Sequenece",
		featuresRender:"SequenceRender",
		height:30,
		visibleRange:{start:100,end:100}
	});

	var geneTrack = new TrackData("Gene/Transcript",{
		adapter: new CellBaseAdapter({
			category: "genomic",
			subCategory: "region",
			resource: "gene",
			species: genomeViewer.species,
			featureCache:{
				gzip: true,
				chunkSize:50000
			}
		})
	});
	genomeViewer.addTrack(geneTrack,{
		id:"2",
		type:"Gene/Transcript",
		title:"Gene/Transcript",
		featuresRender:"GeneTranscriptRender",
		histogramZoom:20,
		transcriptZoom:50,
		height:24,
		visibleRange:{start:0,end:100},
		featureTypes:FEATURE_TYPES
	});
};

Pathiways.prototype.addFileTrack = function(text) {
	var  _this = this;
	var fileWidget = null;
	switch(text){
		case "VCF":  fileWidget = new VCFFileWidget({viewer:_this.genomeViewer}); break;
	}
	if(fileWidget != null){
		fileWidget.draw();
		if (_this.wum){
			_this.headerWidget.onLogin.addEventListener(function (sender){
				fileWidget.sessionInitiated();
			});
			_this.headerWidget.onLogout.addEventListener(function (sender){
				fileWidget.sessionFinished();
			});
		}
		fileWidget.onOk.addEventListener(function(sender, event) {
			var fileTrack = new TrackData(event.fileName,{
				adapter: event.adapter
			});

			var id = Math.round(Math.random()*10000);
			var type = text;
			
			_this.genomeViewer.addTrack(fileTrack,{
				id:id,
				title:event.fileName,
				type:type,
				featuresRender:"MultiFeatureRender",
	//					histogramZoom:80,
				height:150,
				visibleRange:{start:0,end:100},
				featureTypes:FEATURE_TYPES
			});
			
			var title = event.fileName+'-'+id;
			//updateActiveTracksPanel(type, title, id, true);
		});
	}
};

Pathiways.prototype.getGMSidePanelItems = function() {
	var _this = this;
	var st = Ext.create('Ext.data.TreeStore',{
	root:{
		expanded: true,
		children: [
			{ text: "VCF", iconCls:"icon-blue-box", leaf:true}
		]
	}
	});
	return [{
			xtype:"treepanel",
			id:this.id+"availableTracksTree",
			title:"Add VCF track",
			bodyPadding:"10 0 0 0",
			useArrows:true,
			rootVisible: false,
			hideHeaders:true,
			store: st,
			listeners : {
				itemclick : function (este, record, item, index, e, eOpts){
					if(record.isLeaf()){
						_this.addFileTrack("VCF");
					}
				}
			}
	},

	];
}

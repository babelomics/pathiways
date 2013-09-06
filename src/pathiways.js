function Pathiways(args) {
    _.extend(this, Backbone.Events);

    var _this = this;
    this.id = Utils.genId("Pathiways");

    //set default args
    this.suiteId = 22;
    this.title = 'PATH<span class="emph">i</span>WAYS';
    this.description = '';
    this.version = '1.0.10';
    this.tools = ["pathiways"];
    this.border = true;
    this.targetId;
    this.width;
    this.height;


    //set instantiation args, must be last
    _.extend(this, args);

    this.accountData = null;

    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }
}

Pathiways.prototype = {
    render: function (targetId) {
        var _this = this;
        this.targetId = (targetId) ? targetId : this.targetId;
        if ($('#' + this.targetId).length < 1) {
            console.log('targetId not found in DOM');
            return;
        }

        console.log("Initializing Pathiways");
        this.targetDiv = $('#' + this.targetId)[0];
        this.div = $('<div id="pathiways" style="height:100%;"></div>')[0];
        $(this.targetDiv).append(this.div);

        $(this.div).append('<div id="pw-header-widget"></div>');
        $(this.div).append('<div id="pw-menu"></div>');
        this.wrapDiv = $('<div id="pw-wrap" style="height:100%;"></div>')[0];
        $(this.div).append(this.wrapDiv);

        ///
//        <div id="column1-wrap">
//            <div id="column1">Column 1</div>
//        </div>
//        <div id="column2">Column 2</div>

        this.panelDiv = $('<div id="pw-panel"></div>')[0];
        this.sidePanelDiv = $('<div id="pw-sidePanel"></div>')[0];
        $(this.panelDiv).css({
            float: 'left',
            width: 'calc(100% - 280px)'
        });
        $(this.sidePanelDiv).css({
            float: 'right',
            width: 280
        });
        $(this.wrapDiv).append(this.panelDiv);
        $(this.wrapDiv).append(this.sidePanelDiv);
        $(this.wrapDiv).append('<div style="clear:both;"></div>');

        ///
        this.width = ($(this.div).width());
        this.height = ($(this.div).height());

        if (this.border) {
            var border = (Utils.isString(this.border)) ? this.border : '1px solid lightgray';
            $(this.div).css({border: border});
        }

        $(window).resize(function (event) {
            if (event.target == window) {
                if (!_this.resizing) {//avoid multiple resize events
                    _this.resizing = true;
                    _this.setSize($(_this.div).width(), $(_this.div).height());
                    setTimeout(function () {
                        _this.resizing = false;
                    }, 400);
                }
            }
        });

        this.rendered = true;
    },
    draw: function () {
        var _this = this;
        if (!this.rendered) {
            console.info('Pathiways is not rendered yet');
            return;
        }

//        /////////
//
//        /** ID for sencha components**/
//        this.eastPanelId = this.id + "_eastPanelID";
//        this.centerPanelId = this.id + "_centerPanelID";
//
//        /////////


        /* Header Widget */
        this.headerWidget = this._createHeaderWidget('pw-header-widget');

        /* Header Widget */
        this.menu = this._createMenu('pw-menu');


        var topOffset = $('#pw-header-widget').height() + $('#pw-menu').height();
        $(this.panelDiv).css({height: 'calc(100% - ' + topOffset + 'px)'});
        $(this.sidePanelDiv).css({height: 'calc(100% - ' + topOffset + 'px)'});

        /* Wrap Panel */
        this.panel = this._createPanel('pw-panel');

        /* Job List Widget */
        this.jobListWidget = this._createJobListWidget('pw-sidePanel');


        //check login
//        if ($.cookie('bioinfo_sid') != null) {
//            this.sessionInitiated();
//        } else {
//            this.sessionFinished();
//        }
    },
    _createHeaderWidget: function (targetId) {
        var _this = this;
        var headerWidget = new HeaderWidget({
            targetId: targetId,
            autoRender: true,
            appname: this.title,
            description: this.description,
            version: this.version,
            suiteId: this.suiteId,
            accountData: this.accountData
        });
        /**Atach events i listen**/
        headerWidget.onLogin.addEventListener(function (sender) {
            Ext.example.msg('Welcome', 'You logged in');
            _this.sessionInitiated();
        });

        headerWidget.onLogout.addEventListener(function (sender) {
            Ext.example.msg('Good bye', 'You logged out');
            _this.sessionFinished();
        });

        headerWidget.onGetAccountInfo.addEventListener(function (evt, response) {
            _this.setAccountData(response);
        });
        headerWidget.draw();

        return headerWidget;
    },
    _createMenu: function (targetId) {
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            id: this.id + "navToolbar",
            renderTo: targetId,
            cls: 'gm-navigation-bar',
            region: "north",
            width: '100%',
            border: false,
            items: [
                {
                    id: this.id + "btnPathi",
//                    disabled: true,
                    text: '<span class="link emph">Press to run PATHiWAYS<span>',
                    handler: function () {
                        _this.showPathi();
                    }
                }
            ]
        });
        return toolbar;
    },
    _createPanel: function (targetId) {
        var _this = this;

        var homePanel = Ext.create('Ext.panel.Panel', {
//            padding: 30,
//            margin: "10 0 0 0",
            title: 'Home',
//            html: suiteInfo,
            border: 0,
//			layout: {
//		        type: 'vbox',
//		        align: 'stretch'
//		    },
            items: [
                {
                    xtype: 'panel',
//                    title:'Home',
                    padding: 30,
                    border: false,
                    autoScroll: true,
                    html: SUITE_INFO,
                    bodyPadding: 30,
                    flex: 1
                },
                {
                    xtype: 'button',
                    padding: 20,
                    margin: '0 0 0 150',
                    text: 'Run PATHiWAYS',
                    handler: function () {
                        _this.showPathi();
                    }
                }
            ]
        });
        var panel = Ext.create('Ext.tab.Panel', {
            renderTo: targetId,
            width:'100%',
            height:'100%',
            border: 0,
            cls:'ocb-border-top-lightgrey',
            activeTab: 0,
            items: [homePanel]
        });
        return panel;
    },
    _createJobListWidget: function (targetId) {
        var _this = this;

        var jobListWidget = new JobListWidget({
            "timeout": 4000,
            "suiteId": this.suiteId,
            "tools": this.tools,
            "pagedViewList": {
                "title": 'Jobs',
                "pageSize": 7,
                "targetId": targetId,
                "order": 0,
                "width": 280,
                "height": 650,
                "mode": "view"
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
        jobListWidget.pagedListViewWidget.onItemClick.addEventListener(function (sender, record) {
            _this.jobItemClick(record);
        });

        //this.dataListWidget.pagedListViewWidget.onItemClick.addEventListener(function (sender, record){
        //_this.dataItemClick(record);
        //});

        jobListWidget.draw();

        return jobListWidget;
    },


}

Pathiways.prototype.sessionInitiated = function () {
    /*action buttons*/
//	Ext.getCmp(this.id+"btnPathi").enable();

    Ext.getCmp(this.eastPanelId).expand();//se expande primero ya que si se hide() estando collapsed peta.
    Ext.getCmp(this.eastPanelId).show();

    //this.jobListWidget.draw();
    //this.dataListWidget.draw();

};

Pathiways.prototype.sessionFinished = function () {
    /*action buttons*/
//	Ext.getCmp(this.id+"btnPathi").disable();

    Ext.getCmp(this.eastPanelId).expand(); //se expande primero ya que si se hide() estando collapsed peta.
    Ext.getCmp(this.eastPanelId).hide();
    this.jobListWidget.clean();
    //this.dataListWidget.clean();

    while (Ext.getCmp(this.centerPanelId).items.items.length > 1) {
        Ext.getCmp(this.centerPanelId).remove(Ext.getCmp(this.centerPanelId).items.items[Ext.getCmp(this.centerPanelId).items.items.length - 1]);
    }

    this.accountData = null;

//	console.log(this.centerPanel.items.items)
//	this.centerPanel.removeChildEls(function(o) { return o.title != 'Home'; });
};

Pathiways.prototype.setAccountData = function (response) {
    this.accountData = response;
    this.jobListWidget.setAccountData(this.accountData);
};

Pathiways.prototype.setSize = function (width, height) {
    if (width < 500) {
        width = 500;
    }
    if (width > 2400) {
        width = 2400;
    }//if bigger does not work TODO why?

    this.width = width;
    this.height = height;

    this._wrapPanel.setSize(width, height);

    this.getPanel().setSize(width, height - this.headerWidget.height);
    if (this.genomeViewer != null) {
        this.genomeViewer.setSize(Ext.getCmp(this.id + "_vcfViewer").getWidth(), Ext.getCmp(this.id + "_vcfViewer").getHeight());
    }

    this.headerWidget.setWidth(width);

    if (Ext.getCmp(this.jobListWidget.pagedListViewWidget.id + "view") != null) {
        Ext.getCmp(this.jobListWidget.pagedListViewWidget.id + "view").setSize(null, height - 200);
        //Ext.getCmp(this.dataListWidget.pagedListViewWidget.id+"view").setSize(null,height-200);
    }
};


/*****/
//Pathiways.prototype.getMenu = function () {
//    var _this = this;
//    var menuBarItems = [
//        {
//            id: this.id + "btnPathi",
////			disabled:true,
//            text: '<span class="link emph">Press to run PATHiWAYS<span>',
//            handler: function () {
//                _this.showPathi();
//            }
//        }
//    ];
//    var menubar = new Ext.create('Ext.toolbar.Toolbar', {
//        dock: 'top',
//        cls: 'bio-menubar',
//        height: 27,
//        padding: '0 0 0 10',
//        style: 'border: 1',
//        region: 'north',
//        minHeight: 27,
//        maxHeight: 27,
//        defaults: {
//            listeners: {render: function () {
//                this.addCls("x-btn-default-small");
//                this.removeCls("x-btn-default-toolbar-small");
//            }}
//        },
//        items: menuBarItems
//    });
//    return menubar;
//};


Pathiways.prototype.jobItemClick = function (record) {
    this.jobId = record.data.id;
    var _this = this;
    if (record.data.visites >= 0) {

        if (!Ext.getCmp(this.eastPanelId).isHidden() || Ext.getCmp(this.eastPanelId).collapsed) {
            Ext.getCmp(this.eastPanelId).collapse();
        }
        resultWidget = new ResultWidget({targetId: this.centerPanelId, application: 'pathiway', app: this});
//		resultWidget.onRendered.addEventListener(function (sender, targetId){
//			_this.createGenomeMaps(targetId);
//		});
        resultWidget.draw($.cookie('bioinfo_sid'), record);
        //TODO: borrar
        this.resultWiget = resultWidget;

//		this.resultWidget.draw($.cookie('bioinfo_sid'),record);
    }
};
Pathiways.prototype.dataItemClick = function (record) {
//	console.log(record.data.name);
//	_this.adapter.-------(record.data.DATAID, "js", $.cookie('bioinfo_sid'));	
};


Pathiways.prototype.showPathi = function () {
    var _this = this;
    var showForm = function () {
        var pathiwaysForm = new PathiwaysForm(_this);
        if (Ext.getCmp(pathiwaysForm.panelId) == null) {
            var panel = pathiwaysForm.draw({title: "PATHiWAYS"});
            Ext.getCmp(_this.centerPanelId).add(panel);
            //		pathiwaysForm.onRun.addEventListener(function(sender,data){
            //			Ext.getCmp(_this.eastPanelId).expand();
            //		});
        }
        Ext.getCmp(_this.centerPanelId).setActiveTab(Ext.getCmp(pathiwaysForm.panelId));
    };

    if (!$.cookie('bioinfo_sid')) {
        _this.headerWidget.onLogin.addEventListener(function (sender, data) {
            showForm();
        });
        _this.headerWidget.loginWidget.anonymousSign();
    } else {
        showForm();
    }

};


Pathiways.prototype.showGRNViewer = function () {
    var _this = this;
    this.viewer = Ext.getCmp(this.id + "_grnViewer");
    if (this.viewer == null) {
        //Collapse to calculate width for CellBrowser
        pan = 26;
        if (!Ext.getCmp(this.eastPanelId).isHidden() || Ext.getCmp(this.eastPanelId).collapsed) {
            Ext.getCmp(this.eastPanelId).collapse();
            pan = 0;
        }
        var cellBrowserContainer = Ext.create('Ext.container.Container', {
            id: this.id + 'contGRNViewer'
//			html:'<div id=grnViewerCellBrowser></div>'
        });

        this.viewer = Ext.create('Ext.panel.Panel', {
            id: this.id + "_grnViewer",
            border: false,
            title: "Workspace",
//		    closable:true,
            items: cellBrowserContainer
//		    autoScroll:true
        });

        Ext.getCmp(this.centerPanelId).add(this.viewer);

        //Once actived, the div element is visible, and CellBrowser can be rendered
        Ext.getCmp(this.centerPanelId).setActiveTab(this.viewer);
        this.networkViewer = new NetworkViewer(this.id + 'contGRNViewer', {
            width: this.viewer.getWidth() - (0/*15+pan*/),
            height: this.viewer.getHeight() - 0/*26*/,
            //menuBar:this.getMenuBar(),
            overview: true,
            version: '<span class="info">Cell Browser v' + this.version + '</span>'
        });
//		this.networkViewer.setSpeciesMenu(AVAILABLE_SPECIES);
        this.networkViewer.draw();

        this.nodeAttributeEditWidget = new AttributeEditWidget(this.networkViewer.getNetworkData().getNodeAttributes(), "Node");
        this.nodeAttributeFilterWidget = new AttributeFilterWidget(this.networkViewer.getNetworkData().getNodeAttributes(), "Node");

        this.edgeAttributeEditWidget = new AttributeEditWidget(this.networkViewer.getNetworkData().getEdgeAttributes(), "Edge");
        this.edgeAttributeFilterWidget = new AttributeFilterWidget(this.networkViewer.getNetworkData().getEdgeAttributes(), "Edge");

        this.networkViewer.onSelectionChange.addEventListener(function (sender, data) {
            if (Ext.getCmp("editNodeAttrWindow")) {
                _this.nodeAttributeEditWidget.selectRowsById(data);
            }
            if (Ext.getCmp("filterNodeAttrWindow")) {
                _this.nodeAttributeFilterWidget.selectRowsById(data);
            }
        });

        this.nodeAttributeEditWidget.onSelectNodes.addEventListener(function (sender, data) {
            _this.networkViewer.selectNodes(data);
        });

        this.nodeAttributeFilterWidget.onSelectNodes.addEventListener(function (sender, data) {
            _this.networkViewer.selectNodes(data);
        });

        this.nodeAttributeFilterWidget.onDeselectNodes.addEventListener(function () {
            _this.networkViewer.deselectAllNodes();
        });

        this.nodeAttributeFilterWidget.onFilterNodes.addEventListener(function (sender, data) {
            _this.networkViewer.filterNodes(data);
        });

        this.nodeAttributeFilterWidget.onRestoreNodes.addEventListener(function () {
            _this.networkViewer.refresh();
        });
    }
    else {
        Ext.getCmp(this.centerPanelId).setActiveTab(this.viewer);
    }
};


Pathiways.prototype.getPanel = function () {
    var _this = this;


};

Pathiways.prototype.getEastPanel = function () {
    //var eastPanel = Ext.create('Ext.tab.Panel', {
    var eastPanel = Ext.create('Ext.panel.Panel', {
        id: this.eastPanelId,
        region: 'east',
        style: 'border: 0',
        //title: 'Jobs & Data list',
        title: 'Jobs',
        collapsible: true,
        titleCollapse: true,
        animCollapse: false,
        width: 280,
        collapseDirection: 'top',
        activeTab: 0
    });
    return eastPanel;
};

function Pathiways(args) {
    _.extend(this, Backbone.Events);

    var _this = this;
    this.id = Utils.genId("Pathiways");

    //set default args
    this.suiteId = 22;
    this.title = 'PATH<span class="emph">i</span>WAYS';
    this.description = '';
    this.version = '1.0.14';
    this.tools = ['pathiways', 'pathiways.pathiways', 'pathiways.pathipred', 'pathiways.pathipred-prediction'];
    this.border = true;
    this.targetId;
    this.width;
    this.height;


    //set instantiation args, must be last
    _.extend(this, args);

    this.accountData = null;

    this.resizing = false;

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
        this.div = $('<div id="pathiways" style="height:100%;position:relative;"></div>')[0];
        $(this.targetDiv).append(this.div);

        this.headerWidgetDiv = $('<div id="header-widget"></div>')[0];
        $(this.div).append(this.headerWidgetDiv);
        this.menuDiv = $('<div id="menu"></div>')[0];
        $(this.div).append(this.menuDiv);
        this.wrapDiv = $('<div id="wrap" style="height:100%;position:relative;"></div>')[0];
        $(this.div).append(this.wrapDiv);


        this.sidePanelDiv = $('<div id="right-side-panel" style="position:absolute; z-index:50;right:0px;"></div>')[0];
        $(this.wrapDiv).append(this.sidePanelDiv);

        this.contentDiv = $('<div id="content" style="height: 100%;"></div>')[0];
        $(this.wrapDiv).append(this.contentDiv);

        this.width = ($(this.div).width());
        this.height = ($(this.div).height());

        if (this.border) {
            var border = (_.isString(this.border)) ? this.border : '1px solid lightgray';
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

        /* Header Widget */
        this.headerWidget = this._createHeaderWidget($(this.headerWidgetDiv).attr('id'));

        /* Header Widget */
        this.menu = this._createMenu($(this.menuDiv).attr('id'));

        /* check height */
        var topOffset = $(this.headerWidgetDiv).height() + $(this.menuDiv).height();
        $(this.wrapDiv).css({height: 'calc(100% - ' + topOffset + 'px)'});

        /* Wrap Panel */
        this.panel = this._createPanel($(this.contentDiv).attr('id'));

        /* Job List Widget */
        this.jobListWidget = this._createJobListWidget($(this.sidePanelDiv).attr('id'));


        this.pathiwaysForm = new PathiwaysForm({
            webapp: this,
            title: "PATHiWAYS",
            testing: false,
            closable: true,
            minimizable: false,
            width: '50%',
            bodyPadding:'15 0 0 40'
        });
        this.pathiwaysForm.draw();
//        this.pathiwaysForm = new PathiwaysForm(this);
//        this.pathiwaysForm.draw({title: "PATHiWAYS", tabpanel: this.panel});


        this.pathipredForm = new PathipredForm({
            webapp: this,
            title: "PATHiPRED",
            testing: false,
            closable: true,
            minimizable: false,
            width: '50%',
            bodyPadding:'15 0 0 40'
        });
        this.pathipredForm.draw();
//        this.pathipredForm = new PathipredForm(this);
//        this.pathipredForm.draw({title: "PATHiPRED", tabpanel: this.panel});


        this.pathipredPredictionForm = new PathipredPredictionForm({
            webapp: this,
            title: "PATHiPRED-Prediction",
            testing: false,
            closable: true,
            minimizable: false,
            width: '50%',
            bodyPadding:'15 0 0 40'
        });
        this.pathipredPredictionForm.draw();
//        this.pathipredPredictionForm = new PathipredPredictionForm(this);
//        this.pathipredPredictionForm.draw({title: "PATHiPRED-Prediction", tabpanel: this.panel});


        /*check login*/
        if ($.cookie('bioinfo_sid') != null) {
            this.sessionInitiated();
        } else {
            this.sessionFinished();
        }

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
            accountData: this.accountData,
            handlers: {
                'login': function (event) {
                    Ext.example.msg('Welcome', 'You logged in');
                    _this.sessionInitiated();
                },
                'logout': function (event) {
                    Ext.example.msg('Good bye', 'You logged out');
                    _this.sessionFinished();

                },
                'account:change': function (event) {
                    _this.setAccountData(event.response);

                }
            }
        });
        headerWidget.draw();

        return headerWidget;
    },
    _createMenu: function (targetId) {
        var _this = this;
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
                        _this.showPathiwaysForm();
                    }
                },
                {
                    id: this.id + "btnPred",
//                    disabled: true,
                    text: '<span class="link emph">Press to run PATHiPRED<span>',
                    handler: function () {
                        _this.showPathipredForm();
                    }
                },
                '->'
                ,
                {
                    id: this.id + 'jobsButton',
                    tooltip: 'Show Jobs',
                    text: '<span class="emph"> Hide jobs </span>',
                    enableToggle: true,
                    pressed: true,
                    toggleHandler: function () {
                        if (this.pressed) {
                            this.setText('<span class="emph"> Hide jobs </span>');
                            _this.jobListWidget.show();
                        } else {
                            this.setText('<span class="emph"> Show jobs </span>');
                            _this.jobListWidget.hide();
                        }
                    }
                }
            ]
        });
        return toolbar;
    },
    _createPanel: function (targetId) {
        var _this = this;

        homePanel = Ext.create('Ext.panel.Panel', {
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
                        _this.showPathiwaysForm();
                    }
                },
                {
                    xtype: 'button',
                    padding: 20,
                    margin: '0 0 0 150',
                    text: 'Run PATHiPRED',
                    handler: function () {
                        _this.showPathipredForm();
                    }
                }
            ]
        });
        var panel = Ext.create('Ext.tab.Panel', {
            renderTo: targetId,
            width: '100%',
            height: '100%',
            border: 0,
            cls: 'ocb-border-top-lightgrey',
            activeTab: 0,
            items: [homePanel]
        });
        return panel;
    },
    _createJobListWidget: function (targetId) {
        var _this = this;

        var jobListWidget = new JobListWidget({
            'timeout': 4000,
            'suiteId': this.suiteId,
            'tools': this.tools,
            'pagedViewList': {
                'title': 'Jobs',
                'pageSize': 7,
                'targetId': targetId,
                'order': 0,
                'width': 280,
                'height': 625,
                border: true,
                'mode': 'view'
            }
        });

        /**Atach events i listen**/
        jobListWidget.pagedListViewWidget.on('item:click', function (data) {
            _this.jobItemClick(data.item);
        });
        jobListWidget.draw();

        return jobListWidget;
    }
}

Pathiways.prototype.sessionInitiated = function () {
    Ext.getCmp(this.id + 'jobsButton').enable();
    Ext.getCmp(this.id + 'jobsButton').toggle(true);
    //this.jobListWidget.draw();
    //this.dataListWidget.draw();
};

Pathiways.prototype.sessionFinished = function () {
    var _this = this;
    Ext.getCmp(this.id + 'jobsButton').disable();
    Ext.getCmp(this.id + 'jobsButton').toggle(false);

    this.jobListWidget.clean();
    this.accountData = null;

    this.panel.items.each(function (child) {
        if (child.title != 'Home') {
            if (child.title === 'PATHiPRED') {
                _this.pathipredForm.clean();
                _this.pathiwaysForm.clean();
            }
            child.close();
        }
    })
};

Pathiways.prototype.setAccountData = function (response) {
    this.accountData = response;
    this.jobListWidget.setAccountData(this.accountData);
};

Pathiways.prototype.setSize = function (width, height) {
    this.width = width;
    this.height = height;

    this.headerWidget.setWidth(width);
    this.menu.setWidth($(this.menuDiv).width());
    this.panel.setWidth($(this.contentDiv).width());
};

Pathiways.prototype.jobItemClick = function (record) {
    var _this = this;
    this.jobId = record.data.id;
    if (record.data.visites >= 0) {


        Ext.getCmp(this.id + 'jobsButton').toggle(false);

        var extItems = [];

        var layoutName = record.raw.toolName.split('.')[0];

        if (record.raw.toolName == 'pathiways.pathipred') {
            var buttonPrediction = Ext.create('Ext.button.Button');
            var button = Ext.create('Ext.button.Button');
            extItems.push(button);
            extItems.push(buttonPrediction);
            layoutName = record.raw.toolName.split('.')[1];
        }

        if (record.raw.toolName == 'pathiways.pathiways') {
            var button = Ext.create('Ext.button.Button');
            extItems.push(button);
        }
        if (record.raw.toolName == 'pathiways.pathipred-prediction') {
            layoutName = record.raw.toolName.split('.')[1];
        }

        var resultWidget = new ResultWidget({
            targetId: this.panel.getId(),
            application: 'pathiway',
            app: this,
            extItems: extItems,
            layoutName: layoutName
        });
        resultWidget.draw($.cookie('bioinfo_sid'), record);

        if (record.raw.toolName == 'pathiways.pathipred') {
            button.setText('<span style="color:blue;">Run PATHiWAYS</span>');
            button.on('click', function () {
                _this.showPathiwaysForm();
                _this.pathiwaysForm.loadForm(resultWidget.job);
            });
            buttonPrediction.setText('<span style="color:blue;">Apply to a new dataset</span>');
            buttonPrediction.on('click', function () {
                _this.showPathipredPredictionForm();
                _this.pathipredPredictionForm.loadForm(resultWidget.job);
            });
        } else if (record.raw.toolName == 'pathiways.pathiways') {
            button.setText('<span style="color:blue;">Run PATHiPRED</span>');
            button.on('click', function () {
                _this.showPathipredForm();
                _this.pathipredForm.loadForm(resultWidget.job);
            });
        }


        console.log(this.jobId)
        console.log(record.raw);

        /* result widget parses the commandLine on record and adds the command key */

//                    var config = {
//                        'norm-matrix': "example_GSE4107.txt",
//                        'exp-design': "example_ED_GSE4107.txt",
//                        species: "hsapiens",
//                        platform: "HGU133Plus2",
//                        'cel-compressed-file': false,
//                        test: "wilcoxon",
//                        paired: "FALSE",
//                        control: "CONTROL",
//                        disease: "CRC",
//                        jobname: "Example 1",
//                        'exp-name': "Example 1",
//                        jobdescription: "fsdafdsafdsa",
//                        summ: "max",
//                        pathways: "hsa03320",
//                        sessionid: "sBrIYTwce6Ui3YHNZHig",
//                        accountid: "fsalavert"
//                    };

    }
};


Pathiways.prototype.showPathiwaysForm = function () {
    var _this = this;
    var showForm = function () {
        if (!_this.panel.contains(_this.pathiwaysForm.panel)) {
            _this.pathiwaysForm.clean();
            _this.panel.add(_this.pathiwaysForm.panel);
        }
        _this.panel.setActiveTab(_this.pathiwaysForm.panel);
    };
    this._checkLogin(showForm);
};


Pathiways.prototype.showPathipredForm = function (config) {
    var _this = this;
    var showForm = function () {
        if (!_this.panel.contains(_this.pathipredForm.panel)) {
            _this.pathipredForm.clean();
            _this.panel.add(_this.pathipredForm.panel);
        }
        _this.panel.setActiveTab(_this.pathipredForm.panel);
    };
    this._checkLogin(showForm);
};

Pathiways.prototype.showPathipredPredictionForm = function (config) {
    if (!this.panel.contains(this.pathipredPredictionForm.panel)) {
        this.panel.add(this.pathipredPredictionForm.panel);
    }
    this.panel.setActiveTab(this.pathipredPredictionForm.panel);
};

Pathiways.prototype._checkLogin = function (showForm) {
    if (!$.cookie('bioinfo_sid')) {
        this.headerWidget.on('login', function (event) {
            showForm();
        });
        this.headerWidget.loginWidget.anonymousSign();
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


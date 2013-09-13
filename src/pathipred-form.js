/*
 * Copyright (c) 2012 Ruben Sanchez (ICM-CIPF)
 * Copyright (c) 2012 Francisco Salavert (ICM-CIPF)
 * Copyright (c) 2012 Ignacio Medina (ICM-CIPF)
 *
 * This file is part of Cell Browser.
 *
 * Cell Browser is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Cell Browser is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Cell Browser. If not, see <http://www.gnu.org/licenses/>.
 */

PathipredForm.prototype = new GenericFormPanel("pathiways.pathipred");

function PathipredForm(webapp) {
    this.id = Utils.genId("PathipredForm");
    this.headerWidget = webapp.headerWidget;
    this.opencgaBrowserWidget = webapp.headerWidget.opencgaBrowserWidget;
    this.onSelectNodes = new Event(this);
}

PathipredForm.prototype.beforeRun = function () {
    var pathways = [];
    var speciesPrefix = this.paramsWS["species"].substring(0, 3);
    Ext.getCmp('pathways' + this.id).items.each(function (item) {
        if (item.getSubmitValue() != null) {
            var value = speciesPrefix + item.getSubmitValue();
            pathways.push(value);
        }

    });

    if (pathways.length > 0) this.paramsWS["pathways"] = pathways.toString();
    else this.paramsWS["pathways"] = "";
    this.paramsWS["exp-name"] = this.paramsWS["jobname"];

//    this.testing = true;
};

PathipredForm.prototype.getPanels = function () {
    return [
        this._getExamplesPanel(),
        this._getSpeciesPanel(),
        this._getSelectDataPanel(),
        this._getExpDesignPanel(),
        this._getOtherParamsPanel(),
        this._getPathwaysPanel()
    ];
};

PathipredForm.prototype._getExamplesPanel = function () {
    var _this = this;

    var example1 = Ext.create('Ext.Component', {
        html: '<span class="u"><span class="emph u">Load example 1.</span> <span class="info s110">Breast cancer</span></span>',
        cls: 'dedo',
        listeners: {
            afterrender: function () {
                this.getEl().on("click", function () {
                    _this.loadExample1();
                    Ext.example.msg("Example loaded", "");
                });
            }
        }
    });
    var example2 = Ext.create('Ext.Component', {
        html: '<span class="u"><span class="emph u">Load example 2.</span> <span class="info s110">VCF file with ~5000 variants</span></span>',
        cls: 'dedo',
        listeners: {
            afterrender: function () {
                this.getEl().on("click", function () {
                    _this.loadExample2();
                    Ext.example.msg("Example loaded", "");
                });
            }
        }
    });

    var exampleForm = Ext.create('Ext.container.Container', {
        bodyPadding: 10,
        margin: '0 0 10 0',
        defaults: {margin: '0 0 5 0'},
        items: [example1]
    });

    return exampleForm;
};

PathipredForm.prototype._getSpeciesPanel = function () {
    var _this = this;

//	var speciesValues = Ext.create('Ext.data.Store', {
//		fields: ['value', 'name'],
//		data : [
//		        {"value":"hsapiens", "name":"Human (Homo sapiens)"},
//		        {"value":"mmusculus", "name":"Mouse (Mus musculus)"}
//		       ]
//	});
//	
//	var hsapiensValues = Ext.create('Ext.data.Store', {
//		fields: ['value', 'name'],
//		data : [
//		        {"value":"HGU133Plus2", "name":"Affymetrix Human Genome U133 Plus 2.0 Array"},
//		        {"value":"HGU133A", "name":"Affymetrix Human Genome U133A Array"}
//		       ]
//	});
//	
//	var mouseValues = Ext.create('Ext.data.Store', {
//		fields: ['value', 'name'],
//		data : [
//		        {"value":"MoGene", "name":"Affymetrix Mouse Gene 1.0 ST Array"}
//		       ]
//	});
//	
//	var combo1 = this.createCombobox("species", "Species", speciesValues, 0);
//	var combo2 = this.createCombobox("species2", "Platform", hsapiensValues, 0, null, '0 0 0 20');
//	function changeCombo() {
//		switch (combo1.getValue()) {
//		case "hsapiens":
//			combo2.clearValue();
//			combo2.bindStore(hsapiensValues);
//			combo2.setValue("HG-U133");
//			break;
//		case "mmusculus":
//			combo2.clearValue();
//			combo2.bindStore(mouseValues);
//			combo2.setValue("MoGene");
//			break;
//		}
//	};
//	combo1.on({select: changeCombo, scope: this});

    var species = Ext.create('Ext.form.RadioGroup', {
        id: this.id + 'speciesRadioGroup',
        layout: 'vbox',
        fieldLabel: 'Species',
        margin: "0 0 10 0",
        defaults: {
            name: 'species'
        },
        items: [
            {
                inputValue: 'hsapiens',
                boxLabel: 'Human (Homo sapiens)',
                checked: true,
                listeners: {change: function (cmp, value) {
                    if (value) {
                        platform.removeAll();
                        platform.add(humanItems);

                        Ext.getCmp(_this.id + 'allPathways').setValue(false);

                        Ext.getCmp('pathways04620' + _this.id).enable();

                        Ext.getCmp('pathways04340' + _this.id).enable();
                        Ext.getCmp('pathways04150' + _this.id).enable();
                        Ext.getCmp('pathways04060' + _this.id).enable();
                        Ext.getCmp('pathways04512' + _this.id).enable();
                        Ext.getCmp('pathways04115' + _this.id).enable();
                        Ext.getCmp('pathways04530' + _this.id).enable();
                        Ext.getCmp('pathways04660' + _this.id).enable();
//                        Ext.getCmp('pathways04062' + _this.id).disable();
                    }
                }}
            },
            {
                inputValue: 'mmusculus',
                boxLabel: 'Mouse (Mus musculus)',
                listeners: {change: function (cmp, value) {
                    if (value) {
                        platform.removeAll();
                        platform.add(mouseItems);

                        Ext.getCmp(_this.id + 'allPathways').setValue(false);

                        Ext.getCmp('pathways04620' + _this.id).setValue(false).disable();

                        Ext.getCmp('pathways04340' + _this.id).setValue(false).disable();
                        Ext.getCmp('pathways04150' + _this.id).setValue(false).disable();
                        Ext.getCmp('pathways04060' + _this.id).setValue(false).disable();
                        Ext.getCmp('pathways04512' + _this.id).setValue(false).disable();
                        Ext.getCmp('pathways04115' + _this.id).setValue(false).disable();
                        Ext.getCmp('pathways04530' + _this.id).setValue(false).disable();
                        Ext.getCmp('pathways04660' + _this.id).setValue(false).disable();
//                    Ext.getCmp('pathways04062' + _this.id).setValue(false).disable();
                    }
                }}
            }
        ]
    });

    var humanItems = [
        {
            inputValue: 'HGU133Plus2',
            boxLabel: 'Affymetrix Human Genome U133 Plus 2.0 Array',
            checked: true
        },
        {
            inputValue: 'HGU133A',
            boxLabel: 'Affymetrix Human Genome U133A Array',
            checked: false
        },
        {
            inputValue: 'HGU133A_2',
            boxLabel: 'Affymetrix Human Genome U133A 2.0 Array',
            checked: false
        }
    ];

    var mouseItems = [
        {
            inputValue: 'MoGene',
            boxLabel: 'Affymetrix Mouse Gene 1.0 ST Array',
            checked: true
        },
        {
            inputValue: 'Mouse430_2',
            boxLabel: 'Affymetrix Mouse Genome 430 2.0 Array',
            checked: false
        }
    ];

    var platform = Ext.create('Ext.form.RadioGroup', {
        layout: 'vbox',
        fieldLabel: 'Platform',
        margin: "0 0 0 0",
        defaults: {
            name: 'platform'
        },
        items: humanItems
    });

    return Ext.create('Ext.panel.Panel', {
        title: 'Species',
        border: true,
        bodyPadding: "10",
        margin: "0 0 5 0",
        width: "99%",
        buttonAlign: 'center',
//		layout: 'hbox',
        items: [
            species,
            platform
        ]
    });
};

PathipredForm.prototype._getSelectDataPanel = function () {
    var _this = this;


    var createBrowser = this.createOpencgaBrowserCmp({
        fieldLabel: 'Input file:',
        dataParamName: 'norm-matrix',
        id: this.id + 'norm-matrix',
        mode: 'fileSelection',
        beforeClick: function () {
            if (Ext.getCmp(_this.id + 'normRadio').getValue()) {
                _this.opencgaBrowserWidget.allowedTypes = ['txt'];
            } else {
                _this.opencgaBrowserWidget.allowedTypes = ['cel'];
            }
        },
        allowedTypes: ['txt'],
        allowBlank: false
    });

    var items = [
        {
            id: this.id + 'compressedRadio',
            inputValue: true,
            boxLabel: 'CEL compressed file',
            checked: false
        },
        {
            id: this.id + 'normRadio',
            inputValue: false,
            boxLabel: 'Normalized matrix',
            checked: true
        }
    ];
    var matrixOrCel = Ext.create('Ext.form.RadioGroup', {
        layout: 'vbox',
        fieldLabel: 'Platform',
        margin: "0 0 0 0",
        defaults: {
            name: 'cel-compressed-file'
        },
        items: items
    });


    var panel = Ext.create('Ext.panel.Panel', {
        title: 'Select your data',
        border: true,
        bodyPadding: "5",
        margin: "0 0 5 0",
        width: "99%",
        buttonAlign: 'center',
        layout: 'vbox',
        items: [matrixOrCel, createBrowser]
    });

    return panel;
};

PathipredForm.prototype._getExpDesignPanel = function () {
//	var btnBrowse = Ext.create('Ext.button.Button', {
//		text: 'Browse data',
//		margin: '0 0 0 10',
//		handler: function (){
//		}
//	});
//	
//	var expDesign = Ext.create('Ext.container.Container', {
////		bodyPadding:10,
////		defaults:{margin:'5 0 0 5'},
////		margin: '10 0 5 0',
//		items: [
//		        {xtype: 'label', text: 'Experimental design data:', margin:'5 0 0 5'},
//		        btnBrowse
//		       ]
//	});

    var control = Ext.create('Ext.form.field.Text', {
        id: this.id + "control",
        name: "control",
        fieldLabel: 'Condition 1',
        margin: '10 0 0 5',
        allowBlank: false
    });

    var disease = Ext.create('Ext.form.field.Text', {
        id: this.id + "disease",
        name: "disease",
        fieldLabel: 'Condition 2',
        margin: '10 0 0 5',
        allowBlank: false
    });

    return Ext.create('Ext.panel.Panel', {
        title: 'Experimental design',
        border: true,
        bodyPadding: "5",
        margin: "0 0 5 0",
        width: "99%",
        buttonAlign: 'center',
        layout: 'vbox',
        items: [
            this.createOpencgaBrowserCmp({
                fieldLabel: 'Experimental design data:',
                dataParamName: 'exp-design',
                id: this.id + 'exp-design',
                mode: 'fileSelection',
                allowedTypes: ['txt'],
                allowBlank: false
            }),
            control,
            disease
        ]
    });
};

PathipredForm.prototype._getOtherParamsPanel = function () {
    var summValues = Ext.create('Ext.data.Store', {
        fields: ['value', 'name'],
        data: [
            {"value": "mean", "name": "mean"},
            {"value": "median", "name": "median"},
            {"value": "max", "name": "max"},
            {"value": "min", "name": "minimum"},
            {"value": "per90", "name": "90th percentile"},
            {"value": "per95", "name": "95th percentile"},
            {"value": "per99", "name": "99th percentile"}
        ]
    });

    var summ = Ext.create('Ext.form.field.ComboBox', {
        id: this.id + "summ",
        name: "summ",
        fieldLabel: "Summ",
        store: summValues,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        value: summValues.getAt(4).get('value'),
        labelWidth: 100,
        margin: '5 0 5 5',
        editable: false,
        allowBlank: false
    });


    var kfold = Ext.create('Ext.form.field.Number', {
        id: this.id + "kfold",
        name: "k",
        fieldLabel: 'K-fold',
        margin: '10 0 0 5',
        value: 10,
        minValue: 1,
        allowBlank: false
    });

    return Ext.create('Ext.panel.Panel', {
        title: 'Other parameters',
        border: true,
        bodyPadding: "5",
        margin: "0 0 5 0",
        width: "99%",
        buttonAlign: 'center',
        layout: 'vbox',
        items: [summ,kfold]
    });
};


PathipredForm.prototype._getPathwaysPanel = function () {
    var checkAll = function (allValue) {
        pathways.items.each(function (item) {
            if (!item.isDisabled()) {
                item.setValue(allValue.value);
            }
        });
    };

    var pathways = Ext.create('Ext.form.CheckboxGroup', {
        // Arrange checkboxes into two columns, distributed vertically
        id: 'pathways' + this.id,
        columns: 2,
        vertical: true,
        defaults: {margin: '0 15 0 0'},
        items: [
            { boxLabel: 'PPAR SIGNALING PATHWAY', name: 'pathways', inputValue: '03320' },
            { boxLabel: 'ERBB SIGNALING PATHWAY', name: 'pathways', inputValue: '04012' },
            { boxLabel: 'CALCIUM SIGNALING PATHWAY', name: 'pathways', inputValue: '04020' },
            { boxLabel: 'CYTOKINE-CYTOKINE RECEPTOR', name: 'pathways', inputValue: '04060', id: 'pathways04060' + this.id},
//            { boxLabel: 'CHEMOKINE SIGNALING PATHWAY', name: 'pathways', inputValue: '04062', id: 'pathways04062' + this.id},
            { boxLabel: 'NEUROACTIVE LIGAND-RECEPTOR INTERACTION', name: 'pathways', inputValue: '04080' },
            { boxLabel: 'p53 SIGNALING PATHWAY', name: 'pathways', inputValue: '04115', id: 'pathways04115' + this.id},
            { boxLabel: 'mTOR SIGNALING PATHWAY', name: 'pathways', inputValue: '04150', id: 'pathways04150' + this.id},
            { boxLabel: 'APOPTOSIS', name: 'pathways', inputValue: '04210' },
            { boxLabel: 'WNT SIGNALING PATHWAY', name: 'pathways', inputValue: '04310' },
            { boxLabel: 'NOTCH SIGNALING PATHWAY', name: 'pathways', inputValue: '04330' },
            { boxLabel: 'HEDGEHOG SIGNALING PATHWAY', name: 'pathways', inputValue: '04340', id: 'pathways04340' + this.id},
            { boxLabel: 'VEGF SIGNALING PATHWAY', name: 'pathways', inputValue: '04370' },
            { boxLabel: 'ECM-RECEPTOR INTERACTION', name: 'pathways', inputValue: '04512', id: 'pathways04512' + this.id},
            { boxLabel: 'CELL ADHESION MOLECULES', name: 'pathways', inputValue: '04514' },
            { boxLabel: 'TIGH JUNCTION', name: 'pathways', inputValue: '04530', id: 'pathways04530' + this.id},
            { boxLabel: 'GAP JUNCTION', name: 'pathways', inputValue: '04540' },
            { boxLabel: 'ANTIGEN PROCESING AND PRESENTATION', name: 'pathways', inputValue: '04612' },
            { boxLabel: 'TOLL-LIKE RECEPTOR SIGNALING PATHWAY', name: 'pathways', inputValue: '04620', id: 'pathways04620' + this.id},
            { boxLabel: 'JAK-STAT SIGNALING PATHWAY', name: 'pathways', inputValue: '04630' },
            { boxLabel: 'T CELL RECPTOR SIGNALING PATHWAY', name: 'pathways', inputValue: '04660', id: 'pathways04660' + this.id},
            { boxLabel: 'B CELL RECEPTOR SIGNALING PATHWAY', name: 'pathways', inputValue: '04662' },
            { boxLabel: 'Fc EPSILON RI SIGNALING PATHWAY', name: 'pathways', inputValue: '04664' },
            { boxLabel: 'INSULIN SIGNALING PATHWAY', name: 'pathways', inputValue: '04910' },
            { boxLabel: 'GnRH SIGNALING PATHWAY', name: 'pathways', inputValue: '04912' },
            { boxLabel: 'MELANOGENESIS', name: 'pathways', inputValue: '04916' },
            { boxLabel: 'ADIPOCYTOKINE SIGNALING PATHWAY', name: 'pathways', inputValue: '04920' }
        ]
    });

    return Ext.create('Ext.panel.Panel', {
        title: 'Pathways',
        border: true,
        bodyPadding: "5",
        margin: "0 0 5 0",
        width: "99%",
        buttonAlign: 'center',
        items: [
            {xtype: 'checkboxfield', id: this.id + 'allPathways', name: 'allPathways', boxLabel: 'All', handler: checkAll, margin: '0 0 2 4', inputValue: "Funciona"},
            pathways
        ]
    });
};

PathipredForm.prototype.loadExample1 = function () {
    Ext.getCmp(this.id + 'norm-matrix').setText('<span class="emph">Example breast cancer</span>', false);
    Ext.getCmp(this.id + 'norm-matrix' + 'hidden').setValue('example_GSE27562.txt');

    Ext.getCmp(this.id + 'exp-design').setText('<span class="emph">Example breast cancer</span>', false);
    Ext.getCmp(this.id + 'exp-design' + 'hidden').setValue('example_ED_GSE27562.txt');

    Ext.getCmp(this.id + 'speciesRadioGroup').setValue({species: 'hsapiens'});
    Ext.getCmp(this.id + 'normRadio').setValue(true);

    Ext.getCmp(this.id + 'control').setValue("normal");
    Ext.getCmp(this.id + 'disease').setValue("malignant");
    Ext.getCmp(this.id + 'allPathways').setValue(true);

    Ext.getCmp(this.id + 'jobname').setValue("Example 1");
    Ext.getCmp(this.id + 'jobdescription').setValue("Breast cancer");
};

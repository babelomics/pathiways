/*
 * Copyright (c) 2012 Ruben Sanchez (ICM-CIPF)
 * Copyright (c) 2012 Francisco Salavert (ICM-CIPF)
 * Copyright (c) 2012 Ignacio Medina (ICM-CIPF)
 *
 * This file is part of Cell Browser.
 *
 * Cell Browser is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
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

PathiwaysForm.prototype = new GenericFormPanel("pathiways");

function PathiwaysForm(webapp) {
	this.id = Math.round(Math.random() * 10000000);
	
	this.gcsaBrowserWidget = webapp.headerWidget.gcsaBrowserWidget;
	this.onSelectNodes = new Event(this);
};

PathiwaysForm.prototype.beforeRun = function() {
	var pathways = [];
	Ext.getCmp('pathways'+this.id).items.each(function(item) {
		var value = item.getSubmitValue();
		if(value != null) pathways.push(value);
	});
	
	if(pathways.length > 0) this.paramsWS["pathways"] = pathways.toString();
	else this.paramsWS["pathways"] = "";
	
	this.paramsWS["exp-name"] = this.paramsWS["jobname"];
};

PathiwaysForm.prototype.getPanels = function() {
	return [
	         this._getExamplesPanel(),
	         this._getSpeciesPanel(),
	         this._getSelectDataPanel(),
	         this._getExpDesignPanel(),
	         this._getOtherParamsPanel(),
	         this._getPathwaysPanel()
	        ];
};

PathiwaysForm.prototype._getExamplesPanel = function() {
	var _this = this;
	
	var example1 = Ext.create('Ext.Component', {
		html:'<span class="u"><span class="emph u">Load example 1.</span> <span class="info s110">HG-U133 Plus 2.0</span></span>',
		cls:'dedo',
		listeners:{
			afterrender:function(){
				this.getEl().on("click",function(){_this.loadExample1();Ext.example.msg("Example loaded","");});
			}
		}
	});
	var example2 = Ext.create('Ext.Component', {
		html:'<span class="u"><span class="emph u">Load example 2.</span> <span class="info s110">VCF file with ~5000 variants</span></span>',
		cls:'dedo',
		listeners:{
			afterrender:function(){
				this.getEl().on("click",function(){_this.loadExample2();Ext.example.msg("Example loaded","");});
			}
		}
	});
	
	var exampleForm = Ext.create('Ext.container.Container', {
		bodyPadding:10,
		margin: '0 0 10 0',
		defaults:{margin:'0 0 5 0'},
		items: [example1]
	});
	
	return exampleForm;
};

PathiwaysForm.prototype._getSpeciesPanel = function() {
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
		layout: 'vbox',
		fieldLabel: 'Species',
		margin: "0 0 10 0",
		defaults: {
			name: 'species'
		},
		items: [{
			inputValue: 'hsapiens',
			boxLabel: 'Human (Homo sapiens)',
			checked: true,
			listeners: {click: { element: 'el', fn: function(){
				platform.removeAll();
				platform.add(humanItems);
			}}}
		}, {
			inputValue: 'mmusculus',
			boxLabel: 'Mouse (Mus musculus)',
			listeners: {click: { element: 'el', fn: function(){
				platform.removeAll();
				platform.add(mouseItems);
			}}}
		}]
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
	                  }
	                 ];
	
	var mouseItems = [
	                  {
	                	  inputValue: 'MoGene',
	                	  boxLabel: 'Affymetrix Mouse Gene 1.0 ST Array',
	                	  checked: true
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
		buttonAlign:'center',
//		layout: 'hbox',
		items:[
		       species,
		       platform
		      ]
	});
};

PathiwaysForm.prototype._getSelectDataPanel = function() {
	return Ext.create('Ext.panel.Panel', {
		title: 'Select your data',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "99%",
		buttonAlign:'center',
		layout: 'vbox',
		items:[this.createGcsaBrowserCmp('Normalized matrix:', 'norm-matrix')]
	});
};

PathiwaysForm.prototype._getExpDesignPanel = function() {
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
		name: "control",
		fieldLabel:'Control',
		margin: '10 0 0 5',
		allowBlank: false
	});
	
	var disease = Ext.create('Ext.form.field.Text', {
		name: "disease",
		fieldLabel:'Disease',
		margin: '10 0 0 5',
		allowBlank: false
	});
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Experimental design',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "99%",
		buttonAlign:'center',
		layout: 'vbox',
		items:[
		       this.createGcsaBrowserCmp('Experimental design data:', 'exp-design'),
		       control,
		       disease
		      ]
	});
};

PathiwaysForm.prototype._getOtherParamsPanel = function() {
	var summValues = Ext.create('Ext.data.Store', {
		fields: ['value', 'name'],
		data : [
		        {"value":"mean", "name":"mean"},
		        {"value":"median", "name":"median"},
		        {"value":"max", "name":"max"},
		        {"value":"min", "name":"minimum"},
		        {"value":"per90", "name":"90th percentile"},
		        {"value":"per95", "name":"95th percentile"},
		        {"value":"per99", "name":"99th percentile"}
		       ]
	});
	var summ = this.createCombobox("summ", "Summ", summValues, 4, 100, '5 0 5 5');
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Other parameters',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "99%",
		buttonAlign:'center',
		layout: 'vbox',
		items: [summ]
	});
};

PathiwaysForm.prototype._getPathwaysPanel = function() {
	function checkAll(allValue) {
		pathways.items.each(function(item) {
		    item.setValue(allValue.value);
		});
	};
	
	var pathways = Ext.create('Ext.form.CheckboxGroup', {
//		fieldLabel: 'Pathways',
		// Arrange checkboxes into two columns, distributed vertically
		id: 'pathways'+this.id,
		columns: 2,
		vertical: true,
		defaults: {margin: '0 15 0 0'},
		items: [
		        { boxLabel: 'PPAR SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa03320' },
		        { boxLabel: 'ERBB SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04012' },
		        { boxLabel: 'CALCIUM SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04020' },
		        { boxLabel: 'NEUROACTIVE LIGAND-RECEPTOR INTERACTION', name: 'pathways', inputValue: 'hsa04080' },
		        { boxLabel: 'APOPTOSIS', name: 'pathways', inputValue: 'hsa04210' },
		        { boxLabel: 'WNT SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04310' },
		        { boxLabel: 'NOTCH SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04330' },
		        { boxLabel: 'VEGF SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04370' },
		        { boxLabel: 'CELL ADHESION MOLECULES', name: 'pathways', inputValue: 'hsa04514' },
		        { boxLabel: 'GAP JUNCTION', name: 'pathways', inputValue: 'hsa04540' },
		        { boxLabel: 'ANTIGEN PROCESING AND PRESENTATION', name: 'pathways', inputValue: 'hsa04612' },
		        { boxLabel: 'TOLL-LIKE RECEPTOR SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04620' },
		        { boxLabel: 'JAK-STAT SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04630' },
		        { boxLabel: 'B CELL RECEPTOR SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04662' },
		        { boxLabel: 'Fc EPSILON RI SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04664' },
		        { boxLabel: 'INSULIN SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04910' },
		        { boxLabel: 'GnRH SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04912' },
		        { boxLabel: 'MELANOGENESIS', name: 'pathways', inputValue: 'hsa04916' },
		        { boxLabel: 'ADIPOCYTOKINE SIGNALING PATHWAY', name: 'pathways', inputValue: 'hsa04920' }
		       ]
	});
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Pathways',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "99%",
		buttonAlign:'center',
		items:[
		       {xtype: 'checkboxfield', name: 'allPathways', boxLabel: 'All', handler: checkAll, margin: '0 0 2 4', inputValue: "Funciona"},
		       pathways
		      ]
	});
};

PathiwaysForm.prototype.loadExample1 = function() {
	
};

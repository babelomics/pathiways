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

function PathiwaysForm() {
	this.id = Math.round(Math.random() * 10000000);
	
	this.onSelectNodes = new Event(this);
};

PathiwaysForm.prototype.beforeRun = function() {
};

PathiwaysForm.prototype.getPanels = function() {
	return [
	         this._getSpeciesPanel(),
	         this._getOptionsPanel(),
	         this._getDatabasesPanel()
	        ];
};

PathiwaysForm.prototype._getSpeciesPanel = function() {
	var _this = this;
	
	var speciesValues = Ext.create('Ext.data.Store', {
		fields: ['value', 'name'],
		data : [
		        {"value":"hsapiens", "name":"Human (homo sapiens)"},
		        {"value":"mmusculus", "name":"Mouse (mus musculus)"}
		       ]
	});
	
	var hsapiensValues = Ext.create('Ext.data.Store', {
		fields: ['value', 'name'],
		data : [
		        {"value":"HG-U133", "name":"HG-U133 Plus 2.0"},
		        {"value":"HG-U133A", "name":"HG-U133A"}
		       ]
	});
	
	var mouseValues = Ext.create('Ext.data.Store', {
		fields: ['value', 'name'],
		data : [
		        {"value":"MoGene", "name":"MoGene"}
		       ]
	});
	
	var listener = {change: { element: 'el', fn: function(){
//		combo2.clearValue();
		console.log(this.getValue());
//		combo2.bindStore(mouseValues);
	}}};
	var combo1 = this.createCombobox("species", "Species", speciesValues, 0, listener);
	var combo2 = this.createCombobox("species2", "", hsapiensValues, 0);
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Species',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "100%",
		buttonAlign:'center',
		items:[
		       combo1,
		       combo2
		      ]
	});
};

PathiwaysForm.prototype._getOptionsPanel = function() {
	var fisherValues = Ext.create('Ext.data.Store', {
		fields: ['value', 'name'],
		data : [
		        {"value":"twoTailed", "name":"Two tailed"},
		        {"value":"5", "name":"Over-represented terms in selected nodes (genome comparison)"},
		        {"value":"100", "name":"Over-represented terms in non-selected nodes"}
		       ]
	});
	
	var duplicateValues = Ext.create('Ext.data.Store', {
		fields: ['value', 'name'],
		data : [
		        {"value":"never", "name":"Never"},
		        {"value":"separately", "name":"Remove on each selection separately"},
		        {"value":"commonIds", "name":"Remove on each selection and common ids"},
		        {"value":"complementary", "name":"Remove from non-selected those appearing in selected (complementary list)"}
		       ]
	});
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Options',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "100%",
		buttonAlign:'center',
		items:[
		       this.createCombobox("fisher", "Fisher exact test", fisherValues, 0, 115),
		       this.createCombobox("duplicates", "Remove duplicates?", duplicateValues, 0)
		       ]
	});
};

PathiwaysForm.prototype._getDatabasesPanel = function() {
	var organismValues = Ext.create('Ext.data.Store', {
		fields: ['value', 'name'],
		data : [
		        {"value":"hsapiens", "name":"Human (homo sapiens)"},
		        {"value":"mmusculus", "name":"Mouse (mus musculus)"}
//		        {"value":"rnorvegicus", "name":"Rat (rattus norvegicus)"},
//		        {"value":"dmelanogaster", "name":"Fruitfly (drosophila melanogaster)"},
//		        {"value":"btaurus", "name":"Cow (bos taurus)"},
//		        {"value":"drerio", "name":"Zebrafish (danio rerio)"},
//		        {"value":"scerevisiae", "name":"Saccharomyces cerevisiae"},
//		        {"value":"celegans", "name":"Caenorhabditis elegans"},
//		        {"value":"athaliana", "name":"Arabidopsis thaliana"}
		       ]
	});
	
	var goBPContainer = Ext.create('Ext.container.Container', {
		layout: "hbox",
		items:[
		       this.createCheckBox("goBP", "GO biological process", false, '8 0 0 0', false),
		       {
		           xtype: 'numberfield',
		           name: 'goBPMin',
		           margin: '5 0 0 20',
		           width: '10',
		           flex: 0.5,
		           fieldLabel: 'Min',
		           labelWidth: '20',
		           value: 5,
		           minValue: 0
		       },
		       {
		    	   xtype: 'numberfield',
		    	   name: 'goBPMax',
		    	   margin: '5 0 0 20',
		    	   width: '10',
		           flex: 0.5,
		    	   fieldLabel: 'Max',
		    	   labelWidth: '22',
		    	   value: 1000,
		    	   minValue: 0
		       }
		      ]
	});
	
	var goMFContainer = Ext.create('Ext.container.Container', {
		layout: "hbox",
		items:[
		       this.createCheckBox("goMF", "GO molecular function", false, '8 0 0 0', false),
		       {
		    	   xtype: 'numberfield',
		    	   name: 'goMFMin',
		    	   margin: '5 0 0 19',
		    	   width: '10',
		    	   flex: 0.5,
		    	   fieldLabel: 'Min',
		    	   labelWidth: '20',
		    	   value: 5,
		    	   minValue: 0
		       },
		       {
		    	   xtype: 'numberfield',
		    	   name: 'goMFMax',
		    	   margin: '5 0 0 20',
		    	   width: '10',
		    	   flex: 0.5,
		    	   fieldLabel: 'Max',
		    	   labelWidth: '22',
		    	   value: 1000,
		    	   minValue: 0
		       }
		       ]
	});
	
	var goCCContainer = Ext.create('Ext.container.Container', {
		layout: "hbox",
		items:[
		       this.createCheckBox("goCC", "GO cellular component", false, '8 0 0 0', false),
		       {
		    	   xtype: 'numberfield',
		    	   name: 'goCCMin',
		    	   margin: '5 0 0 15',
		    	   width: '10',
		    	   flex: 0.5,
		    	   fieldLabel: 'Min',
		    	   labelWidth: '20',
		    	   value: 5,
		    	   minValue: 0
		       },
		       {
		    	   xtype: 'numberfield',
		    	   name: 'goCCMax',
		    	   margin: '5 0 0 20',
		    	   width: '10',
		    	   flex: 0.5,
		    	   fieldLabel: 'Max',
		    	   labelWidth: '22',
		    	   value: 1000,
		    	   minValue: 0
		       }
		       ]
	});
	
	var goSlimContainer = Ext.create('Ext.container.Container', {
		layout: "hbox",
		items:[
		       this.createCheckBox("goSlim", "GOSlim GOA", false, '8 0 0 0', false),
		       {
		    	   xtype: 'numberfield',
		    	   name: 'goSlimMin',
		    	   margin: '5 0 0 69',
		    	   width: '10',
		    	   flex: 0.5,
		    	   fieldLabel: 'Min',
		    	   labelWidth: '20',
		    	   value: 5,
		    	   minValue: 0
		       },
		       {
		    	   xtype: 'numberfield',
		    	   name: 'goSlimMax',
		    	   margin: '5 0 0 20',
		    	   width: '10',
		    	   flex: 0.5,
		    	   fieldLabel: 'Max',
		    	   labelWidth: '22',
		    	   value: 1000,
		    	   minValue: 0
		       }
		       ]
	});
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Databases',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "100%",
		buttonAlign:'center',
		items:[
		       this.createCombobox("organism", "Organism", organismValues, 0),
		       goBPContainer,
		       goMFContainer,
		       goCCContainer,
		       goSlimContainer,
		       this.createCheckBox("miRNA", "miRNA targets", false, '8 0 0 0', false),
		       this.createCheckBox("tfbs", "Jaspar TFBS", false, '8 0 0 0', false)
		      ]
	});
};

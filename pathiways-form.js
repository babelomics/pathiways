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
	         this._getSelectDataPanel(),
	         this._getSelectPathwayPanel()
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
	
	var combo1 = this.createCombobox("species", "Species", speciesValues, 0);
	var combo2 = this.createCombobox("species2", "", hsapiensValues, 0);
	function changeCombo() {
		switch (combo1.getValue()) {
		case "hsapiens":
			combo2.clearValue();
			combo2.bindStore(hsapiensValues);
			combo2.setValue("HG-U133");
			break;
		case "mmusculus":
			combo2.clearValue();
			combo2.bindStore(mouseValues);
			combo2.setValue("MoGene");
			break;
		}
	};
	combo1.on({select: changeCombo, scope: this});
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Species',
		border: true,
		bodyPadding: "10",
		margin: "0 0 5 0",
		width: "100%",
		buttonAlign:'center',
		layout: 'hbox',
		items:[
		       combo1,
		       combo2
		      ]
	});
};

PathiwaysForm.prototype._getSelectDataPanel = function() {
	var btnBrowse1 = Ext.create('Ext.button.Button', {
        text: 'Browse data',
        margin: '5 0 0 0',
        handler: function (){
   		}
	});
	
	var btnBrowse2 = Ext.create('Ext.button.Button', {
		text: 'Browse data',
		margin: '5 0 0 0',
		handler: function (){
		}
	});
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Select your data',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "100%",
		buttonAlign:'center',
		layout: 'vbox',
		items:[
		       {xtype: 'text', text: 'Normalized matrix:'},
		       btnBrowse1,
		       {xtype: 'text', text: 'Experimental design:', margin: '15 0 0 0'},
		       btnBrowse2
		      ]
	});
};

PathiwaysForm.prototype._getSelectPathwayPanel = function() {
	function checkAll(allValue) {
		pathways.items.each(function(item) {
		    item.setValue(allValue.value);
		});
	};
	
	var pathways = Ext.create('Ext.form.CheckboxGroup', {
//		fieldLabel: 'Pathways',
		// Arrange checkboxes into two columns, distributed vertically
		columns: 2,
		vertical: true,
		defaults: {margin: '0 15 0 0'},
		items: [
		        { boxLabel: 'Item 1', name: 'pathways1', inputValue: 'i1' },
		        { boxLabel: 'Item 2', name: 'pathways2', inputValue: 'i2' },
		        { boxLabel: 'Item 3', name: 'pathways3', inputValue: 'i3' },
		        { boxLabel: 'Item 4', name: 'pathways4', inputValue: 'i4' },
		        { boxLabel: 'Item 5', name: 'pathways5', inputValue: 'i5' },
		        { boxLabel: 'Item 6', name: 'pathways6', inputValue: 'i6' }
		       ]
	});
	
	return Ext.create('Ext.panel.Panel', {
		title: 'Select pathway',
		border: true,
		bodyPadding: "5",
		margin: "0 0 5 0",
		width: "100%",
		buttonAlign:'center',
		items:[
		       {xtype: 'checkboxfield', name: 'allPathways', boxLabel: 'All', handler: checkAll, margin: '0 0 2 4'},
		       pathways
		      ]
	});
};

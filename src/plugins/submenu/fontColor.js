/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 2017 JiHong Lee.
 * MIT license.
 */
'use strict';

import colorPicker from '../modules/colorPicker';

export default {
    name: 'fontColor',
    add: function (core, targetElement) {
        core.addModule([colorPicker]);

        const context = core.context;
        context.fontColor = {
            previewEl: null,
            colorInput: null,
            colorList: null
        };

        /** set submenu */
        let listDiv = this.setSubmenu.call(core);
        context.fontColor.colorInput = listDiv.querySelector('._se_color_picker_input');

        /** add event listeners */
        context.fontColor.colorInput.addEventListener('keyup', this.onChangeInput.bind(core));
        listDiv.querySelector('._se_color_picker_submit').addEventListener('click', this.submit.bind(core));
        listDiv.querySelector('._se_color_picker_remove').addEventListener('click', this.remove.bind(core));
        listDiv.addEventListener('click', this.pickup.bind(core));

        context.fontColor.colorList = listDiv.querySelectorAll('li button');

        /** append html */
        targetElement.parentNode.appendChild(listDiv);

        /** empty memory */
        listDiv = null;
    },

    setSubmenu: function () {
        const colorArea = this.context.colorPicker.colorListHTML;
        const listDiv = this.util.createElement('DIV');

        listDiv.className = 'se-submenu se-list-layer';
        listDiv.innerHTML = colorArea;

        return listDiv;
    },

    on: function () {
        const contextPicker = this.context.colorPicker;
        const contextFontColor = this.context.fontColor;

        contextPicker._colorInput = contextFontColor.colorInput;
        contextPicker._defaultColor = '#333333';
        contextPicker._styleProperty = 'color';
        contextPicker._colorList = contextFontColor.colorList;
        
        this.plugins.colorPicker.init.call(this, this.getSelectionNode(), null);
    },

    onChangeInput: function (e) {
        this.plugins.colorPicker.setCurrentColor.call(this, e.target.value);
    },
    
    remove: function () {
        this.nodeChange(null, ['color']);
        this.submenuOff();
        this.focus();
    },

    submit: function () {
        this.plugins.fontColor.applyColor.call(this, this.context.colorPicker._currentColor);
    },

    pickup: function (e) {
        e.preventDefault();
        e.stopPropagation();

        this.plugins.fontColor.applyColor.call(this, e.target.getAttribute('data-value'));
    },

    applyColor: function (color) {
        if (!color) return;

        const newNode = this.util.createElement('SPAN');
        newNode.style.color = color;
        this.nodeChange(newNode, ['color']);

        this.submenuOff();
    }
};

'use strict';

var React = require('react');

var TextEditor = React.createClass({
    displayName: 'TextEditor',


    getInitialState: function getInitialState() {
        return {
            ref: this.props.reference || 'wysiwyg_editor',
            id: this.props.id || 'wysiwyg_editor',
            className: this.props.className || 'well',
            style: this.props.style || { maxHeight: '300px', overflow: 'scroll' },
            toolbar_buttons: this.props.toolbar_buttons || ['bold', 'italic', 'underline', 'list', 'link', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'image', 'header'],
            show_toolbar: this.props.show_toolbar === undefined ? true : this.props.show_toolbar,
            headerTags: ['<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>']
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        if (this.state.ref !== newProps.reference || this.state.id !== newProps.id) {
            this.setState({
                ref: newProps.reference,
                id: newProps.id
            });
        }
    },
    insertStyle: function insertStyle(type) {
        document.execCommand(type, false, null);
        this.contentUpdate();
    },
    insertHeading: function insertHeading(h) {
        document.execCommand('formatBlock', false, h);
        this.contentUpdate();
    },
    insertLink: function insertLink(uri) {
        document.execCommand('createLink', false, uri);
        this.setState({ link_url: '' }, function () {
            this.contentUpdate();
        });
    },
    insertField: function insertField(field, e) {
        document.execCommand('insertText', false, field);
        this.contentUpdate();
    },
    insertImage: function insertImage(uri) {
        document.execCommand('insertImage', false, uri);
        this.contentUpdate();
    },
    uploadImage: function uploadImage(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        if (file) {
            reader.onload = this.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    },
    imageIsLoaded: function imageIsLoaded(e) {
        this.insertImage(e.target.result);
    },
    setCursor: function setCursor() {
        React.findDOMNode(this.refs[this.state.ref]).focus();
        var sel = window.getSelection();
        var range = document.createRange();
        range.setStart(React.findDOMNode(this.refs[this.state.ref]), 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    },
    onMouseDown: function onMouseDown() {
        this.setCursor();
    },
    onKeyUp: function onKeyUp(e) {
        this.contentUpdate();
    },
    contentUpdate: function contentUpdate() {
        var target = React.findDOMNode(this.refs[this.state.ref]);
        target.focus();
        this.props.update(target.innerHTML, this.state.ref);
    },
    onUrlChange: function onUrlChange(e) {
        this.setState({ link_url: e.target.value });
    },
    toolBar: function toolBar() {
        if (!this.state.show_toolbar) {
            return null;
        }

        return this.state.toolbar_buttons.map(function (type) {
            return this.getButton(type);
        }, this);
    },
    getButton: function getButton(type) {
        switch (type) {
            case 'link':
                return React.createElement(
                    'div',
                    { className: 'input-group', key: '_wysiwyg_' + type },
                    React.createElement(
                        'span',
                        { className: 'input-group-btn' },
                        React.createElement(
                            'button',
                            { key: type, type: 'button', className: 'btn btn-primary', onClick: this.insertLink.bind(null, this.state.link_url) },
                            React.createElement('i', { className: 'glyphicon glyphicon-link' })
                        )
                    ),
                    React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'URL', value: this.state.link_url, onChange: this.onUrlChange })
                );
            case 'list':
                return React.createElement(
                    'button',
                    { key: type, type: 'button', className: 'btn btn-primary', onClick: this.insertStyle.bind(null, 'insertUnorderedList') },
                    React.createElement('i', { className: 'glyphicon glyphicon-list' })
                );
            case 'underline':
                return React.createElement(
                    'button',
                    { key: type, type: 'button', className: 'btn btn-primary', onClick: this.insertStyle.bind(null, type) },
                    'U'
                );
            case 'justify':
                var pos = type.split('justify')[1].toLowerCase();
                if (pos === 'full') {
                    pos = 'justify';
                }
                return React.createElement(
                    'button',
                    { key: type, type: 'button', className: 'btn btn-primary', onClick: this.insertStyle.bind(null, type) },
                    React.createElement('i', { className: "glyphicon glyphicon-align-" + pos })
                );
            case 'image':
                return React.createElement('input', { style: { display: 'inline' }, key: type, type: 'file', className: 'btn btn-primary', onChange: this.uploadImage.bind(this) });
            case 'header':
                return this.state.headerTags.map(function (tag, i) {
                    return React.createElement(
                        'button',
                        { key: type + '_' + tag, type: 'button', className: 'btn btn-primary', onClick: this.insertHeading.bind(null, tag) },
                        React.createElement('i', { className: "glyphicon glyphicon-header" }),
                        i + 1
                    );
                }, this);
            default:
                return React.createElement(
                    'button',
                    { key: type, type: 'button', className: 'btn btn-primary', onClick: this.insertStyle.bind(null, type) },
                    React.createElement('i', { className: "glyphicon glyphicon-" + type })
                );
        }
    },
    txtEditor: function txtEditor() {
        return React.createElement('div', {
            id: this.state.id,
            ref: this.state.ref,
            name: 'text_body',
            className: this.state.className,
            tabIndex: 0,
            key: '0',
            contentEditable: true,
            onMouseDown: this.onMouseDown,
            onTouchStart: this.onMouseDown,
            onKeyUp: this.onKeyUp,
            onClick: this.props.onClick,
            style: this.state.style,
            dangerouslySetInnerHTML: {
                __html: this.props.html
            }
        });
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'form-inline' },
                this.toolBar()
            ),
            this.txtEditor()
        );
    }
});

module.exports = TextEditor;

'use strict';

var React = require('react');

var TextEditor = React.createClass({
    displayName: 'TextEditor',

    getInitialState: function getInitialState() {
        return {
            html: this.props.html || '<b>WYSIWYG Editor</b> For <a href="http://www.reactjs.com">ReactJS</a>.',
            ref: this.props.reference || 'wysiwyg_editor',
            id: this.props.id || 'wysiwyg_editor',
            className: this.props.className || 'well',
            style: this.props.style || { maxHeight: '300px', overflow: 'scroll' },
            toolbar_buttons: this.props.toolbar_buttons || ['bold', 'italic', 'underline', 'list', 'link'],
            show_toolbar: this.props.show_toolbar === undefined ? true : this.props.show_toolbar
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        if (this.props.html === undefined || this.state.html === undefined || this.state.ref === undefined) {
            this.setState({
                html: newProps.html,
                ref: newProps.reference,
                id: newProps.id
            });
        }
    },
    insertStyle: function insertStyle(type) {
        document.execCommand(type, false, null);
        this.contentUpdate();
    },
    insertLink: function insertLink(uri) {
        document.execCommand('createLink', false, uri);
        this.state.link_url = '';
        this.contentUpdate();
    },
    insertField: function insertField(field, e) {
        document.execCommand('insertText', false, field);
        this.contentUpdate();
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
    onKeyDown: function onKeyDown(e) {},
    onKeyPress: function onKeyPress(e) {},
    contentUpdate: function contentUpdate() {
        var target = React.findDOMNode(this.refs[this.state.ref]);
        this.props.update(target.innerHTML, this.state.ref);
    },
    onUrlChange: function onUrlChange(e) {
        this.state.link_url = e.target.value;
        this.forceUpdate();
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'form-inline' },
                toolbar(this)
            ),
            txtEditor(this)
        );
    }
});

function toolbar(context) {
    if (context.state.show_toolbar) {
        var btns = [];
        context.state.toolbar_buttons.map(function (type) {
            if (type === 'link') {
                btns.push(React.createElement(
                    'div',
                    { className: 'input-group' },
                    React.createElement(
                        'span',
                        { className: 'input-group-btn' },
                        React.createElement(
                            'button',
                            { key: type, type: 'button', className: 'btn btn-primary', onClick: context.insertLink.bind(null, context.state.link_url) },
                            React.createElement('i', { className: 'glyphicon glyphicon-link' })
                        )
                    ),
                    React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'URL', value: context.state.link_url, onChange: context.onUrlChange })
                ));
            } else if (type === 'list') {
                btns.push(React.createElement(
                    'button',
                    { key: type, type: 'button', className: 'btn btn-primary', onClick: context.insertStyle.bind(null, 'insertUnorderedList') },
                    React.createElement('i', { className: 'glyphicon glyphicon-list' })
                ));
            } else if (type === 'underline') {
                btns.push(React.createElement(
                    'button',
                    { key: type, type: 'button', className: 'btn btn-primary', onClick: context.insertStyle.bind(null, type) },
                    'U'
                ));
            } else {
                btns.push(React.createElement(
                    'button',
                    { key: type, type: 'button', className: 'btn btn-primary', onClick: context.insertStyle.bind(null, type) },
                    React.createElement('i', { className: "glyphicon glyphicon-" + type })
                ));
            }
        });
        return btns;
    } else {
        return React.createElement('div', null);
    }
}

function txtEditor(context) {
    if (context.state.id && context.state.ref) {
        return React.createElement('div', {
            id: context.state.id,
            ref: context.state.ref,
            name: 'email_body',
            className: context.state.className,
            tabIndex: 0,
            key: '0',
            contentEditable: true,
            onKeyDown: context.onKeyDown,
            onMouseDown: context.onMouseDown,
            onTouchStart: context.onMouseDown,
            onKeyPress: context.onKeyPress,
            onKeyUp: context.onKeyUp,
            onClick: context.props.onClick,
            style: context.state.style,
            dangerouslySetInnerHTML: {
                __html: context.state.html
            }
        });
    } else {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'p',
                null,
                'ID or Reference not defined'
            )
        );
    }
}

module.exports = TextEditor;
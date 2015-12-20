var _ = require( 'underscore' );
var React = require( 'react' );

var TextEditor = React.createClass({

    getInitialState: function(){
        return _.extend( {
            html: '<b>WYSIWYG Editor</b> For ReactJS.',
            ref: 'wysiwyg_editor',
            id: 'wysiwyg_editor',
            className: 'well',
            placeholder: false,
            editing: false,
            style: { maxHeight: '300px', overflow: 'scroll' }
        }, this.props );
    },
    componentWillReceiveProps: function ( newProps ) {
        if ( this.props.html === undefined || this.state.html === undefined || this.state.ref === undefined ) {
            this.setState( {
                html: newProps.html,
                ref: newProps.reference,
                id: newProps.id
            } );
        }
    },
    insertStyle: function ( type ) {
        document.execCommand( type, false, null );
        this.contentUpdate();
    },
    insertLink: function ( uri ) {
        document.execCommand( 'createLink', false, uri );
        this.contentUpdate();
    },
    insertField: function ( field, e ) {
        document.execCommand( 'insertText', false, field );
        this.contentUpdate();
    },
    setCursor: function () {
        React.findDOMNode( this.refs[ this.state.ref ] ).focus();
        var sel = window.getSelection();
        var range = document.createRange();
        range.setStart( React.findDOMNode( this.refs[ this.state.ref ] ), 0 );
        range.collapse( true );
        sel.removeAllRanges();
        sel.addRange( range );
    },
    onMouseDown: function () {
        this.setCursor();
    },
    onKeyUp: function ( e ) {
        this.contentUpdate();
    },
    onKeyDown: function ( e ) {},
    onKeyPress: function ( e ) {},
    contentUpdate: function () {
        var target = React.findDOMNode( this.refs[ this.state.ref ] );
        this.props.update( target.innerHTML, this.state.ref );
    },
    render: function(){
        return (
            <div>
                <button type="button" className="btn btn-default" onClick={this.insertStyle.bind( null, 'bold')} ><i className="glyphicon glyphicon-bold" /></button>
                <button type="button" className="btn btn-default" onClick={this.insertStyle.bind( null, 'underline')} >U</button>
                <button type="button" className="btn btn-default" onClick={this.insertLink.bind( null, 'http://www.google.com')} ><i className="glyphicon glyphicon-link" /></button>
                <button type="button" className="btn btn-default" onClick={this.insertStyle.bind( null, 'insertOrderedList')} ><i className="glyphicon glyphicon-list" /></button>
                { txtEditor( this ) }
            </div>
        );
    }
});

function txtEditor ( context ) {
    if ( context.state.id && context.state.ref ) {
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
        } );
    } else {
        return (
            <div>
                <p>ID or Reference not defined</p>
            </div>
        );
    }

}

module.exports = TextEditor;
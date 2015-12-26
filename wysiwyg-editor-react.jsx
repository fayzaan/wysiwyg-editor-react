var React = require( 'react' );

var TextEditor = React.createClass({

    getInitialState: function () {
        return {
            html: this.props.html || '<b>WYSIWYG Editor</b> For <a href="http://www.reactjs.com">ReactJS</a>.',
            ref: this.props.reference || 'wysiwyg_editor',
            id: this.props.id || 'wysiwyg_editor',
            className: this.props.className || 'well',
            style: this.props.style || { maxHeight: '300px', overflow: 'scroll' },
            toolbar_buttons: this.props.toolbar_buttons || [ 'bold', 'italic', 'underline', 'list', 'link' ],
            show_toolbar: this.props.show_toolbar === undefined ? true : this.props.show_toolbar
        }
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
        this.state.link_url = '';
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
    onUrlChange: function ( e ) {
        this.state.link_url = e.target.value;
        this.forceUpdate();
    },
    render: function(){
        return (
            <div>
                <div className="form-inline">{ toolbar( this ) }</div>
                { txtEditor( this ) }
            </div>
        );
    }
});

function toolbar ( context ) {
    if ( context.state.show_toolbar ) {
        var btns = [];
        context.state.toolbar_buttons.map( function ( type ) {
            if ( type === 'link' ) {
                btns.push(
                    <div className="input-group">
                        <span className="input-group-btn">
                            <button key={type} type="button" className="btn btn-primary" onClick={context.insertLink.bind( null, context.state.link_url)} ><i className="glyphicon glyphicon-link" /></button>
                        </span>
                        <input type="text" className="form-control" placeholder="URL" value={context.state.link_url} onChange={context.onUrlChange} />
                    </div>
                )
            } else if ( type === 'list' ) {
                btns.push(
                    <button key={type} type="button" className="btn btn-primary" onClick={context.insertStyle.bind( null, 'insertUnorderedList')} ><i className="glyphicon glyphicon-list" /></button>
                )
            } else if ( type === 'underline' ) {
                btns.push( <button key={type} type="button" className="btn btn-primary" onClick={context.insertStyle.bind( null, type )} >U</button> )
            } else {
                btns.push(
                    <button key={type} type="button" className="btn btn-primary" onClick={context.insertStyle.bind( null, type )} ><i className={ "glyphicon glyphicon-" + type } /></button>
                )
            }
        } );
        return btns;
    } else {
        return <div></div>;
    }
}

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
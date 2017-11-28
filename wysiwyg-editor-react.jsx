var React = require( 'react' );

var TextEditor = React.createClass({

    getInitialState: function () {
        return {
            ref: this.props.reference || 'wysiwyg_editor',
            id: this.props.id || 'wysiwyg_editor',
            className: this.props.className || 'well',
            style: this.props.style || { maxHeight: '300px', overflow: 'scroll' },
            toolbar_buttons: this.props.toolbar_buttons || [ 'bold', 'italic', 'underline', 'list', 'link', 'justifyLeft', 'justifyCenter','justifyRight', 'justifyFull', 'image', 'header' ],
            show_toolbar: this.props.show_toolbar === undefined ? true : this.props.show_toolbar,
            headerTags: [ '<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>' ]
        }
    },
    componentWillReceiveProps: function ( newProps ) {
        if ( this.state.ref !== newProps.reference || this.state.id !== newProps.id ) {
            this.setState( {
                ref: newProps.reference,
                id: newProps.id
            } );
        }
    },
    insertStyle: function ( type ) {
        document.execCommand( type, false, null );
        this.contentUpdate();
    },
    insertHeading: function ( h ) {
        document.execCommand( 'formatBlock', false, h );
        this.contentUpdate();
    },
    insertLink: function ( uri ) {
        document.execCommand( 'createLink', false, uri );
        this.setState( { link_url: '' }, function () {
            this.contentUpdate();
        } );
    },
    insertField: function ( field, e ) {
        document.execCommand( 'insertText', false, field );
        this.contentUpdate();
    },
    insertImage: function ( uri ) {
        document.execCommand( 'insertImage', false, uri );
        this.contentUpdate();
    },
    uploadImage: function ( e ) {
        var file = e.target.files[ 0 ];
        var reader = new FileReader();
        if ( file ) {
            reader.onload = this.imageIsLoaded;
            reader.readAsDataURL( file );
        }
    },
    imageIsLoaded: function ( e ) {
        this.insertImage( e.target.result );
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
    contentUpdate: function () {
        var target = React.findDOMNode( this.refs[ this.state.ref ] );
        target.focus();
        this.props.update( target.innerHTML, this.state.ref );
    },
    onUrlChange: function ( e ) {
        this.setState( { link_url: e.target.value } );
    },
    toolBar: function () {
        if ( !this.state.show_toolbar ) { return null; }

        return this.state.toolbar_buttons.map( function ( type ) {
            return this.getButton( type );
        }, this );
    },
    getButton: function ( type ) {
        switch ( type ) {
                case 'link':
                    return (
                        <div className="input-group" key={'_wysiwyg_' + type}>
                            <span className="input-group-btn">
                                <button key={type} type="button" className="btn btn-primary" onClick={this.insertLink.bind( null, this.state.link_url)} ><i className="glyphicon glyphicon-link" /></button>
                            </span>
                            <input type="text" className="form-control" placeholder="URL" value={this.state.link_url} onChange={this.onUrlChange} />
                        </div>
                    );
                case 'list':
                    return <button key={type} type="button" className="btn btn-primary" onClick={this.insertStyle.bind( null, 'insertUnorderedList' )} ><i className="glyphicon glyphicon-list" /></button>;
                case 'underline':
                    return <button key={type} type="button" className="btn btn-primary" onClick={this.insertStyle.bind( null, type )} >U</button>;
                case 'justify':
                    var pos = type.split( 'justify' )[ 1 ].toLowerCase();
                    if ( pos === 'full' ) { pos = 'justify' }
                    return <button key={type} type="button" className="btn btn-primary" onClick={this.insertStyle.bind( null, type )} ><i className={ "glyphicon glyphicon-align-" + pos } /></button>;
                case 'image':
                    return <input style={{display:'inline'}} key={type} type="file" className="btn btn-primary" onChange={this.uploadImage.bind( this )} />;
                case 'header':
                    return this.state.headerTags.map( function ( tag, i ) {
                        return <button key={type+'_'+tag} type="button" className="btn btn-primary" onClick={this.insertHeading.bind( null, tag )} ><i className={ "glyphicon glyphicon-header" } />{( i + 1 )}</button>
                    }, this );
                default:
                    return <button key={type} type="button" className="btn btn-primary" onClick={this.insertStyle.bind( null, type )} ><i className={ "glyphicon glyphicon-" + type } /></button>;
            }
    },
    txtEditor () {
        return React.createElement( 'div', {
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
        } );
    },
    render: function(){
        return (
            <div>
                <div className="form-inline">{ this.toolBar() }</div>
                { this.txtEditor() }
            </div>
        );
    }
} );

module.exports = TextEditor;
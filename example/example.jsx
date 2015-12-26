var React = require( 'react' );
var Editor = require( './wysiwyg-editor-react.js' );

var Example = React.createClass( {
	getInitialState: function () {
		return {
			text: '<b>WYSIWYG Editor</b> For <a href="http://www.reactjs.com">ReactJS</a>.'
		}
	},
	onTextUpdate: function ( val ) {
		this.state.text = val;
		this.forceUpdate();
	},
	render: function () {
		return (
			<div>
				<Editor show_toolbar={true} toolbar_buttons={[ 'bold', 'italic', 'underline', 'list', 'link' ]} className="well" html={this.state.text} update={this.onTextUpdate} />
				{this.state.text}
			</div>
		)
	}
} );

module.exports = Example;
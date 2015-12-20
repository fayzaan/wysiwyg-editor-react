var React = require( 'react' );
var Editor = require( '../index' );

var Example = React.createClass( {
	getInitialState: function () {
		return {
			text: '<b>WYSIWYG Editor</b> For ReactJS.'
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
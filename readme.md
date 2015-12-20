# WYSIWYG EDITOR For ReactJS .13+

This component allows users to enter text and style text using common styling techniques, such as Bold, Italic, Underline, etc. It is a very basic implementation and I intend to expand on this project further.

You can look at the example folder to get an understanding of implementing this editor.

## Install

```
$ npm install wysiwyg-editor-react
```

## Usage

```javascript
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
        <Editor className="well" html={this.state.text} update={this.onTextUpdate} />
        {this.state.text}
      </div>
    )
  }
} );

module.exports = Example;
```
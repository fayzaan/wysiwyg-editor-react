# WYSIWYG EDITOR For ReactJS .13+

This component allows users to enter text and style text using common styling techniques, such as Bold, Italic, Underline, etc. It is a very basic implementation and I intend to expand on this project further.

You can look at the example folder to get an understanding of implementing this editor.

## Install

```
$ npm install wysiwyg-editor-react
```

## Include

```
var Editor = require( 'wysiwyg-editor-react' );
```

## Usage

```javascript
var React = require( 'react' );
var Editor = require( 'wysiwyg-editor-react' );

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
        <Editor className="well" html={this.state.text} update={this.onTextUpdate} />
        {this.state.text}
      </div>
    )
  }
} );

module.exports = Example;
```

## Options

* You can list the buttons you want shown in the toolbar by passing in an array to toolbar_buttons.
```e.g. [ 'bold', 'italic', 'underline', 'list', 'link' ] ```
* You can hide the toolbar by setting show_toolbar to false.
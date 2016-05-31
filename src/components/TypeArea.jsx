import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {movingForward: true}
  },
  isCorrect: function() {
    var correctString = this.props.currentWord + ' ';
    var currentString = this.refs.wordInput && this.refs.wordInput.value;
    return correctString.indexOf(currentString) == 0;
  },
  handlePress: function(e) {
    if (e.keyCode == 8) {
      this.setState({movingForward: false});
    }
    else {
      this.setState({movingForward: true});
    }
  },
  handleChange: function(e) {
    if (this.state.movingForward) {
      var correctString = this.props.currentWord + ' ';
      this.props.updateStreak(this.isCorrect());
      if (e.target.value == correctString) {
        console.log("CORRECT");
        e.target.value = '';
        this.props.nextWord();
      }
    }
    else {
      this.props.updateStreak(false, true);
    }
  },
  render: function() {
    console.log(this);
    return (
      <input
      style={{color: this.isCorrect() ? 'green' : 'red'}} ref="wordInput" onChange={this.handleChange} onKeyDown={this.handlePress}/>
    );
  }
});

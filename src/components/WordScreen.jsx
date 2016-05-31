import React from 'react';
export default React.createClass({
   genView: function(idx) {
      return {
         before: this.props.words.slice(Math.max(idx - 3, 0), idx),
         focus: this.props.words[idx],
         after: this.props.words.slice(idx + 1, Math.min(this.props.words.length + 1, idx + 4))
      }
   },
   render: function() {
      var currentWords = this.genView(this.props.wordIdx);
      return (
         <div className="test">
            <span className="word-screen-before">{currentWords.before.join(' ')}</span>
            <span className="word-screen-focus">{currentWords.focus}</span>
            <span className="word-screen-after">{currentWords.after.join(' ')}</span>
         </div>
      );
   }
});

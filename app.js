$.ajax( {
   url: 'https://en.wikipedia.org/w/api.php',
   data: {action: 'parse', prop: 'text', page: 'Hinduism', format: 'json'},
   dataType: 'jsonp',
   type: 'POST',
   headers: { 'Api-User-Agent': 'supertyper/1.0 (https://example.org/supertyper/; mdsiboldi@gmail.com)', 'Origin': 'http://massimo.cool' },
   success: function(data) {
      var text = $(data.parse.text['*']).find('p').text().split(/\s+|\[\d+\]/);
      debugger;
   }
});

var WordScreen = React.createClass({
   render: function() {
      console.log(this.props);
      return (
         <div className="test">
            {this.props.words.join(' ')}
         </div>
      );
   }
});

var TypeArea = React.createClass({
   getInitialState: function() {
      return {movingForward: true}
   },
   isCorrect: function() {
      var inputy = document.getElementById('inputy');
      var correctString = this.props.currentWord + ' ';
      var currentString = inputy && inputy.value;
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
         this.props.updateStreak(false);
      }
   },
   render: function() {
      console.log(this);
      return (
         <input style={{color: this.isCorrect() ? 'green' : 'red'}} id="inputy" onChange={this.handleChange} onKeyDown={this.handlePress}/>
      );
   }
});

var Application = React.createClass({
   updateStreak: function(isGood) {
      this.state.streak = isGood ? this.state.streak + 1 : 0;
      this.setState(this.state);
   },
   getInitialState: function() {
      return {
         words: ['an', 'amber', 'create', 'cradle'],
         wordIdx: 0,
         streak: 0
      }
   },
   nextWord: function() {
      this.state.words.push(this.state.words.shift());
      this.setState(this.state);
      console.log(this.state.words);
   },
   render: function() {
      return (
         <div>
            <h1>The App</h1> 
            <WordScreen words={this.state.words} />
            <TypeArea currentWord={this.state.words[this.state.wordIdx]} nextWord={this.nextWord} streak={this.state.streak} updateStreak={this.updateStreak}/>
            <p style={{fontSize: (12 + this.state.streak / 5) + 'px'}}>{this.state.streak}</p>
         </div>
      )
   }
});

ReactDOM.render(
   <Application />,
   document.getElementById('app')
);

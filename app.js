
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

   getInitialState: function() {
      var keys = 'asdfjkl;';
      return {
         words: this.generateNonsense(keys, 20),
         keys: keys,
         wordIdx: 0,
         streak: 0,
         hiscore: {streak: 0, timeStart: 0, timeEnd:  0},
         timeStart: 0,
      }
   },
   updateStreak: function(isGood) {
      if (this.state.timeStart == 0) this.state.timeStart = Date.now();
      if (isGood) {
         this.state.streak++;
         if (this.state.streak > this.state.hiscore.streak) {
            this.state.hiscore =  {streak: this.state.streak, timeStart: this.state.timeStart, timeEnd: Date.now()};
         }
      }
      else {
         this.state.streak = 0;
         this.state.timeStart = new Date;
      }
      this.setState(this.state);
      
   },
   generateNonsense: function(keys, n) {
      var arr = [];
      while (n-- > 0) {
         var word = '';
         var wordLength = 3 + Math.floor(Math.random() * 3);
         while (wordLength-- > 0) {
            word += keys[Math.floor(Math.random() * keys.length)];
         }
         arr.push(word);
      }
      return arr;
   },
   setScore: function() {
   },
   componentDidMount: function() {
      this.req = $.ajax({
         url: 'https://en.wikipedia.org/w/api.php',
         data: {action: 'query', prop: 'extracts', explaintext: true, titles: 'React (JavaScript library)', format: 'json'},
         dataType: 'jsonp',
         type: 'POST',
         headers: { 'Api-User-Agent': 'supertyper/1.0 (https://example.org/supertyper/; mdsiboldi@gmail.com)', 'Origin': 'http://massimo.cool' },
         success: function(data) {
            var words = data.query.pages[Object.keys(data.query.pages)[0]].extract.split(/\s/).slice(0, 50);
            this.setState({words: words, wordIdx: 0, streak: 0});
         }.bind(this)
      });
   },
   nextWord: function() {
      this.state.words.shift();
      this.state.words.push(this.generateNonsense(this.state.keys, 1));
      this.setState(this.state);
   },
   render: function() {
      return (
         <div>
            <h1>The App</h1> 
            <WordScreen words={this.state.words} />
            <TypeArea currentWord={this.state.words[this.state.wordIdx]}
               nextWord={this.nextWord} 
               streak={this.state.streak} 
               updateStreak={this.updateStreak}
            />
            <p style={{fontSize: (12 + this.state.streak / 5) + 'px'}}>{this.state.streak}</p>
            <h2>TOP SCORE: {this.state.hiscore.streak}, {this.state.hiscore.streak * 1000 * 60 / (this.state.hiscore.timeEnd - this.state.hiscore.timeStart)}</h2>
         </div>
      )
   }
});

ReactDOM.render(
   <Application />,
   document.getElementById('app')
);

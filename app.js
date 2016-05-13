var WordScreen = React.createClass({
   genView: function(idx) {
      return {
         before: [this.props.words[idx - 3],
                  this.props.words[idx - 2],
                  this.props.words[idx - 1]
                 ],
         focus: this.props.words[idx],
         after:  [this.props.words[idx + 1],
                  this.props.words[idx + 2],
                  this.props.words[idx + 3]
                 ]
      }
   },
   render: function() {
      var currentWords = this.genView(this.props.wordIdx);
      return (
         <div className="test">
            <span id="word-screen-before">{currentWords.before.join(' ')}</span> <span id="word-screen-focus">{currentWords.focus}</span> <span id="word-screen-after"> {currentWords.after.join(' ')}</span>
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
         this.props.updateStreak(false, true);
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
         hiscore: {streak: Cookies.get('streak') || 0, 
                   timeStart: parseInt(Cookies.get('timeStart')) || 0, 
                   timeEnd: parseInt(Cookies.get('timeEnd')) || 0},
         timeStart: 0,
         strokes: 0,
         mistakes: 0

      }
   },
   updateStreak: function(isGood, isBackspace) {
      if (this.state.timeStart == 0) this.state.timeStart = Date.now();
      if (isGood) {
         this.state.strokes++;
         this.state.streak++;
         if (this.state.streak > this.state.hiscore.streak) {
            this.state.hiscore =  {streak: this.state.streak, 
                                   timeStart: this.state.timeStart, 
                                   timeEnd: Date.now()};
            Cookies.set('streak', this.state.streak);
            Cookies.set('timeStart', this.state.timeStart);
            Cookies.set('timeEnd', Date.now());
         }
      }
      else {
         if (!isBackspace) {
            this.state.mistakes++;
         }
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
            var words = data.query.pages[Object.keys(data.query.pages)[0]].extract.split(/\s/);
            this.setState({words: words, wordIdx: 0, streak: 0});
         }.bind(this)
      });
   },
   nextWord: function() {
      this.state.wordIdx++;
      this.state.words.push(this.generateNonsense(this.state.keys, 1));
      this.setState(this.state);
   },
   render: function() {
      return (
         <div>
            <h1>The App</h1> 
            <WordScreen words={this.state.words} wordIdx={this.state.wordIdx} />
            <TypeArea currentWord={this.state.words[this.state.wordIdx]}
               nextWord={this.nextWord} 
               streak={this.state.streak} 
               updateStreak={this.updateStreak}
            />
            <p style={{fontSize: (12 + this.state.streak / 5) + 'px'}}>{this.state.streak}</p>
            <h2>TOP SCORE: {this.state.hiscore.streak}, {this.state.hiscore.streak * 1000 * 60 / (this.state.hiscore.timeEnd - this.state.hiscore.timeStart)}</h2>
            <h2>{this.state.hiscore.streak}, {this.state.hiscore.timeEnd}, {this.state.hiscore.timeStart}</h2>
            <h2>{this.state.strokes * 100 / (this.state.strokes + this.state.mistakes)}</h2>
         </div>
      )
   }
});

ReactDOM.render(
   <Application />,
   document.getElementById('app')
);

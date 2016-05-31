import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import $ from 'jquery';

import WordScreen from './WordScreen';
import TypeArea from './TypeArea';

const homeBase = 'asdfjkl;'

export default React.createClass({

  getInitialState: function() {
    return {
      words: this.generatePhrase(homeBase, 20),
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
    if (this.state.timeStart == 0) this.state.timeStart = +Date.now();
    if (isGood) {
      this.state.strokes++;
      this.state.streak++;
      if (this.state.streak > this.state.hiscore.streak) {
        this.state.hiscore =  {streak: this.state.streak,
                               timeStart: this.state.timeStart,
                               timeEnd: +Date.now()};
        Cookies.set('streak', this.state.streak);
        Cookies.set('timeStart', this.state.timeStart);
        Cookies.set('timeEnd', +Date.now());
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
  generatePhrase: function(keys, n) {
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
    this.state.words.push(this.generatePhrase(this.state.keys, 1));
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

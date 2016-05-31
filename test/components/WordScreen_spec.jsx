import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass
} from 'react-addons-test-utils';
import {expect} from 'chai';
import WordScreen from '../../src/components/WordScreen';

describe('WordScreen', () => {
  it('puts the lotion on the skin', () => {
    const component = renderIntoDocument(
      <WordScreen
        words={
          ['this', 'is', 'a', 'cool', 'and', 'radical', 'test', 'yeah']
        }
        wordIdx={0}
      />
    );
    console.log(document.querySelectorAll('div'));
    const beforeDiv = findRenderedDOMComponentWithClass(component, 'word-screen-before');
    const focusDiv = findRenderedDOMComponentWithClass(component, 'word-screen-focus');
    const afterDiv = findRenderedDOMComponentWithClass(component, 'word-screen-after');

    console.log('look',beforeDiv.textContent);
    expect(beforeDiv.textContent).to.equal('');
    expect(focusDiv.textContent).to.equal('this');
    expect(afterDiv.textContent).to.equal('is a cool');
  });
});

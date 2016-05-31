import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass
} from 'react-addons-test-utils';
import {expect} from 'chai';
import WordScreen from '../../src/components/WordScreen';

describe('WordScreen', () => {
  it('renders first word and surrounding words correctly', () => {
    const component = renderIntoDocument(
      <WordScreen
        words={
          ['this', 'is', 'a', 'cool', 'and', 'radical', 'test', 'yeah']
        }
        wordIdx={0}
      />
    );
    const beforeDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-before');
    const focusDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-focus');
    const afterDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-after');

    expect(beforeDiv.textContent).to.equal('');
    expect(focusDiv.textContent).to.equal('this');
    expect(afterDiv.textContent).to.equal('is a cool');
  });
  it('renders middle word and surrounding words correctly', () => {
    const component = renderIntoDocument(
      <WordScreen
        words={
          ['this', 'is', 'a', 'cool', 'and', 'radical', 'test', 'yeah']
        }
        wordIdx={4}
      />
    );
    const beforeDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-before');
    const focusDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-focus');
    const afterDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-after');

    expect(beforeDiv.textContent).to.equal('is a cool');
    expect(focusDiv.textContent).to.equal('and');
    expect(afterDiv.textContent).to.equal('radical test yeah');
  });
  it('renders last word and surrounding words correctly', () => {
    const component = renderIntoDocument(
      <WordScreen
        words={
          ['this', 'is', 'a', 'cool', 'and', 'radical', 'test', 'yeah']
        }
        wordIdx={7}
      />
    );
    const beforeDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-before');
    const focusDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-focus');
    const afterDiv =
      findRenderedDOMComponentWithClass(component, 'word-screen-after');

    expect(beforeDiv.textContent).to.equal('and radical test');
    expect(focusDiv.textContent).to.equal('yeah');
    expect(afterDiv.textContent).to.equal('');
  });
});

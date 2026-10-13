import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Game from './Game';

jest.mock('axios');

describe('handleCheckButtonClick', () => {
    let getCookieValueMock, calcLevDistanceMock, correctAudioMock, incorrectAudioMock;

    beforeEach(() => {
        getCookieValueMock = jest.fn();
        calcLevDistanceMock = jest.fn();
        correctAudioMock = { play: jest.fn() };
        incorrectAudioMock = { play: jest.fn() };

        global.getCookieValue = getCookieValueMock;
        global.calcLevDistance = calcLevDistanceMock;
        global.correctAudio = correctAudioMock;
        global.incorrectAudio = incorrectAudioMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle correct answer', () => {
        getCookieValueMock.mockReturnValue('true');
        calcLevDistanceMock.mockReturnValue(0);

        const { getByLabelText, getByText } = render(<Game theme={{ theme: 'light' }} />);
        const input = getByLabelText('Answer');
        fireEvent.change(input, { target: { value: 'correct answer' } });

        const checkButton = getByText('Check');
        fireEvent.click(checkButton);

        expect(getCookieValueMock).toHaveBeenCalledWith('soundEffectsEnabled');
        expect(correctAudioMock.play).toHaveBeenCalled();
        expect(getByText('Correct, the sentence was:')).toBeInTheDocument();
    });

    test('should handle incorrect answer', () => {
        getCookieValueMock.mockReturnValue('true');
        calcLevDistanceMock.mockReturnValue(10);

        const { getByLabelText, getByText } = render(<Game theme={{ theme: 'light' }} />);
        const input = getByLabelText('Answer');
        fireEvent.change(input, { target: { value: 'incorrect answer' } });

        const checkButton = getByText('Check');
        fireEvent.click(checkButton);

        expect(getCookieValueMock).toHaveBeenCalledWith('soundEffectsEnabled');
        expect(incorrectAudioMock.play).toHaveBeenCalled();
        expect(getByText('Incorrect, the sentence was:')).toBeInTheDocument();
    });
});
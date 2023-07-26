// css
import './About.css'

export default function About() {
    return (
        <div id="about-container">
            <h1>About Lingua Audire</h1>
            <p>Lingua Audire was conceived after a futile search for better resources on improving language listening skills. Although simple, Lingua Audire presents an excellent resource
               for helping language learners from all over the world improve their listening (and writing) skills in a practical, useful, and fun way.
            </p>
            <h1>The Game</h1>
            <p>The game will give the player an audio clip in their target language, and the user will have to correctly type out what the speaker has said in the text box. 
               An incorrect answer will remove a heart, and once all lives are gone, the game is over and the user can decide if they would like to play again.
               Care has been taken to make the game as simple as possible, but to clear up any possible
               confusion, explanations on the game's features can be found below.
            </p>
            <ul>
                <li>
                    Check Button: Clicking this button will submit your answer and check to see if it is correct. If it is incorrect, the correct answer will be shown below the input
                    text field. Otherwise, you will be notified that your answer was correct. Note that punctuation and capitlization is NOT considered when checking your answer,
                    so one needs not worry about correctly placing commas, periods, etc.
                    <ul>
                        <li>
                            Next Button: After clicking the Check Button, it will be replaced by the Next Button. Clicking this button will then load the next audio clip.
                        </li>
                        <li>
                            Report Button: If the player finds that the audio clip provided was unsatisfactory (perhaps because of poor audio quality, a mistransliteration, or any 
                            other reason), this button can be clicked to report the clip for review.
                        </li>
                    </ul>
                </li>
                <li>
                    Hint Button: The Hint Button can be clicked just once for every audio clip. It will fix up to two incorrect words in your answer. However, if it only had to fix 1 or fewer
                    words in your answer, it will also provide you with the next word that you are missing.
                </li>
            </ul>
        </div>
    );
}
# Decision Maker
A tool that helps you make decisions! You enter your options, select and evaluate criteria, and see which one the tool picks. Made with Next.js and VS Code.

## How to Run
Open up madelyngh.github.io/decision-maker in your browser.

## How to Use
1. Enter in the what decision you're making (eg. "Which dog breed to get")
2. List your options (eg. "Golden Retriever," "Boston Terrier," "Siberian Husky")
3. List your criteria in priority order and whether they are positive or negative (eg. "Maintenance Level" - negative, "Personality Goodness" - positive, "Cuteness" - positive)
4. For each criteria, evaluate all the options on a scale from 0 to 10.
5. Finally, the tool will display the best option(s). You can also look at a breakdown of each option.

## The Algorithm (for the curious)
*Note: there is a possibility of there being bugs in the algorithm, idk; the following description is what the algorithm is supposed to be.*
First, it evaluates a numerical score for each option, where it adds the values of the positive criteria to the score and subtracts the values of the negative criteria from the score.
The option with the highest score is selected, UNLESS there is a tie, in which case, for all the options that were included in the tie: it goes through the criteria from highest to lowest priority until ONE of the options is the highest in that criteria (without there being a tie for that criteria); that option is selected.

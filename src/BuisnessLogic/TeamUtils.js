function splitArray(playersinGame, playersPerTeam) {
    if (!playersinGame || playersinGame.length == 0) { return }
    else {
        if (playersinGame.length <= playersPerTeam) {
            return [playersinGame];
        }

        return playersinGame.reduce((result, item) => {
            const lastSubArray = result[result.length - 1];

            if (lastSubArray.length < playersPerTeam) {
                lastSubArray.push(item);
            } else {
                result.push([item]);
            }

            return result;
        }, [[]]);
    }
}

function rearangeArray(playersinGame) {
    // return playersinGame.sort(() => Math.random() > .5 ? 1 : -1 )
    
    if (!playersinGame || playersinGame.length == 0) { return }
    else {
        let currentIndex = playersinGame.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [playersinGame[currentIndex], playersinGame[randomIndex]] = [
                playersinGame[randomIndex], playersinGame[currentIndex]];
        }
        return playersinGame;
    }
}

function setUnlockedExerciseIdsOnTeamCreation(totalExerciseIds) {
    if (!totalExerciseIds || totalExerciseIds.length == 0) { return }
    else {
        const totalExerciseIdsLength = totalExerciseIds.length;

        const percentage = 20;
        let percentItems = Math.round((percentage / 100) * totalExerciseIdsLength);

        if (percentItems === 0) {
            percentItems = 1;
        }

        const remainingExerciseIds = totalExerciseIds.slice(0, percentItems);

        return remainingExerciseIds
    }
}

function GuessWord(word, guessword) {
    const letterAndPosition = [];

    for (let i = 0; i < word.length; i++) {
        const letter = word[i];

        if (guessword.includes(letter)) {
            letterAndPosition.push({ position: i, letter: letter });
        }
    }

    return letterAndPosition;
}

module.exports = { splitArray, rearangeArray, setUnlockedExerciseIdsOnTeamCreation, GuessWord }
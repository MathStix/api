function splitArray(array, playersPerTeam) {
    if (array.length <= playersPerTeam) {
        return [array];
    }

    return array.reduce((result, item) => {
        const lastSubArray = result[result.length - 1];

        if (lastSubArray.length < playersPerTeam) {
            lastSubArray.push(item);
        } else {
            result.push([item]);
        }

        return result;
    }, [[]]);
}

function rearangeArray(playersinGame) {
    let currentIndex = playersinGame.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [playersinGame[currentIndex], playersinGame[randomIndex]] = [
            playersinGame[randomIndex], playersinGame[currentIndex]];
    }
    return playersinGame;
}

function setUnlockedExerciseIdsOnTeamCreation(totalExerciseIds) {
    const totalExerciseIdsLength = totalExerciseIds.length;

    const percentage = 20;
    const percentItems = Math.round((percentage / 100) * totalExerciseIdsLength);

    const remainingExerciseIds = totalExerciseIds.slice(0, percentItems);

    return remainingExerciseIds
}

module.exports = { splitArray, rearangeArray, setUnlockedExerciseIdsOnTeamCreation }
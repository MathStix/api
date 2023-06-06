function returnLetter(excludedNumbers, wordLength) {
    const randomNumber = Math.floor(Math.random() * wordLength) + 1;

    if (!excludedNumbers.includes(randomNumber)) {
        return randomNumber;
    } else {
        return null;
    }
}

function getLettersAndPosition(word, locations) {
    const letters = [];

    for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        const index = location - 1;

        if (index >= 0 && index < word.length) {
            const letter = word.charAt(index);
            letters.push({ letter: letter, position: index });
        } else {
            letters.push(null);
        }
    }

    return letters;
}

module.exports = { returnLetter, getLettersAndPosition }
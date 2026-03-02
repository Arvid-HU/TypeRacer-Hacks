// how fast the script types (in words per minute)
// keep below 100 to avoid triggering typeracer's anti-cheat verification
var wpm = 99.5
// convert wpm to milliseconds between each character
var msPerChar = (60 / wpm / 5) * 1000 
// prevents the script from running multiple times at once
var raceActive = false

function initRace() {
    if (raceActive) return
    var element = document.getElementsByClassName('inputPanel')[0]
    if (!element) return
    var textElements = element.getElementsByTagName('span')
    var text = ''
    for (var i = 0; i < textElements.length; i++) {
        text += textElements[i].innerText
    }
    if (!text) return
    var counter = 0
    var input = document.getElementsByClassName('txtInput')[0]
    if (!input) return
    raceActive = true
    // lets us set the input value programmatically in a way typeracer accepts
    var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set

    // wait for the user to press backspace to start auto-typing
    document.addEventListener('keydown', function start(e) {
        if (e.key === 'Backspace') {
            document.removeEventListener('keydown', start)
            console.log('Auto type hack started!')
            // type one character every few milliseconds based on the wpm setting
            var interval = setInterval(function () {
                if (counter < text.length) {
                    // add the next correct character and tell typeracer the input changed
                    nativeSetter.call(input, input.value + text[counter])
                    input.dispatchEvent(new Event('input', { bubbles: true }))
                    counter++
                } else {
                    // done typing, stop the loop
                    clearInterval(interval)
                    raceActive = false
                }
            }, msPerChar)
        }
    })
}

// start looking for a race as soon as the script loads
initRace()

// automatically detect when a new race starts so we don't have to re-run the script
var observer = new MutationObserver(function () {
    var input = document.getElementsByClassName('txtInput')[0]
    if (input && input.value === '') {
        initRace()
    }
})
observer.observe(document.body, { childList: true, subtree: true })
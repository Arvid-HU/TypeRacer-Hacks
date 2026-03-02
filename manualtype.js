// how to use: press any letter, then press backspace.
// after that, every key you press will type the next correct character for you.

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
    var input = document.getElementsByClassName('txtInput')[0]
    if (!input) return
    raceActive = true
    var counter = 0
    // lets us set the input value programmatically in a way typeracer accepts
    var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set

    // wait for the user to press backspace to activate the hack
    document.addEventListener('keydown', function start(e) {
        if (e.key === 'Backspace') {
            document.removeEventListener('keydown', start)
            document.addEventListener('keyup', function waitUp(e) {
                if (e.key === 'Backspace') {
                    document.removeEventListener('keyup', waitUp)
                    console.log('Manual type hack started!')

                    // every keypress: block the real key and type the next correct character instead
                    function onKeyDown(e) {
                        e.preventDefault()
                        e.stopImmediatePropagation()
                        if (e.repeat) return // ignore held-down keys
                        if (counter < text.length) {
                            // add the next correct character and tell typeracer the input changed
                            nativeSetter.call(input, input.value + text[counter])
                            input.dispatchEvent(new Event('input', { bubbles: true }))
                            counter++
                        } else {
                            // done typing, clean up all listeners
                            input.removeEventListener('keydown', onKeyDown)
                            input.removeEventListener('keypress', block)
                            input.removeEventListener('beforeinput', block)
                            raceActive = false
                        }
                    }
                    // block the real keystroke from reaching the input box
                    function block(e) {
                        e.preventDefault()
                        e.stopImmediatePropagation()
                    }
                    input.addEventListener('keydown', onKeyDown, true)
                    input.addEventListener('keypress', block, true)
                    input.addEventListener('beforeinput', block, true)
                }
            })
        }
    })
}

// start looking for a race as soon as the script loads
initRace()

// automatically detect when a new race starts so you don't have to re-run the script
var observer = new MutationObserver(function () {
    var input = document.getElementsByClassName('txtInput')[0]
    if (input && input.value === '') {
        raceActive = false
        initRace()
    }
})
observer.observe(document.body, { childList: true, subtree: true })
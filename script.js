"use strict";

const btns = document.querySelectorAll('.btn');
const piano = document.querySelector('.piano');
const pianoKeys = document.querySelectorAll('.piano-key');
const btnFullscreen = document.querySelector('.fullscreen');

function hideNotesLetters() {
    piano.classList.remove('piano-letters', 'piano-notes');
    btns.forEach(i =>{
        i.classList.remove('btn-active');
    });
}

function showNotesLetters(elem = btns[0]) {
    elem.classList.add('btn-active');
    if(elem == btns[0]){
        piano.classList.add('piano-notes');
    } else {
        piano.classList.add('piano-letters');
    }
}

hideNotesLetters();
showNotesLetters();

btns.forEach(item => {
    item.addEventListener('click', (e) => {
        const target = e.target;
        hideNotesLetters();
        showNotesLetters(target);
    });
});

btnFullscreen.addEventListener('click',() => {
    if (!document.fullscreenElement){
        document.documentElement.requestFullscreen();
        document.exitFullscreen();
    } else {
        document.exitFullscreen();
    }
});

function playAudio(src) {
    const audio = new Audio();
    audio.src = src;
    audio.currentTime = 0;
    audio.play();
}

function addTransformKey(elem){
    elem.classList.add('piano-key-active');
}

function removeTransformKey(elem){
    elem.classList.remove('piano-key-active');
}

function mouseMove(){

    function mouseOutOfKey(elem) {
        if(elem.classList.contains('piano-key')) {
            removeTransformKey(elem);
        }
    }

    function searchNote(elem){
        const note = elem.dataset.note;
        return `assets/audio/${note}.mp3`;
    }

    let count = false;

    window.addEventListener('mouseup', (e) => {
        count = false;
        mouseOutOfKey(e.target);
    });

    function addPianoListener(eventName){
        piano.addEventListener(eventName, (e) => {
            const target = e.target;

            if(eventName === 'mouseout'){
                mouseOutOfKey(target);
            }

            if(eventName === 'mousedown'){
                count = true;
                const src =searchNote(target);
                addTransformKey(target);
                playAudio(src);
            }

            if(target.classList.contains('piano-key')) {
                if(eventName === 'mousedown'){
                    count = true;
                    const src =searchNote(target);
                    addTransformKey(target);
                    playAudio(src);
                }

                if(eventName === 'mouseover' && count == true){
                    const src =searchNote(target);
                    addTransformKey(target);
                    playAudio(src);
                }
            }   
        });
    }
    addPianoListener('mousedown');
    addPianoListener('mouseover');
    addPianoListener('mouseout');
}

mouseMove(piano);


function pressKey(){ 
    let pressedArr = [];

    function addKeyListener(elem){
        window.addEventListener(elem, (e) => {
            const letter = e.code[e.code.length-1];
            const audio = document.querySelector(`audio[data-letter="${letter}"]`);
            if(!audio) return;
            const key = document.querySelector(`div[data-letter="${letter}"]`);
            
            if(elem === 'keydown'){
                if(pressedArr.includes(key)) return;
                const note = key.dataset.note;
                const src = `assets/audio/${note}.mp3`;
                pressedArr.push(key);
                addTransformKey(key);
                playAudio(src);
            }
    
            if(elem === 'keyup'){
                pressedArr = pressedArr.filter(item => item !== key);
                removeTransformKey(key);
            }
        });
    }
    addKeyListener('keydown');
    addKeyListener('keyup');
}

pressKey();


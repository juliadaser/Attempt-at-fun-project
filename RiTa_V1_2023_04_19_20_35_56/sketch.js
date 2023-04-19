/* 

RiTa Phones contains:
  aa, ae, ah, ao, aw, ay, b, ch, d, dh
  eh, er, ey, f, g, hh, ih, iy, ih, k, l, m
  n, ng, ow, oy, p, r, s, sh, t, th
  uh, uw, v, w, y, z, zh

Mouth Pictures contain:
  AEI, BMP, CDN ST XYZ, CH J SH, Ee, FV, GK, L, O, QW, U

Assignment of RiTa Phones to Mouth Images:
  AEI = aa, ah, aw, ae, eh
  BMP = b, m, p
  CDN ST XYZ = d, dh, er, hh, n, s, t, th, z, zh
  CH J SH = ch, ng, sh
  Ee = ay, ey, ih, iy, 
  FV = f, v
  GK = g, k, r
  L = l
  O = ao, ow, oy
  QW = w
  U = uh, uw

*/

// BASE
let head;
let body;
let eyes;

// Variables for mouth pictures
let aei;
let bmp;
let cdnstxyz;
let chjsh;
let ee;
let fv;
let gk;
let l;
let o;
let qw;
let u;

let smile;
let current_mouth;

// Variables for blinking of eye
let durtionOfBlink = 200;
let length = 2000;
let lastBlink = 0;

// Storing User's text input
let txt;

// Phonetic reading
let speechSynth = window.speechSynthesis;

// Variables for transforming the RiTa response to useful format
let output; // Rhiming words
let phoneticText; // Phonetic Prononciation of each rhiming word
let newWords; // separating them at "-" and " "
let phoneticList = []; // final list of each phonetic pronon. of each word

// for title text
let font;

function setup() {
  // responsiveness of website/ canvas
  createCanvas(windowWidth, windowHeight);

  // CREATING textinput and button 
  // text input setup
  input = createInput();
  input.position(windowWidth / 2, windowHeight / 2 + 50);
  input.size(300, 100);
  input.center("horizontal");
  input.style('font-size', '20px');
  input.style("font-family", "Courier");
  input.style('text-align', 'center');
  input.style('background-color', "#f3e0bc")

  //button setup
  button = createButton("submit");
  button.position(windowWidth / 2, windowHeight / 2 + 150);
  button.mousePressed(updateText);
  button.style("font-family", "Courier");
  button.size(100, 30);
  button.center("horizontal");
  button.style('background-color', "#b28f52");
  button.style('font-size', '20px');
}

function preload() {
  // BASE of the monster's face
  head = loadImage("Creature/Head.png");
  body = loadImage("Creature/Body.png");
  eyes = loadImage("Creature/Eyes.png");

  // MOUTH IMAGES of monster
  aei = loadImage("Creature/AEI.png");
  bmp = loadImage("Creature/BMP.png");
  cdnstxyz = loadImage("Creature/CDNSTXYZ.png");
  chjsh = loadImage("Creature/CH J SH.png");
  ee = loadImage("Creature/Ee.png");
  fv = loadImage("Creature/FV.png");
  gk = loadImage("Creature/GK.png");
  l = loadImage("Creature/L.png");
  o = loadImage("Creature/O.png");
  qw = loadImage("Creature/QW.png");
  u = loadImage("Creature/U.png");
  // general expression
  smile = loadImage("Creature/smile.png");

  // FONT for title
  font = loadFont('Selfish-Bold.otf');
}

let sceneNum = 0;

function draw() {
  // setting up font
  textFont(font);
  textSize(500);
  textAlign(CENTER);

  // HEAD SHIFT variables needed to make the images of monster responsive
  let head_x = -10 + mouseX / 20;
  let head_y = -10 + mouseY / 20;
  let shift_in_y = height - (body.height * width) / body.width;
  let scaled_height = (body.height * width) / body.width;

  switch (sceneNum) {
    case 0:
      word_input_background(); // create background 1
      break;

    case 1:
      // hide the button and text field
      button.hide()
      input.hide()

      monster_background(); // create background 2
      // making the monster talk: mouths and sound
      if (let_go && index < phoneticList.length) {
        speak_words();
        image(current_mouth, head_x, head_y + shift_in_y, width, scaled_height);
      }

      // making the monster smile when speaking is over
      if (index >= phoneticList.length) {
        during_speech = false;
      }

      break;
  }
}

let let_go = false; // variable to make speaking only go once
let during_speech = true; // identify which phase monster is in

function updateText() {
  txt = input.value();
  generateWords();
  sceneNum++;
}

function generateWords() {

  let Wordlist = split(txt, " ");
  let RhimedWords = []; // empty list created to add all rhimed words

  for (let i = 0; i < Wordlist.length; i++) {
    let word = RiTa.rhymes(Wordlist[i])[0];
    if (word != undefined) {
      RhimedWords.push(word);
    }
  }

  output = join(RhimedWords, " "); // all words in one string
  phoneticText = RiTa.phones(output); // all word's phonetic prononciation

  print("search word:", txt);
  print("Rhiming words:   " + output);
  print("Phonetic translation:   " + phoneticText);

  splitWords = phoneticText.split(" "); // split at spaces

  for (let i = 0; i < splitWords.length; i++) {
    let syllables = splitWords[i].split("-"); // split at dashes
    phoneticList = phoneticList.concat(syllables); // add to result array
  }

  print("Phonetic syllables list:   " + phoneticList);

  currentTime = millis();
  let_go = true;
}

// variables for making the sounds spaced out
let index = 0;
let currentTime;

function speak_words() {
  // each list item at a time - each sound and mouth at a time
  if (millis() > currentTime + 500 * index) {
    print("one second passed - " + index);
    print("current phonetic - " + phoneticList[index]);

    let XX = phoneticList[index];

    // change images - using previously assigned groups from RiTa to mouths
    if (XX == "aa" || XX == "ah" || XX == "aw" || XX == "ae" || XX == "eh") {
      current_mouth = aei;
      print("aei");
    }
    if (XX == "b" || XX == "m" || XX == "p") {
      current_mouth = bmp;
      print("bmp");
    }
    if (
      XX == "d" ||
      XX == "dh" ||
      XX == "er" ||
      XX == "hh" ||
      XX == "n" ||
      XX == "s" ||
      XX == "t" ||
      XX == "th" ||
      XX == "z" ||
      XX == "zh"
    ) {
      current_mouth = cdnstxyz;
      print("cdnstxyz");
    }
    if (XX == "ch" || XX == "ng" || XX == "sh") {
      current_mouth = chjsh;
      print("chjsh");
    }
    if (XX == "ay" || XX == "ey" || XX == "ih" || XX == "iy") {
      current_mouth = ee;
      print("ee");
    }
    if (XX == "f" || XX == "v") {
      current_mouth = fv;
      print("fv");
    }
    if (XX == "g" || XX == "k" || XX == "r") {
      current_mouth = gk;
      print("gk");
    }
    if (XX == "l") {
      current_mouth = l;
      print("l");
    }
    if (XX == "ao" || XX == "ow" || XX == "oy") {
      current_mouth = o;
      print("o");
    }
    if (XX == "w") {
      current_mouth = qw;
      print("qw");
    }
    if (XX == "uh" || XX == "uw") {
      current_mouth = u;
      print("u");
    }

    // make monster speak
    let speech = new SpeechSynthesisUtterance(phoneticList[index]);
    speechSynth.speak(speech);

    index++;
  }
}

function monster_background() {

  // HEAD SHIFT
  let head_x = -10 + mouseX / 20;
  let head_y = -10 + mouseY / 20;

  let shift_in_y = height - (body.height * width) / body.width;
  let scaled_height = (body.height * width) / body.width;

  background(10);

  // LABEL
  fill("#7c6236");
  text('Shit Out', width / 2, height / 2);

  // making the image responsive to the screen size (using CHAT GPT (see bottom of code))
  image(body, 0, shift_in_y, width, scaled_height);
  image(head, head_x, head_y + shift_in_y, width, scaled_height);

  if (millis() - lastBlink > length) {
    // eyes are closed
    if (millis() - lastBlink > length + durtionOfBlink) {
      lastBlink = millis();

      // randomizing values to create some changes in blinking
      durtionOfBlink = random(100, 300);
      length = random(1000, 2500);
    }
  } else {
    // eyes are opened
    image(eyes, head_x, head_y + shift_in_y, width, scaled_height);
  }
  if (!during_speech) {
    image(smile, head_x, head_y + shift_in_y, width, scaled_height);
  }
}

function word_input_background() {
  background(10);
  fill("#b28f52");
  text('Shit In', width / 2, height / 2 + 90);
}

// making window resizable during experience
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


const stats = document.querySelectorAll('.stats input');
const buttons = document.querySelectorAll('.buttons button');
const reviveBtn = document.querySelector('#revive');

const animal = document.querySelector('.animal img');

let pressTimer;
let changeIcon;

const statistics = {
	hunger: parseFloat(document.querySelector('#hunger').value),
	health: parseFloat(document.querySelector('#health').value),
	happiness: parseFloat(document.querySelector('#happiness').value)
};

function takeCare (e) {
	pressTimer = setInterval(function() {
		stats.forEach(stat => {
			target = e.target;
			if (stat.dataset.need === target.dataset.need){
				stat.value++;
			}
			if (target.dataset.need === 'eat'){
				animal.src = "img/eat.png";
			}
			if (target.dataset.need === 'cure'){
				console.log('what');
				animal.src = "img/shower.png";
			}
			if (target.dataset.need === 'pet'){
				animal.src = "img/laughing.png";
			}
		});
	}, 150)
	checkMood();
}

const waitingIcons = ['hello', 'cool', 'music', 'selfie'];

const needs = [];

let ded = false;

function defaultState () {
		stats.forEach(stat => {
			if (needs.includes(stat)) needs.splice(needs.indexOf(stat), 1);
		});	
		if (ded) return;
		let miliseconds = Math.floor((Math.random() * (6 - 5) + 5) * 1000);
		changeIcon = setInterval(function(){
			let i = Math.floor(Math.random() * (waitingIcons.length - 0));
			let icon = waitingIcons[i];
			animal.src = `img/${icon}.png`;
		}, miliseconds);
		animal.src = "img/hello.png";
}

function checkMood() {
	stats.forEach(stat => {
		if (stat.value < 30) {
			animal.removeEventListener('mousedown', clicked);
			if (needs.includes(stat)) return;
			needs.push(stat);

			needs.forEach(need => {
				console.log(need.dataset.need, need.value);
				if (need.dataset.need === 'eat'){
					animal.src = "img/sad.png";
				}
				if (need.dataset.need === 'cure'){
					animal.src = "img/sick.png";
				}
				if (need.dataset.need === 'pet'){
					animal.src = "img/cry.png";
				}
			})
		}

		// if (stat.value > 30) {
		// 	decreaseStats();
		// }
	})
}

function decreaseStats () {
	reviveBtn.style.display = "none";
	// defaultState();
	let called = setInterval (() => {
		stats.forEach(stat => {
			stat.value--;
			checkMood();	
			console.log(stat.value);
			if (stat.value == 0) {
				console.log('death...');
				death();
				clearInterval(called);
				return;
			}
		});
	}, 1000);
}


function death() {
	document.removeEventListener('mouseup', stop);
	animal.removeEventListener('mousedown', clicked);
	clearInterval(changeIcon);
	buttons.forEach(button => {
		button.disable = true;
		button.removeEventListener('mousedown', takeCare)
	})
	console.log('DEATH!');
	animal.src = "img/cry.png";
	reviveBtn.style.display = "block";
	reviveBtn.addEventListener('click', revive);
	ded = true;
}

function revive () {
	stats.forEach(stat => stat.value = 50);
	ded = false;
	decreaseStats();
}

function clicked (e) {
	animal.src = "img/happy.png";
};

function stop(){
	clearTimeout(pressTimer);
	decreaseStats();
};

buttons.forEach(button => button.addEventListener('mousedown', takeCare));
document.addEventListener('mouseup', stop);
window.addEventListener('load', decreaseStats);
window.addEventListener('load', defaultState);
animal.addEventListener('mousedown', clicked);

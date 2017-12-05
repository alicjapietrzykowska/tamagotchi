const stats = document.querySelectorAll('.stats input');
const buttons = document.querySelectorAll('.buttons button');
const reviveBtn = document.querySelector('#revive');

const animal = document.querySelector('.animal img');

//variables for intervals
let pressTimer;
let changeIcon;
let called;

//flags
let press = false;
let ded = false;
let sad = false;

const waitingIcons = ['hello', 'cool', 'music', 'selfie'];

const statistics = {
	eat: parseFloat(document.querySelector('#eat').value),
	cure: parseFloat(document.querySelector('#cure').value),
	pet: parseFloat(document.querySelector('#pet').value)
};

function takeCare (e) {
	clearInterval(changeIcon);
	press = true;
	pressTimer = setInterval(function() {
			Object.entries(statistics).forEach(stat => {
			target = e.target;
			const name = stat[0];
			let value = stat[1];
			if (name === target.dataset.need){
				value++;
				statistics[name] = value;
				document.getElementById(`${name}`).value = value;

				switch(name){
					case 'eat':
						animal.src = "img/eat.png";
						break;
					case 'cure':
						animal.src = "img/shower.png";
						break;
					case 'pet':
						animal.src = "img/laughing.png";
						break;
					default:
						defaultMood();
				}
			}
		});
	}, 100);
}

function stop(){
	press = false;
	clearInterval(pressTimer);
	clearInterval(changeIcon);
	defaultMood();
};

function defaultMood () {
	if (ded || sad) return;
	animal.addEventListener('mousedown', clicked);
	if (!press){
		let miliseconds = Math.floor((Math.random() * (30 - 5) + 5) * 1000);
		changeIcon = setInterval(function(){
			let i = Math.floor(Math.random() * (waitingIcons.length - 0));
			let icon = waitingIcons[i];
			animal.src = `img/${icon}.png`;
		}, miliseconds);
		animal.src = "img/hello.png";
	}
}

function checkMood() {
	if (press) return;
	let arr = Object.values(statistics);
	let min = Math.min(...arr);
	Object.entries(statistics).forEach(stat => {
		const name = stat[0];
		let value = stat[1];
		if (value == 0) {
			death();
			return;
		};
		if (value < 30){
			sad = true;	
			clearInterval(changeIcon);
			animal.removeEventListener('mousedown', clicked);
			if (value == min && name === 'eat'){
				animal.src = "img/hungry.png";
			}
			if (value == min && name === 'cure'){
				animal.src = "img/sick.png";
			}
			if (value == min && name === 'pet'){
				animal.src = "img/cry.png";
			}
		} else {
			sad = false;
		}
	});
}


function decreaseStats () {
	reviveBtn.style.display = "none";
	called = setInterval (() => {
		Object.entries(statistics).forEach(stat => {
			const name = stat[0];
			let value = stat[1];
			value--;
			statistics[name] = value;
			document.getElementById(`${name}`).value = value;
			checkMood();
		});
	}, 1000);
	// },100);
}


function death() {
	document.removeEventListener('mouseup', stop);
	animal.removeEventListener('mousedown', clicked);
	clearInterval(called);
	clearInterval(changeIcon);
	clearInterval(pressTimer);
	buttons.forEach(button => {
		button.disable = true;
		button.removeEventListener('mousedown', takeCare);
	});
	animal.src = "img/dead.png";
	reviveBtn.style.display = "block";
	reviveBtn.addEventListener('click', revive);
	ded = true;
}

function revive () {
	ded = false;
	sad = false;
	document.addEventListener('mouseup', stop);
	animal.addEventListener('mousedown', clicked);
	buttons.forEach(button => {
		button.disable = false;
		button.addEventListener('mousedown', takeCare)
	});	
	for(var key in statistics) {statistics[key] = 50};
	defaultMood();
	decreaseStats();
}

function clicked () {
	animal.src = "img/happy.png";
};

buttons.forEach(button => button.addEventListener('mousedown', takeCare));
document.addEventListener('mouseup', stop);
window.addEventListener('load', decreaseStats);
window.addEventListener('load', defaultMood);

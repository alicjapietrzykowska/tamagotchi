const stats = document.querySelectorAll('.stats input');
const buttons = document.querySelectorAll('.buttons button');
const reviveBtn = document.querySelector('#revive');

const animal = document.querySelector('.animal img');

let pressTimer;
let changeIcon;
let called;
let flag = false;

const statistics = {
	eat: parseFloat(document.querySelector('#eat').value),
	cure: parseFloat(document.querySelector('#cure').value),
	pet: parseFloat(document.querySelector('#pet').value)
};

function takeCare (e) {
	clearInterval(changeIcon);
	flag = true;
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
						defaultState();
				}
			}
		});
	}, 100);
}


const waitingIcons = ['hello', 'cool', 'music', 'selfie'];

let ded = false;
let sad = false;

function defaultState () {
		if (ded || sad) return;
		if (!flag){
			let miliseconds = Math.floor((Math.random() * (6 - 5) + 5) * 1000);
			changeIcon = setInterval(function(){
				let i = Math.floor(Math.random() * (waitingIcons.length - 0));
				let icon = waitingIcons[i];
				animal.src = `img/${icon}.png`;
			}, miliseconds);
			animal.src = "img/hello.png";
		}
}


function checkMood() {
	clearInterval(changeIcon);
	let arr = Object.values(statistics);
	let min = Math.min(...arr);
	if (flag) return;

	Object.entries(statistics).forEach(stat => {
		const name = stat[0];
		let value = stat[1];

		console.log(value);

		if (value == 0) {
			death();
			return;
		}

		if (value < 30){
			sad = true;
			if (value == min && name === 'eat'){
				animal.src = "img/sad.png";
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
	}, 100);
}


function death() {
	document.removeEventListener('mouseup', stop);
	animal.removeEventListener('mousedown', clicked);
	clearInterval(called);
	clearInterval(changeIcon);
	clearInterval(pressTimer);
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

function clicked () {
	animal.src = "img/happy.png";
};

function stop(){
	flag = false;
	clearTimeout(pressTimer);
	clearInterval(changeIcon);
	defaultState();
};

buttons.forEach(button => button.addEventListener('mousedown', takeCare));
document.addEventListener('mouseup', stop);
window.addEventListener('load', decreaseStats);
// window.addEventListener('load', defaultState);
animal.addEventListener('mousedown', clicked);

const stats = document.querySelectorAll('.stats input');
const buttons = document.querySelectorAll('.buttons button');
const reviveBtn = document.querySelector('#revive');

const animal = document.querySelector('.animal img');

let pressTimer;

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
				animal.src = "img/shower.png";
			}
			if (target.dataset.need === 'pet'){
				animal.src = "img/laughing.png";
			}
		});
	}, 150)
	checkMood();
}

const waitingIcons = ['cool', 'music', 'selfie'];

const needs = [];

function checkMood() {
	stats.forEach(stat => {
		if (stat.value < 30) {
			animal.removeEventListener('mousedown', clicked);
			if (needs.includes(stat)) return;
			needs.push(stat);
			console.log(needs);

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

		if (stat.value > 30) {
			if (needs.includes(stat)) needs.splice(needs.indexOf(stat), 1);
			console.log(needs);
		}
	})
}

function decreaseStats () {
	reviveBtn.style.display = "none";
	let called = setInterval (() => {
		stats.forEach(stat => {
			stat.value--;
			checkMood();	
			if (stat.value == 0) {
				death();
				clearInterval(called);
				return;
			}
		});
	}, 600);
}


function death () {
	buttons.forEach(button => {
		button.disable = true;
	})
	console.log('DEATH!');
	reviveBtn.style.display = "block";
	reviveBtn.addEventListener('click', revive);
}

function revive () {
	stats.forEach(stat => stat.value = 50);
	decreaseStats();
}

function clicked (e) {
	animal.src = "img/happy.png"
};


buttons.forEach(button => button.addEventListener('mousedown', takeCare));
document.addEventListener('mouseup', () => clearTimeout(pressTimer));
window.addEventListener('load', decreaseStats);
animal.addEventListener('mousedown', clicked);

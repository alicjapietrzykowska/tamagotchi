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
}

const waitingIcons = ['cool', 'music', 'selfie'];

const needs = [];

function checkMood() {
	stats.forEach(stat => {
		if (stat.value < 30) {
			animal.removeEventListener('mousedown', clicked);
			if (needs.includes(stat.dataset.need)) return;
			needs.push(stat.dataset.need);
			console.log(needs);
				


			// if (needs.includes("cure")) 
			// 	{animal.src = "img/sick.png"}; 
			// if (needs.includes("eat")) 
			// 	{animal.src = "img/sad.png"};
			// if (needs.includes("pet")) 
			// 	{animal.src = "img/cry.png"};
		// } else if (stat.value > 31) {
		// 	animal.src = "img/hello.png";
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
	}, 300);
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

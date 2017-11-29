const stats = document.querySelectorAll('.stats input');
const buttons = document.querySelectorAll('.buttons button');
const reviveBtn = document.querySelector('#revive');

const animal = document.querySelector('.animal img');

function takeCare () {
	stats.forEach(stat => {
		if (stat.dataset.need === this.dataset.need){
			stat.value++;
		}
		if (this.dataset.need === 'eat'){
			animal.src = "img/eat.png";
		}
		if (this.dataset.need === 'cure'){
			animal.src = "img/shower.png";
		}
		if (this.dataset.need === 'pet'){
			animal.src = "img/laughing.png";
		}
	});
}

function leaveCare () {
	animal.src = "img/hello.png";
}

function decreaseStats () {
	reviveBtn.style.display = "none";
	let called = setInterval (() => {
		stats.forEach(stat => {
			stat.value--;	
			if (stat.value == 0) {
				death();
				clearInterval(called);
				return;
			}
		});
	}, 60000);
}


function death () {
	console.log('DEATH!');
	reviveBtn.style.display = "block";
	reviveBtn.addEventListener('click', revive);
}

function revive () {
	stats.forEach(stat => stat.value = 50);
	decreaseStats();
}


buttons.forEach(button => button.addEventListener('mousedown', takeCare));
buttons.forEach(button => button.addEventListener('mouseup', leaveCare));
window.addEventListener('load', decreaseStats);

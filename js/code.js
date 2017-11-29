const stats = document.querySelectorAll('.stats input');
const buttons = document.querySelectorAll('.buttons button');
const reviveBtn = document.querySelector('#revive');

function takeCare () {
	stats.forEach(stat => {
		if (stat.dataset.need === this.dataset.need){
			stat.value++;
		}
	});
}

function decreaseStats () {
	reviveBtn.style.display = "none";
	let called = setInterval (() => {
		stats.forEach(stat => {
			stat.value--;	
			console.log(stat.value);
			if (stat.value < 10) {

			}
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


buttons.forEach(button => button.addEventListener('click', takeCare));
window.addEventListener('load', decreaseStats);

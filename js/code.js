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
let notify = false;

//icons in default state
const waitingIcons = ['hello', 'cool', 'music', 'selfie'];

const statistics = {
	eat: parseFloat(document.querySelector('#eat').value),
	cure: parseFloat(document.querySelector('#cure').value),
	pet: parseFloat(document.querySelector('#pet').value)
};

//increase range value when user push button 
function takeCare (e) {
	clearInterval(changeIcon);
	press = true;
	notify = false;
	//repeat function as long as user hold the button
	pressTimer = setInterval(function() {
			Object.entries(statistics).forEach(stat => {
				//check which button was clicked
				target = e.target;
				//separete object entries
				const name = stat[0];
				let value = stat[1];
				//find stat of pushed button
				if (name === target.dataset.need){
					//increase value
					value++;
					statistics[name] = value;
					//show current value in DOM
					document.getElementById(`${name}`).value = value;
					//change icon depending on the stat
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

//reset state when user released button
function stop(){
	press = false;
	clearInterval(pressTimer);
	clearInterval(changeIcon);
	defaultMood();
};

//reset icon when user isn't doing anything
function defaultMood () {
	if (ded || sad) return;
	animal.addEventListener('mousedown', clicked);
	if (!press){
		//draw random miliseconds to show random icons
		let miliseconds = Math.floor((Math.random() * (60 - 5) + 5) * 1000);
		changeIcon = setInterval(function(){
			let i = Math.floor(Math.random() * (waitingIcons.length - 0));
			let icon = waitingIcons[i];
			animal.src = `img/${icon}.png`;
		}, miliseconds);
		animal.src = "img/hello.png";
	}
}
//check if animal isn't neglected
function checkMood() {
	if (press) return;
	//find smallest value of statistics
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
				if (Notification.permission === "granted" && !(notify)) showNotification(name);
			}
			if (value == min && name === 'cure'){
				animal.src = "img/sick.png";
				if (Notification.permission === "granted" && !(notify)) showNotification(name);
			}
			if (value == min && name === 'pet'){
				animal.src = "img/cry.png";
				if (Notification.permission === "granted"  && !(notify)) showNotification(name);
			}
		} else {
			sad = false;
		}
	});
}

//default function, decrease stats in time
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
	}, 10000);
}

//turn of the game
function death() {
	ded = true;
	notify = false;
	//turn off event listeners
	document.removeEventListener('mouseup', stop);
	animal.removeEventListener('mousedown', clicked);
	clearInterval(called);
	clearInterval(changeIcon);
	clearInterval(pressTimer);
	buttons.forEach(button => {
		button.disable = true;
		button.removeEventListener('mousedown', takeCare);
	});
	//change icon
	animal.src = "img/dead.png";
	//show revive button
	reviveBtn.style.display = "block";
	reviveBtn.addEventListener('click', revive);
}

//turn on the game after deah
function revive () {
	ded = false;
	sad = false;
	//turn on event listeners after death
	document.addEventListener('mouseup', stop);
	animal.addEventListener('mousedown', clicked);
	buttons.forEach(button => {
		button.disable = false;
		button.addEventListener('mousedown', takeCare)
	});	
	//increase stats to default state
	for(var key in statistics) {
		statistics[key] = 50; 
		document.getElementById(`${key}`).value = statistics[key];
	};
	//run default functions
	defaultMood();
	decreaseStats();
}

//change icon when animal clicked
function clicked () {
	animal.src = "img/happy.png";
};

//run Notification
function showNotification(need){
	let notification;
	let options;
    switch (need){
    	case 'eat':
    		options = {
			    body: 'Let me eat!',
			    icon: 'img/hungry.png',
			}
    		notification = new Notification('Tamagotchi says', options);
    		notify = true;
    		break;
    	case 'cure':
    	    options = {
			    body: 'I have fever!',
			    icon: 'img/sick.png',
			}
    		notification = new Notification('Tamagotchi says', options);
    		notify = true;
    		break;
    	case 'pet':
      	    options = {
			    body: 'Play with me!',
			    icon: 'img/cry.png',
			}
    		notification = new Notification('Tamagotchi says', options);
    		notify = true;
    		break;
    	default:
    		notification = new Notification('Take care of me!');
    		notify = true;
    }
}


buttons.forEach(button => button.addEventListener('mousedown', takeCare));
document.addEventListener('mouseup', stop);
window.addEventListener('load', decreaseStats);
window.addEventListener('load', defaultMood);
window.addEventListener('load', () => Notification.requestPermission());

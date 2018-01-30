# Tamagotchi

Application simulates popular 90’s toy. Feed, cure and play with your animal to prevent it from death. 
Application works pretty well on mobile devices.

## Technology:

Application is written in Vanilla JS. It includes plugin touch-emulator.js which listens to the `mousedown`, `mousemove` and `mouseup` events, and translates them to touch events on mobile devices. 

CSS for it is made by SCSS, compiled by Gulp with plugin Gulp-Sass. 

## How it works:
Animal regularly loses one point of all its statistics. In the meantime animal randomly changes its icon.
(For presentation purpose statistics decrease 1 for every second, but ultimately it will be 1 for every 10 seconds)

User can increase statistics by holding a corresponding button. Maximum value is 100. 

If any statistics value drops to 30, animal gets sad and changes its icon to show what need it is lacking. Application also report it by the notification. 

If any statistics value drops to 0, animal dies and all interval functions stop. User also can’t use any button to increase value anymore. 
User can reset game by clicking a “Revive” button. 


### Potential future features:
* Mobile application
* Option to change animal’s look
* Option to give animal a name
* More options to increase statistics (more types of food and plays)

class Game {
	constructor() {
		this.svg = document.getElementById('game')
		this.loop = this.loop.bind(this)
		requestAnimationFrame(this.loop)
	}

	loop() {
		// Пока ничего не делаем
		requestAnimationFrame(this.loop)
	}
}

const game = new Game()

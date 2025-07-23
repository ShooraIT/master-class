class Game {
	constructor() {
		this.svg = document.getElementById('game')
		this.toastSymbolId = '#toast'
		this.scoreEl = document.getElementById('score')
		this.livesEl = document.getElementById('lives')
		this.finalScoreInfoEl = document.getElementById('final-score-info')
		this.gameOverScreenEl = document.getElementById('game-over-screen')
		this.toasts = []
		this.score = 0
		this.spawnInterval = 2000
		this.remainingLives = 5
		this.gameOver = false
		this.gameStartTime = performance.now()

		this.loop = this.loop.bind(this)
		this.spawnToast()
		this.startSpawnTimer()
		this.updateLives()
		requestAnimationFrame(this.loop)
	}

}


const game = new Game()

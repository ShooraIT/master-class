spawnToast() {
	const startX = Math.random() * 350 + 25

	const toast = document.createElementNS('http://www.w3.org/2000/svg', 'use')
	toast.setAttribute('href', '#toast')
	toast.setAttribute('class', 'toast')
	toast.setAttribute('x', startX)
	toast.setAttribute('y', 680)
	this.svg.appendChild(toast)
}

constructor() {
	this.svg = document.getElementById('game')
	this.loop = this.loop.bind(this)
	this.spawnToast() // <--- новое
	requestAnimationFrame(this.loop)
}

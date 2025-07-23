class Game {
	constructor() {
		this.svg = document.getElementById('game')
		this.toastSymbolId = '#toast'
		this.toasts = []
		this.loop = this.loop.bind(this)
		this.spawnToast()
		requestAnimationFrame(this.loop)
	}
			

	spawnToast() {
		const startX = Math.random() * 350 + 25
		const endX = Math.random() * 350 + 25
		const peakY = 200 + Math.random() * 50

		const toast = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		toast.setAttribute('href', this.toastSymbolId)
		toast.setAttribute('class', 'toast')
		toast.setAttribute('x', startX)
		toast.setAttribute('y', 680)
		this.svg.appendChild(toast)

		const toastObj = {
			el: toast,
			startX,
			endX,
			startY: 680,
			peakY,
			startTime: performance.now(),
			duration: 3000,
			clicked: false,
			upwardSpeed: -8,
			reachedBottom: false
		}

		this.toasts.push(toastObj)
	}

	
	loop(timestamp) {
		this.toasts = this.toasts.filter(toast => {
			const t = (timestamp - toast.startTime) / toast.duration;

			if (t > 1) {
				toast.el.remove();
				return false;
			}

			// Параболическая траектория
			const x = toast.startX + (toast.endX - toast.startX) * t;
			const y = toast.startY - (4 * t * (1 - t)) * (toast.startY - toast.peakY);

			toast.el.setAttribute('x', x);
			toast.el.setAttribute('y', y);

			return true;
		});

		requestAnimationFrame(this.loop);
	}

}


const game = new Game()

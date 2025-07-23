// Определение класса Game, который представляет основную логику игры
class Game {
	// Конструктор класса, инициализирует игру
	constructor() {
		// Получаем ссылку на SVG-элемент игры
		this.svg = document.getElementById('game')
		// ID символа тоста в SVG
		this.toastSymbolId = '#toast'
		// Элемент для отображения счета
		this.scoreEl = document.getElementById('score')
		// Элемент для отображения оставшихся жизней
		this.livesEl = document.getElementById('lives')
		// Элемент для отображения финального счета
		this.finalScoreInfoEl = document.getElementById('final-score-info')
		// Элемент экрана "Игра окончена"
		this.gameOverScreenEl = document.getElementById('game-over-screen')
		// Массив для хранения всех активных тостов
		this.toasts = []
		// Текущий счет игрока
		this.score = 0
		// Интервал между появлением новых тостов (в миллисекундах)
		this.spawnInterval = 2000
		// Количество оставшихся жизней
		this.remainingLives = 5
		// Флаг, указывающий, закончена ли игра
		this.gameOver = false
		// Время начала игры (для отслеживания продолжительности)
		this.gameStartTime = performance.now()

		// Привязываем контекст this для метода loop
		this.loop = this.loop.bind(this)
		// Создаем первый тост
		this.spawnToast()
		// Запускаем таймер создания новых тостов
		this.startSpawnTimer()
		// Обновляем отображение жизней
		this.updateLives()
		// Запускаем игровой цикл
		requestAnimationFrame(this.loop)
	}

	// Метод для запуска/перезапуска таймера создания тостов
	startSpawnTimer() {
		// Если таймер уже существует, очищаем его
		if (this.spawnTimer) {
			clearInterval(this.spawnTimer)
		}
		
		// Вычисляем текущее время игры в секундах
		const gameTimeSeconds = (performance.now() - this.gameStartTime) / 1000
		// Уменьшаем интервал появления тостов по мере прогресса игры (но не менее 500 мс)
		this.spawnInterval = Math.max(500, 2000 - Math.floor(gameTimeSeconds / 10) * 100)
		
		// Устанавливаем новый интервал
		this.spawnTimer = setInterval(() => {
			// Если игра не окончена, создаем новый тост
			if (!this.gameOver) {
				this.spawnToast()
				
				// Перезапускаем таймер (для обновления интервала)
				this.startSpawnTimer()
			}
		}, this.spawnInterval)
	}

	// Метод создания нового тоста
	spawnToast() {
		// Если игра окончена, ничего не делаем
		if (this.gameOver) return

		// Случайные координаты для траектории полета тоста
		const startX = Math.random() * 350 + 25  // Начальная X координата (25-375)
		const endX = Math.random() * 350 + 25   // Конечная X координата
		const peakY = 200 + Math.random() * 50  // Максимальная высота (200-250)

		// Создаем SVG-элемент тоста
		const toast = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		// Указываем символ тоста
		toast.setAttribute('href', this.toastSymbolId)
		// Добавляем класс
		toast.setAttribute('class', 'toast')
		// Устанавливаем начальные координаты
		toast.setAttribute('x', startX)
		toast.setAttribute('y', 680)
		// Добавляем тост на SVG-холст
		this.svg.appendChild(toast)

		// Создаем объект с информацией о тосте
		const toastObj = {
			el: toast,              // SVG-элемент
			startX,                  // Начальная X позиция
			endX,                    // Конечная X позиция
			startY: 680,             // Начальная Y позиция (низ экрана)
			peakY,                   // Максимальная высота
			startTime: performance.now(),  // Время создания
			duration: 3000,          // Длительность полета (3 сек)
			clicked: false,          // Был ли тост кликнут
			upwardSpeed: -8,         // Скорость подъема после клика
			reachedBottom: false      // Достиг ли тост низа (если не кликнут)
		}

		// Добавляем обработчик клика на тост
		toast.addEventListener('pointerdown', () => {
			// Если игра не окончена и тост еще не кликнут
			if (!this.gameOver && !toastObj.clicked) {
				// Увеличиваем счет
				this.score += 1
				// Обновляем отображение счета (формат 00000000)
				this.scoreEl.textContent = this.score.toString().padStart(8, '0')
				// Помечаем тост как кликнутый
				toastObj.clicked = true
			}
		})

		// Добавляем тост в массив активных тостов
		this.toasts.push(toastObj)
	}

	// Проверка условия окончания игры
	checkGameOver() {
		// Если жизни закончились
		if (this.remainingLives <= 0) {
			// Устанавливаем флаг окончания игры
			this.gameOver = true
			// Останавливаем таймер создания тостов
			clearInterval(this.spawnTimer)

			// Показываем экран "Игра окончена"
			this.gameOverScreenEl.setAttribute('visibility','visible')
			// Отображаем финальный счет
			this.finalScoreInfoEl.textContent = `Final Score: ${this.score}`
		}
	}

	// Основной игровой цикл
	loop(timestamp) {
		// Если игра окончена, просто продолжаем цикл (без обновления)
		if (this.gameOver) {
			requestAnimationFrame(this.loop)
			return
		}

		// Фильтруем массив тостов (удаляем завершившие анимацию)
		this.toasts = this.toasts.filter(toast => {
			// Вычисляем прогресс анимации (0-1)
			const t = (timestamp - toast.startTime) / toast.duration

			// Если тост был кликнут
			if (toast.clicked) {
				// Получаем текущую Y-координату
				const currentY = parseFloat(toast.el.getAttribute('y'))
				// Вычисляем новую позицию (движение вверх)
				const newY = currentY + toast.upwardSpeed
				// Обновляем позицию
				toast.el.setAttribute('y', newY)
				// Отключаем события указателя (чтобы нельзя было кликнуть дважды)
				toast.el.setAttribute('pointer-events', 'none')
				// Если тост улетел за верх экрана, удаляем его
				if (newY < -50) {
					toast.el.remove()
					return false
				}
			} else {
				// Если анимация завершена (тост не был кликнут)
				if (t > 1) {
					// Если тост достиг низа впервые
					if (!toast.reachedBottom) {
						// Уменьшаем количество жизней
						this.remainingLives--
						// Обновляем отображение жизней
						this.updateLives()
						// Проверяем условие окончания игры
						this.checkGameOver()
						// Помечаем, что тост достиг низа
						toast.reachedBottom = true
					}
					// Удаляем элемент тоста
					toast.el.remove()
					return false
				}

				// Вычисляем текущие координаты тоста (параболическая траектория)
				const x = toast.startX + (toast.endX - toast.startX) * t
				const y = toast.startY - (4 * t * (1 - t)) * (toast.startY - toast.peakY)

				// Обновляем позицию тоста
				toast.el.setAttribute('x', x)
				toast.el.setAttribute('y', y)
			}

			// Оставляем тост в массиве (еще не завершил анимацию)
			return true
		})

		// Запрашиваем следующий кадр анимации
		requestAnimationFrame(this.loop)
	}
	
	// Метод обновления отображения количества жизней
	updateLives(){
			this.livesEl.textContent = `${this.remainingLives}X`
	}
	
}

// Создаем экземпляр игры при загрузке скрипта
const game = new Game()

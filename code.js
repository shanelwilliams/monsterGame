window.addEventListener('load', function () {
	const canvas = document.getElementById('canvas1')
	const ctx = canvas.getContext('2d')
	canvas.width = 1280
	canvas.height = 720

	ctx.fillStyle = 'white'
	ctx.lineWidth = 3
	ctx.strokeStyle = 'white'

	class Player {
		constructor(game) {
			this.game = game
			this.collisionX = this.game.width * 0.5
			this.collisionY = this.game.height * 0.5
			this.collisionRadius = 35
			this.speedX = 0
			this.speedY = 0
			this.dx = 0 //horizontal distance
			this.dy = 0 //vertical distance
			this.speedModifier = 5
			this.spriteWidth = 255
			this.spriteHeight = 256
			this.width = this.spriteWidth
			this.height = this.spriteHeight
			this.spriteX
			this.spriteY
			this.frameX = 0
			this.frameY = 0
			this.image = document.getElementById('bull')
		}
		draw(context) {
			context.drawImage(
				this.image,
				this.frameX * this.spriteWidth,
				this.frameY * this.spriteWidth,
				this.spriteWidth,
				this.spriteHeight,
				this.spriteX,
				this.spriteY,
				this.width,
				this.height
			)
			if (this.game.debug) {
				context.beginPath()
				context.arc(
					this.collisionX,
					this.collisionY,
					this.collisionRadius,
					0,
					Math.PI * 2
				)
				context.save() //snapshot of current canvas state
				context.globalAlpha = 0.5 //opacity
				context.fill() //fils the circle
				context.restore() //restore to current state later
				context.stroke() //outline
				context.beginPath() //creates two paths, each contains single line
				context.moveTo(this.collisionX, this.collisionY) //starting x y coords of line
				context.lineTo(this.game.mouse.x, this.game.mouse.y) //ending x y coords of line
				context.stroke() //draws the line
			}
		}

		update() {
			this.dx = this.game.mouse.x - this.collisionX
			this.dy = this.game.mouse.y - this.collisionY
			//sprite animation
			const angle = Math.atan2(this.dy, this.dx)
			if (angle < -2.74 || angle > 2.74) {
				this.frameY = 6
			} else if (angle < -1.96) {
				this.frameY = 7
			} else if (angle < -1.17) {
				this.frameY = 0
			} else if (angle < -0.39) {
				this.frameY = 1
			} else if (angle < 0.39) {
				this.frameY = 2
			} else if (angle < 1.17) {
				this.frameY = 3
			} else if (angle < 1.96) {
				this.frameY = 4
			} else if (angle < 2.74) {
				this.frameY = 5
			} else if (angle < -2.74 || angle > 2.74) {
				this.frameY = 6
			} else if (angle < -1.96) {
				this.frameY = 7
			}

			const distance = Math.hypot(this.dy, this.dx) //distance between dy & dx (hypotenuse)
			if (distance > this.speedModifier) {
				this.speedX = this.dx / distance || 0
				this.speedY = this.dy / distance || 0
			} else {
				this.speedX = 0
				this.speedY = 0
			}

			this.collisionX += this.speedX * this.speedModifier
			this.collisionY += this.speedY * this.speedModifier
			this.spriteX = this.collisionX - this.width * 0.5
			this.spriteY = this.collisionY - this.height * 0.5 - 85

			// horizontal boundaries
			if (this.collisionX < this.collisionRadius) {
				this.collisionX = this.collisionRadius
			} else if (this.collisionX > this.game.width - this.collisionRadius) {
				this.collisionX = this.game.width - this.collisionRadius
			}

			//vertical boundaries
			if (this.collisionY < this.game.topMargin + this.collisionRadius) {
				this.collisionY = this.game.topMargin + this.collisionRadius
			} else if (this.collisionY > this.game.height - this.collisionRadius) {
				this.collisionY = this.game.height - this.collisionRadius
			}

			//collision with obstacles
			this.game.obstacles.forEach((obstacle) => {
				// [(distance < sumOfRadius), distance, sumOfRadius, dx, dy]
				// This formula makes it so player can't collide with obstacles
				let [collision, distance, sumOfRadius, dx, dy] =
					this.game.checkCollision(this, obstacle)
				if (collision) {
					const unit_x = dx / distance
					const unit_y = dy / distance
					this.collisionX = obstacle.collisionX + (sumOfRadius + 1) * unit_x
					this.collisionY = obstacle.collisionY + (sumOfRadius + 1) * unit_y
				}
			})
		}
	}

	class Obstacle {
		constructor(game) {
			this.game = game
			this.collisionX = Math.random() * this.game.width
			this.collisionY = Math.random() * this.game.height
			this.collisionRadius = 40
			this.image = document.getElementById('obstacles')
			this.spriteWidth = 250
			this.spriteHeight = 250
			this.width = this.spriteWidth
			this.height = this.spriteHeight
			this.spriteX = this.collisionX - this.width * 0.5
			this.spriteY = this.collisionY - this.height * 0.5 - 70
			this.frameX = Math.floor(Math.random() * 4)
			this.frameY = Math.floor(Math.random() * 3)
		}
		draw(context) {
			context.drawImage(
				this.image,
				this.frameX * this.spriteWidth,
				this.frameY * this.spriteHeight,
				this.spriteWidth,
				this.spriteHeight,
				this.spriteX,
				this.spriteY,
				this.width,
				this.height
			)
			if (this.game.debug) {
				context.beginPath()
				context.arc(
					this.collisionX,
					this.collisionY,
					this.collisionRadius,
					0,
					Math.PI * 2
				)
				context.save() //snapshot of current canvas state
				context.globalAlpha = 0.5 //opacity
				context.fill() //fils the circle
				context.restore() //restore to current state later
				context.stroke() //outline
			}
		}
		update() {

		}
	}

	class Egg {
		constructor(game) {
			this.game = game
			this.collisionRadius = 40
			this.margin = this.collisionRadius * 2
			this.collisionX =
				this.margin + Math.random() * (this.game.width - this.margin * 2)
			this.collisionY =
				this.game.topMargin +
				Math.random() * (this.game.height - this.game.topMargin - this.margin)
			this.collisionRadius = 40
			this.image = document.getElementById('egg')
			this.spriteWidth = 110
			this.spriteHeight = 135
			this.width = this.spriteWidth
			this.height = this.spriteHeight
			this.spriteX
			this.spriteY
		}

		draw(context) {
			context.drawImage(
				this.image,
				this.spriteX,
				this.spriteY,
				this.width,
				this.height
			)
			if (this.game.debug) {
				context.beginPath()
				context.arc(
					this.collisionX,
					this.collisionY,
					this.collisionRadius,
					0,
					Math.PI * 2
				)
				context.save() //snapshot of current canvas state
				context.globalAlpha = 0.5 //opacity
				context.fill() //fils the circle
				context.restore() //restore to current state later
				context.stroke() //outline
			}
		}

		update() {
			this.spriteX = this.collisionX - this.width * 0.5
			this.spriteY = this.collisionY - this.width * 0.5 - 30
			let collisionObjects = [this.game.player, ...this.game.obstacles]
			collisionObjects.forEach((object) => {
				let [collision, distance, sumOfRadius, dx, dy] =
					this.game.checkCollision(this, object)
					if(collision) {
						const unit_x = dx / distance
						const unit_y = dy / distance
						this.collisionX = object.collisionX + (sumOfRadius + 1) * unit_x
						this.collisionY = object.collisionY + (sumOfRadius + 1) * unit_y
					}
			})
		}
	}
	class Game {
		constructor(canvas) {
			this.canvas = canvas
			this.width = this.canvas.width
			this.height = this.canvas.height
			this.topMargin = 260
			this.debug = true
			this.player = new Player(this)
			this.fps = 70 // frames per second
			this.timer = 0
			this.interval = 1000 / this.fps
			this.eggTimer = 0
			this.eggInterval = 100
			this.numOfObstacles = 5
			this.maxEggs = 20
			this.obstacles = []
			this.eggs = []
			this.gameObjects = []
			this.mouse = {
				x: this.width * 0.5,
				y: this.height * 0.5,
				pressed: false,
			}

			// event listeners
			canvas.addEventListener('mousedown', (e) => {
				this.mouse.x = e.offsetX
				this.mouse.y = e.offsetY
				this.mouse.pressed = true
			})
			canvas.addEventListener('mouseup', (e) => {
				this.mouse.x = e.offsetX
				this.mouse.y = e.offsetY
				this.mouse.pressed = false
			})
			canvas.addEventListener('mousemove', (e) => {
				if (this.mouse.pressed) {
					this.mouse.x = e.offsetX
					this.mouse.y = e.offsetY
				}
			})
			window.addEventListener('keydown', (e) => {
				if (e.key === 'd') {
					this.debug = !this.debug
					console.log(e)
				}
			})
		}
		render(context, deltaTime) {
			if (this.timer > this.interval) {
				ctx.clearRect(0, 0, this.width, this.height)
				this.gameObjects = [...this.eggs, ...this.obstacles, this.player]
				//sort by vertical position
				this.gameObjects.sort((a, b) => {
					return a.collisionY - b.collisionY
				})
				//animate next frame
				this.gameObjects.forEach(object => {
					object.draw(context)
					object.update()
				})

				this.timer = 0
			}
			this.timer += deltaTime

			// add eggs periodically
			if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
				this.addEgg()
				this.eggTimer = 0
				console.log(this.eggs)
			} else {
				this.eggTimer += deltaTime
			}
		}

		checkCollision(a, b) {
			const dx = a.collisionX - b.collisionX
			const dy = a.collisionY - b.collisionY
			const distance = Math.hypot(dy, dx)
			const sumOfRadius = a.collisionRadius + b.collisionRadius
			return [distance < sumOfRadius, distance, sumOfRadius, dx, dy]
		}

		addEgg() {
			this.eggs.push(new Egg(this))
		}

		init() {
			let attempts = 0
			while (this.obstacles.length < this.numOfObstacles && attempts < 500) {
				let testObstacle = new Obstacle(this)
				let overlap = false
				this.obstacles.forEach((obstacle) => {
					//Keep obstacles from overlapping
					const dx = testObstacle.collisionX - obstacle.collisionX
					const dy = testObstacle.collisionY - obstacle.collisionY
					const distance = Math.hypot(dy, dx)
					const distanceBuffer = 150
					const sumOfRadius =
						testObstacle.collisionRadius +
						obstacle.collisionRadius +
						distanceBuffer
					if (distance < sumOfRadius) {
						overlap = true
					}
				})
				const margin = testObstacle.collisionRadius * 3
				if (
					!overlap &&
					testObstacle.spriteX > 0 &&
					testObstacle.spriteX < this.width - testObstacle.width &&
					testObstacle.collisionY > this.topMargin + margin &&
					testObstacle.collisionY < this.height - margin
				) {
					this.obstacles.push(testObstacle)
				}
				attempts += 1
			}
		}
	}

	const game = new Game(canvas)
	game.init()
	console.log(game)

	let lastTime = 0

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime
		lastTime = timeStamp
		game.render(ctx, deltaTime)
		requestAnimationFrame(animate)
	}
	animate(0)
})

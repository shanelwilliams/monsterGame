window.addEventListener('load', function() {
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
			this.collisionRadius = 30
			this.speedX = 0
			this.speedY = 0
			this.dx = 0 //horizontal distance
			this.dy = 0 //vertical distance
			this.speedModifier = 20
		}
		draw(context) {
			context.beginPath()
			context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
			context.save()  //snapshot of current canvas state
			context.globalAlpha = 0.5  //opacity
			context.fill()  //fils the circle
			context.restore()  //restore to current state later
			context.stroke()  //outline
			context.beginPath()  //creates two paths, each contains single line
			context.moveTo(this.collisionX, this.collisionY)  //starting x y coords of line
			context.lineTo(this.game.mouse.x, this.game.mouse.y)  //ending x y coords of line
			context.stroke()  //draws the line
		}
		
		update() {
			this.dx = this.game.mouse.x - this.collisionX
			this.dy = this.game.mouse.y - this.collisionY
			const distance = Math.hypot(this.dy, this.dx)  //distance between dy & dx (hypotenuse)
			if(distance > this.speedModifier) {
				this.speedX = this.dx / distance || 0
				this.speedY = this.dy / distance || 0
			} else {
				this.speedX = 0
				this.speedY = 0
			}

			this.collisionX += this.speedX * this.speedModifier
			this.collisionY += this.speedY * this.speedModifier

			//collision with obstacles
			this.game.obstacles.forEach(obstacle => {
				if(this.game.checkCollision(this, obstacle)) {
					console.log('collision')
				}
			})
		}
	}

	class Obstacle {
		constructor(game) {
			this.game = game
			this.collisionX = Math.random() * this.game.width
			this.collisionY = Math.random() * this.game.height
			this.collisionRadius = 60
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
			context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)
			context.beginPath()
			context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
			context.save()  //snapshot of current canvas state
			context.globalAlpha = 0.5  //opacity
			context.fill()  //fils the circle
			context.restore()  //restore to current state later
			context.stroke()  //outline
		}
	}
	class Game {
		constructor(canvas) {
			this.canvas = canvas
			this.width = this.canvas.width
			this.height = this.canvas.height
			this.topMargin = 260
			this.player = new Player(this)
			this.numOfObstacles = 5
			this.obstacles = []
			this.mouse = {
				x: this.width * 0.5,
				y: this.height * 0.5,
				pressed: false
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
				if(this.mouse.pressed) {
				this.mouse.x = e.offsetX
				this.mouse.y = e.offsetY
				}
			})
		}
		render(context) {
			this.player.draw(context)
			this.player.update()
			this.obstacles.forEach(obstacle => obstacle.draw(context))
		}
		checkCollision(a, b) {
			const dx = a.collisionX - b.collisionX
			const dy = a.collisionY - b.collisionY
			const distance = Math.hypot(dy, dx)
			const sumOfRadius = a.collisionRadius + b.collisionRadius
			return (distance < sumOfRadius)
		}
		init() {
			let attempts = 0
			while(this.obstacles.length < this.numOfObstacles && attempts < 500) {
				let testObstacle = new Obstacle(this)
				let overlap = false
				this.obstacles.forEach(obstacle => {   //Keep obstacles from overlapping
					const dx = testObstacle.collisionX - obstacle.collisionX
					const dy = testObstacle.collisionY - obstacle.collisionY
					const distance = Math.hypot(dy, dx)
					const distanceBuffer = 150
					const sumOfRadius = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer
					if(distance < sumOfRadius) {
						overlap = true
					}
				})
				const margin = testObstacle.collisionRadius * 2
				if(!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin) {
					this.obstacles.push(testObstacle)
				}
				attempts += 1
			}
		}
	}

	const game = new Game(canvas)
	game.init()
	console.log(game)
	
	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		game.render(ctx)
		requestAnimationFrame(animate)
	}
	animate()
})
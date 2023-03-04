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
		}
	}

	class Game {
		constructor(canvas) {
			this.canvas = canvas
			this.width = this.canvas.width
			this.height = this.canvas.height
			this.player = new Player(this)
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
		}
	}

	const game = new Game(canvas)
	
	
	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		game.render(ctx)
		requestAnimationFrame(animate)
	}
	animate()
})
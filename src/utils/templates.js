export const TEMPLATES = [
  {
    name: 'Blank Canvas',
    html: '<div class="container">\n  <h1>Welcome to CodeCanvas</h1>\n  <button id="btn">Click me</button>\n</div>',
    css: '.container {\n  text-align: center;\n  padding: 40px;\n}\nh1 {\n  color: #00f0ff;\n}\nbutton {\n  background: #ff0055;\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  cursor: pointer;\n  font-weight: bold;\n}',
    js: 'document.getElementById("btn").addEventListener("click", () => {\n  alert("You clicked the button!");\n});'
  },
  {
    name: 'Neon Cyber Button',
    html: '<div class="center">\n  <button class="cyber-btn">\n    <span>HOVER ME</span>\n    <div class="glow"></div>\n  </button>\n</div>',
    css: '.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background: #050505;\n}\n\n.cyber-btn {\n  position: relative;\n  padding: 15px 45px;\n  background: transparent;\n  border: 1px solid #00f0ff;\n  color: #00f0ff;\n  font-size: 1.2rem;\n  font-family: monospace;\n  font-weight: bold;\n  letter-spacing: 4px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  overflow: hidden;\n  border-radius: 4px;\n}\n\n.cyber-btn:hover {\n  background: #00f0ff;\n  color: #050505;\n  box-shadow: 0 0 20px #00f0ff;\n}\n\n.cyber-btn:active {\n  transform: scale(0.95);\n}',
    js: 'const btn = document.querySelector(".cyber-btn");\n\nbtn.addEventListener("mousemove", (e) => {\n  const rect = btn.getBoundingClientRect();\n  const x = e.clientX - rect.left;\n  const y = e.clientY - rect.top;\n  \n  btn.style.setProperty("--x", x + "px");\n  btn.style.setProperty("--y", y + "px");\n});'
  },
  {
    name: 'Particle Canvas Interactive',
    html: '<canvas id="particles"></canvas>',
    css: 'body, html {\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  background: #0a0a0a;\n}\ncanvas {\n  display: block;\n}',
    js: 'const canvas = document.getElementById("particles");\nconst ctx = canvas.getContext("2d");\n\ncanvas.width = window.innerWidth;\ncanvas.height = window.innerHeight;\n\nconst particles = [];\n\nclass Particle {\n  constructor() {\n    this.x = Math.random() * canvas.width;\n    this.y = Math.random() * canvas.height;\n    this.vx = (Math.random() - 0.5) * 2;\n    this.vy = (Math.random() - 0.5) * 2;\n    this.size = Math.random() * 3 + 1;\n  }\n  update() {\n    this.x += this.vx;\n    this.y += this.vy;\n    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;\n    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;\n  }\n  draw() {\n    ctx.fillStyle = "rgba(0, 240, 255, 0.5)";\n    ctx.beginPath();\n    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);\n    ctx.fill();\n  }\n}\n\nfor (let i = 0; i < 100; i++) {\n  particles.push(new Particle());\n}\n\nfunction animate() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  particles.forEach(p => {\n    p.update();\n    p.draw();\n  });\n  requestAnimationFrame(animate);\n}\n\nanimate();'
  },
  {
    name: 'Modern Login Form',
    html: '<div class="glass-login">\n  <h2>Welcome Back</h2>\n  <form>\n    <div class="input-group">\n      <input type="text" required>\n      <label>Username</label>\n    </div>\n    <div class="input-group">\n      <input type="password" required>\n      <label>Password</label>\n    </div>\n    <button type="submit" class="submit-btn">Login</button>\n  </form>\n</div>',
    css: 'body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background: linear-gradient(45deg, #1a1a2e, #16213e);\n  font-family: "Inter", sans-serif;\n  color: white;\n}\n\n.glass-login {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(15px);\n  padding: 40px;\n  border-radius: 16px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  box-shadow: 0 25px 45px rgba(0,0,0,0.2);\n  width: 320px;\n}\n\n.glass-login h2 {\n  margin-top: 0;\n  text-align: center;\n  font-weight: 600;\n}\n\n.input-group {\n  position: relative;\n  margin-bottom: 30px;\n}\n\n.input-group input {\n  width: 100%;\n  padding: 10px 0;\n  font-size: 16px;\n  color: #fff;\n  margin-bottom: 30px;\n  border: none;\n  border-bottom: 1px solid #fff;\n  outline: none;\n  background: transparent;\n}\n\n.input-group label {\n  position: absolute;\n  top: 0;\n  left: 0;\n  padding: 10px 0;\n  font-size: 16px;\n  color: rgba(255,255,255,0.6);\n  pointer-events: none;\n  transition: .5s;\n}\n\n.input-group input:focus ~ label,\n.input-group input:valid ~ label {\n  top: -20px;\n  left: 0;\n  color: #00f0ff;\n  font-size: 12px;\n}\n\n.submit-btn {\n  width: 100%;\n  padding: 12px;\n  background: #00f0ff;\n  border: none;\n  border-radius: 8px;\n  color: #050505;\n  font-weight: bold;\n  cursor: pointer;\n  transition: 0.3s;\n}\n\n.submit-btn:hover {\n  background: #fff;\n}',
    js: 'document.querySelector("form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const btn = document.querySelector(".submit-btn");\n  btn.innerText = "Authenticating...";\n  setTimeout(() => {\n    btn.innerText = "Success!";\n    btn.style.background = "#00ff88";\n  }, 1500);\n});'
  }
];

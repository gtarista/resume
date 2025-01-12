// Vertex Shader
const particleVertex = `
  attribute float scale;
  uniform float uTime;

  void main() {
    vec3 p = position;
    float s = scale;

    p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    p.x += (sin(p.y + uTime) * 0.5);
    s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment Shader
const particleFragment = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
  }
`;

// Canvas Class
class Canvas {
  constructor() {
    this.config = {
      canvas: document.querySelector('#c'),
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
      aspectRatio: window.innerWidth / window.innerHeight,
      mouse: new THREE.Vector2(-10, -10),
    };

    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.config.aspectRatio, 0.01, 1000);
    this.camera.position.set(0, 6, 5);
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.config.canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.config.winWidth, this.config.winHeight);
  }

  initParticles() {
    const gap = 0.3;
    const amountX = 200;
    const amountY = 200;
    const particleNum = amountX * amountY;
    const particlePositions = new Float32Array(particleNum * 3);
    const particleScales = new Float32Array(particleNum);

    let i = 0, j = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        particlePositions[i] = ix * gap - (amountX * gap) / 2;
        particlePositions[i + 1] = 0;
        particlePositions[i + 2] = iy * gap - (amountX * gap) / 2;
        particleScales[j] = 1;
        i += 3;
        j++;
      }
    }

    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    this.particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    this.particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: { uTime: { type: 'f', value: 0 } },
    });

    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particles);
  }

  render() {
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.particleMaterial.uniforms.uTime.value += 0.05;
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  onMouseMove(e) {
    this.config.mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  }

  onResize() {
    this.config.winWidth = window.innerWidth;
    this.config.winHeight = window.innerHeight;
    this.camera.aspect = this.config.winWidth / this.config.winHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.config.winWidth, this.config.winHeight);
  }
}

new Canvas();
// Scroll snap and smooth scroll logic
mainContainer.addEventListener('wheel', (event) => {
  if (isScrolling) return;
  isScrolling = true;

  // Preventing unnecessary scroll adjustments
  const direction = event.deltaY > 0 ? 1 : -1;
  const currentScroll = mainContainer.scrollTop;
  const viewportHeight = window.innerHeight;
  const nextScroll = direction > 0
    ? Math.ceil(currentScroll / viewportHeight) * viewportHeight
    : Math.floor(currentScroll / viewportHeight) * viewportHeight;

  if (nextScroll === currentScroll) {
    isScrolling = false;
    return;
  }

  mainContainer.scrollTo({ top: nextScroll, behavior: 'smooth' });

  // Add smooth scrolling buffer to prevent "jumping"
  setTimeout(() => {
    isScrolling = false;
  }, 800);
});

// Navbar smooth scroll (no change needed, works with snapping)
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevents the page from reloading
  
  // Grab the email value entered by the user
  const userEmail = document.getElementById("userEmail").value;
  
  // Simulate form submission
  if (userEmail) {
      document.getElementById("responseMessage").innerHTML = 
          `Thank you for submitting your email: ${userEmail}. I will get in touch soon!`;
  } else {
      document.getElementById("responseMessage").innerHTML = 
          'Please enter a valid email address.';
  }
});


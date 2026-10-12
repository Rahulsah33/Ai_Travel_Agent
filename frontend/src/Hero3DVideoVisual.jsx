import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Compass,
  Maximize2,
  Navigation,
  Pause,
  Plane,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FLIGHT_ROUTES = [
  {
    id: "paris",
    from: "DEL",
    fromCity: "New Delhi, IN",
    to: "CDG",
    toCity: "Paris, FR",
    flightNo: "AI-146",
    aircraft: "Boeing 787-9 Dreamliner",
    altitude: "38,000 FT",
    speed: "890 KM/H",
    heading: "312° NW",
    duration: "8h 50m",
    price: "₹48,700",
    weather: "Paris 18°C • Mild",
    prompt: "Search available flights from Delhi to Paris on 2026-11-08",
  },
  {
    id: "tokyo",
    from: "DEL",
    fromCity: "New Delhi, IN",
    to: "HND",
    toCity: "Tokyo, JP",
    flightNo: "NH-838",
    aircraft: "Airbus A350-900",
    altitude: "41,000 FT",
    speed: "920 KM/H",
    heading: "078° ENE",
    duration: "7h 40m",
    price: "₹38,500",
    weather: "Tokyo 16°C • Clear",
    prompt: "Find flights and travel guide for Tokyo and Kyoto for next month",
  },
  {
    id: "london",
    from: "DEL",
    fromCity: "New Delhi, IN",
    to: "LHR",
    toCity: "London, UK",
    flightNo: "BA-142",
    aircraft: "Boeing 777-300ER",
    altitude: "36,000 FT",
    speed: "875 KM/H",
    heading: "318° NW",
    duration: "9h 15m",
    price: "₹51,200",
    weather: "London 14°C • Overcast",
    prompt: "How does London Oyster card transit work and what are top sights to see?",
  },
];

export default function Hero3DVideoVisual() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [activeTab, setActiveTab] = useState("3d-globe"); // '3d-globe' | '3d-video' | 'hud'
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const currentRoute = FLIGHT_ROUTES[selectedRouteIdx];

  // Mouse Parallax 3D Card Tilt
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 12,
      y: (x / rect.width) * 14,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Three.js 3D Interactive Flight Globe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    const width = canvas.clientWidth || 420;
    const height = canvas.clientHeight || 460;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Earth Globe (Sphere with glow & wireframe lat/long)
    const globeRadius = 1.05;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Dark luminous core sphere
    const coreGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x051a24,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Glowing wireframe grid
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius + 0.005, 24, 24));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Atmospheric outer glow rim
    const atmoGeo = new THREE.SphereGeometry(globeRadius * 1.18, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x086288,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmoMesh);

    // 3. Floating 3D Starfield Particles
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 10;
      starPositions[i + 1] = (Math.random() - 0.5) * 10;
      starPositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Great Circle 3D Flight Arcs
    const createCurve = (startVec, endVec, peakHeight = 1.45) => {
      const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(peakHeight);
      return new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
    };

    // Geographic Coordinates converted to 3D Sphere points
    const latLongToVector = (lat, lon, r = globeRadius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Major Airports (Delhi, Paris, Tokyo, London)
    const pDEL = latLongToVector(28.5562, 77.1000);
    const pCDG = latLongToVector(49.0097, 2.5479);
    const pHND = latLongToVector(35.5494, 139.7798);
    const pLHR = latLongToVector(51.4700, -0.4543);

    const routes = [
      createCurve(pDEL, pCDG, 1.42),
      createCurve(pDEL, pHND, 1.38),
      createCurve(pDEL, pLHR, 1.46),
    ];

    // Render Flight Paths
    const pathGroup = new THREE.Group();
    globeGroup.add(pathGroup);

    routes.forEach((curve, idx) => {
      const points = curve.getPoints(50);
      const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
      const pathMat = new THREE.LineBasicMaterial({
        color: idx === 0 ? 0x34d399 : 0x0ea5e9,
        transparent: true,
        opacity: idx === selectedRouteIdx ? 0.95 : 0.25,
        linewidth: 2,
      });
      const pathLine = new THREE.Line(pathGeo, pathMat);
      pathGroup.add(pathLine);
    });

    // 5. Animated 3D Airplane Mesh on Trajectory
    const planeGeo = new THREE.ConeGeometry(0.045, 0.12, 5);
    planeGeo.rotateX(Math.PI / 2);
    const planeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    globeGroup.add(planeMesh);

    // Glowing Trailing Ring
    const ringGeo = new THREE.RingGeometry(0.06, 0.09, 20);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    globeGroup.add(ringMesh);

    // 6. Animation Loop
    let progress = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate Globe & Starfield slowly
      globeGroup.rotation.y += 0.0035;
      starField.rotation.y -= 0.0008;

      // Animate Airplane along current selected flight trajectory
      const activeCurve = routes[selectedRouteIdx] || routes[0];
      progress = (progress + 0.0045) % 1;
      const point = activeCurve.getPointAt(progress);
      const tangent = activeCurve.getTangentAt(progress).normalize();

      planeMesh.position.copy(point);
      planeMesh.lookAt(point.clone().add(tangent));

      ringMesh.position.copy(point);
      ringMesh.lookAt(point.clone().add(tangent));
      const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.25;
      ringMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      const newWidth = canvas.clientWidth || 420;
      const newHeight = canvas.clientHeight || 460;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      coreGeo.dispose();
      wireGeo.dispose();
      atmoGeo.dispose();
      starGeo.dispose();
      planeGeo.dispose();
      ringGeo.dispose();
    };
  }, [selectedRouteIdx]);

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div
      className="hero-3d-cinema-wrapper"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Outer ambient glow */}
      <div className="hero-3d-ambient-glow" />

      {/* Main 3D Cinema Card */}
      <div className="hero-3d-card">
        {/* Top Header Bar */}
        <div className="hero-3d-card-header">
          <div className="card-brand-status">
            <div className="pulse-beacon" />
            <div className="brand-titles">
              <strong>LIZZA 3D FLIGHT COPILOT</strong>
              <span>{currentRoute.aircraft} &bull; LIVE TELEMETRY</span>
            </div>
          </div>

          <div className="header-view-tabs">
            <button
              className={`view-tab-btn ${activeTab === "3d-globe" ? "active" : ""}`}
              onClick={() => setActiveTab("3d-globe")}
            >
              <Compass size={13} />
              <span>3D Orbit</span>
            </button>
            <button
              className={`view-tab-btn ${activeTab === "3d-video" ? "active" : ""}`}
              onClick={() => setActiveTab("3d-video")}
            >
              <Plane size={13} />
              <span>3D Flight</span>
            </button>
            <button
              className={`view-tab-btn ${activeTab === "hud" ? "active" : ""}`}
              onClick={() => setActiveTab("hud")}
            >
              <Navigation size={13} />
              <span>HUD Cockpit</span>
            </button>
          </div>
        </div>

        {/* 3D Visual Viewport Area */}
        <div className="hero-3d-viewport">
          {/* Tab 1: Interactive 3D Three.js Globe */}
          <div
            className={`viewport-layer globe-layer ${
              activeTab === "3d-globe" ? "is-visible" : ""
            }`}
          >
            <canvas ref={canvasRef} className="three-flight-canvas" />
            <div className="flight-orbit-tag">
              <span className="live-dot" />
              <span>Real-Time WebGL Flight Trajectory</span>
            </div>
          </div>

          {/* Tab 2: Cinematic 3D Aerial Video */}
          <div
            className={`viewport-layer video-layer ${
              activeTab === "3d-video" ? "is-visible" : ""
            }`}
          >
            <video
              ref={videoRef}
              className="cinematic-travel-video"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=900&q=80"
            >
              <source
                src="https://raw.githubusercontent.com/eeftychiou/airplane-detection/master/samplevid/plane.mp4"
                type="video/mp4"
              />
              <source
                src="https://upload.wikimedia.org/wikipedia/commons/e/ee/San-jacinto-peak-from-an-airplane.webm"
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>

            {/* Video Control Bar */}
            <div className="video-overlay-controls">
              <button className="video-ctrl-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button className="video-ctrl-btn" onClick={toggleMute}>
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <div className="video-badge-pill">
                <span>4K Aerial Flight Simulation</span>
              </div>
            </div>
          </div>

          {/* Tab 3: Cockpit Telemetry HUD */}
          <div
            className={`viewport-layer hud-layer ${
              activeTab === "hud" ? "is-visible" : ""
            }`}
          >
            <div className="hud-radar-sweep">
              <div className="radar-scanner" />
              <div className="radar-blip blip-1" />
              <div className="radar-blip blip-2" />
              <div className="hud-target-box">
                <small>WAYPOINT LOCKED</small>
                <strong>
                  {currentRoute.from} &rarr; {currentRoute.to}
                </strong>
              </div>
            </div>
          </div>

          {/* Floating Glassmorphic Telemetry Overlay */}
          <div className="hud-floating-telemetry">
            <div className="hud-metric">
              <small>ALTITUDE</small>
              <strong>{currentRoute.altitude}</strong>
            </div>
            <div className="hud-metric">
              <small>SPEED</small>
              <strong>{currentRoute.speed}</strong>
            </div>
            <div className="hud-metric">
              <small>HEADING</small>
              <strong>{currentRoute.heading}</strong>
            </div>
            <div className="hud-metric">
              <small>ETA</small>
              <strong>{currentRoute.duration}</strong>
            </div>
          </div>
        </div>

        {/* Flight Route Information & Booking Bar */}
        <div className="hero-3d-card-body">
          <div className="route-endpoints-bar">
            <div className="endpoint-block">
              <h3>{currentRoute.from}</h3>
              <span>{currentRoute.fromCity}</span>
            </div>

            <div className="flight-arrow-path">
              <div className="flight-indicator">
                <Plane size={15} />
              </div>
              <div className="dashed-flight-line" />
              <small>{currentRoute.flightNo}</small>
            </div>

            <div className="endpoint-block right-align">
              <h3>{currentRoute.to}</h3>
              <span>{currentRoute.toCity}</span>
            </div>
          </div>

          {/* Quick Route Selector Buttons */}
          <div className="route-select-pills">
            {FLIGHT_ROUTES.map((route, idx) => (
              <button
                key={route.id}
                className={`route-pill-btn ${selectedRouteIdx === idx ? "active" : ""}`}
                onClick={() => setSelectedRouteIdx(idx)}
              >
                <span>{route.from} &rarr; {route.to}</span>
                <b>{route.price}</b>
              </button>
            ))}
          </div>

          {/* Card Footer with CTA */}
          <div className="hero-3d-card-footer">
            <div className="footer-price-wrap">
              <small>Copilot Fare &bull; Verified</small>
              <strong>{currentRoute.price}</strong>
            </div>

            <button
              className="btn-book-3d"
              onClick={() =>
                navigate(`/chat?prompt=${encodeURIComponent(currentRoute.prompt)}`)
              }
              id="hero-3d-ask-btn"
            >
              <span>Ask Lizza to Book</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Live Weather Pill Widget */}
      <div className="floating-weather-3d-badge">
        <div className="weather-3d-icon">
          <Sun size={20} />
        </div>
        <div className="weather-3d-text">
          <b>{currentRoute.weather}</b>
          <small>Open-Meteo &bull; Live Telemetry Sync</small>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef,useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Redirect after login
import * as THREE from 'three';
import './Login.css';

import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  Shield, 
  Clock,
  ExternalLink
} from 'lucide-react';

const LoginAlt = ({ onLogin }) => {

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Redirect hook
    const threeContainerRef = useRef(null);
  
  useEffect(() => {
    // Initialize Three.js scene
    const container = threeContainerRef.current;
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf5f7fa, 1); // Light background color
    container.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.z = 20;
    camera.position.y = 5;
    
    // Create industrial factory elements
    const machines = [];
    const pipes = [];
    const sensors = [];
    
    // Factory floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xe9ecef,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -5;
    scene.add(floor);
    
    // Grid on the floor
    const gridHelper = new THREE.GridHelper(100, 50, 0xced4da, 0xced4da);
    gridHelper.position.y = -4.9;
    scene.add(gridHelper);
    
    // Create factory machines
    for (let i = 0; i < 8; i++) {
      // Machine base
      const baseGeometry = new THREE.BoxGeometry(3, 2, 2);
      const baseMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(0.9, 0.9, 0.95)
      });
      
      const machine = new THREE.Mesh(baseGeometry, baseMaterial);
      
      // Position in a circular pattern around the center
      const angle = (i / 8) * Math.PI * 2;
      const radius = 12;
      machine.position.x = Math.cos(angle) * radius;
      machine.position.z = Math.sin(angle) * radius;
      machine.position.y = -3;
      
      // Rotate to face center
      machine.rotation.y = angle + Math.PI;
      
      scene.add(machine);
      machines.push(machine);
      
      // Add machine details
      const detailGeometry = new THREE.BoxGeometry(2, 1, 1.5);
      const detailMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(0.7, 0.75, 0.8)
      });
      
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.position.set(machine.position.x, machine.position.y + 1.5, machine.position.z);
      detail.rotation.y = angle + Math.PI;
      scene.add(detail);
      
      // Add a sensor to each machine
      const sensorGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const sensorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4dabf7,
        transparent: true,
        opacity: 0.8
      });
      
      const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
      sensor.position.set(
        machine.position.x, 
        machine.position.y + 2.5, 
        machine.position.z
      );
      scene.add(sensor);
      sensors.push({
        mesh: sensor,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
    
    // Create central control hub
    const hubGeometry = new THREE.CylinderGeometry(2, 2, 3, 12);
    const hubMaterial = new THREE.MeshBasicMaterial({ color: 0x339af0 });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.position.set(0, -2.5, 0);
    scene.add(hub);
    
    // Add a spinning top to the hub
    const hubTopGeometry = new THREE.ConeGeometry(1, 2, 12);
    const hubTopMaterial = new THREE.MeshBasicMaterial({ color: 0x228be6 });
    const hubTop = new THREE.Mesh(hubTopGeometry, hubTopMaterial);
    hubTop.position.set(0, 0, 0);
    hub.add(hubTop);
    
    // Create data connections (pipes) between machines and hub
    for (let i = 0; i < machines.length; i++) {
      const machine = machines[i];
      
      // Create a curved pipe from machine to hub
      const curvePoints = [];
      
      // Start point (at machine)
      const startPoint = new THREE.Vector3(
        machine.position.x,
        machine.position.y + 2,
        machine.position.z
      );
      
      // Control point (higher in the air)
      const controlPoint = new THREE.Vector3(
        machine.position.x * 0.5,
        machine.position.y + 6 + Math.random() * 2,
        machine.position.z * 0.5
      );
      
      // End point (at hub)
      const endPoint = new THREE.Vector3(0, 0, 0);
      
      // Create a quadratic Bezier curve
      const curve = new THREE.QuadraticBezierCurve3(
        startPoint,
        controlPoint,
        endPoint
      );
      
      // Create the curve geometry with 20 points along the curve
      const points = curve.getPoints(20);
      const pipeGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const pipeMaterial = new THREE.LineBasicMaterial({ 
        color: 0x339af0,
        transparent: true,
        opacity: 0.5
      });
      
      const pipe = new THREE.Line(pipeGeometry, pipeMaterial);
      scene.add(pipe);
      pipes.push({
        curve: curve,
        line: pipe
      });
      
      // Data packets flowing along the pipes
      const createDataPacket = () => {
        const packetGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const packetMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x1971c2,
          transparent: true,
          opacity: 0.9
        });
        
        const packet = new THREE.Mesh(packetGeometry, packetMaterial);
        scene.add(packet);
        
        return {
          mesh: packet,
          curve: curve,
          progress: 0,
          speed: 0.005 + Math.random() * 0.01,
          direction: Math.random() > 0.5 ? 1 : -1, // 1 = hub to machine, -1 = machine to hub
          active: true
        };
      };
      
      // Create 2 packets per pipe
      const packets = [];
      for (let j = 0; j < 2; j++) {
        packets.push(createDataPacket());
      }
      
      pipes[i].packets = packets;
    }
    
    // Add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate hub top
      hubTop.rotation.y += 0.01;
      
      // Pulse sensors
      sensors.forEach(sensor => {
        const time = Date.now() * sensor.pulseSpeed + sensor.pulseOffset;
        const scale = 1 + Math.sin(time) * 0.2;
        sensor.mesh.scale.set(scale, scale, scale);
        
        // Pulse color
        const blue = 0.7 + Math.sin(time) * 0.3;
        sensor.mesh.material.color.setRGB(0.3, 0.67, blue);
      });
      
      // Animate data packets
      pipes.forEach(pipe => {
        pipe.packets.forEach(packet => {
          if (packet.active) {
            // Update position along the curve
            packet.progress += packet.speed * packet.direction;
            
            // Reset or deactivate when reached an end
            if (packet.progress >= 1 || packet.progress <= 0) {
              if (Math.random() > 0.3) {
                // Reverse direction
                packet.direction *= -1;
                packet.progress = packet.progress <= 0 ? 0 : 1;
              } else {
                // Temporarily deactivate
                packet.active = false;
                packet.mesh.visible = false;
                setTimeout(() => {
                  packet.active = true;
                  packet.mesh.visible = true;
                  packet.progress = packet.direction > 0 ? 0 : 1;
                }, Math.random() * 2000 + 1000);
              }
            }
            
            if (packet.active) {
              // Get position along the curve
              const point = pipe.curve.getPointAt(packet.progress);
              packet.mesh.position.copy(point);
            }
          }
        });
      });
      
      // Gentle camera rotation around the scene
      camera.position.x = Math.sin(Date.now() * 0.0002) * 15;
      camera.position.z = Math.cos(Date.now() * 0.0002) * 15;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      machines.forEach(machine => {
        machine.geometry.dispose();
        machine.material.dispose();
      });
      
      pipes.forEach(pipe => {
        pipe.line.geometry.dispose();
        pipe.line.material.dispose();
        
        pipe.packets.forEach(packet => {
          packet.mesh.geometry.dispose();
          packet.mesh.material.dispose();
        });
      });
      
      sensors.forEach(sensor => {
        sensor.mesh.geometry.dispose();
        sensor.mesh.material.dispose();
      });
      
      floor.geometry.dispose();
      floor.material.dispose();
      
      hub.geometry.dispose();
      hub.material.dispose();
      
      hubTop.geometry.dispose();
      hubTop.material.dispose();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.email || !credentials.password) {
        setError('Please enter both email and password');
        return;
    }

    try {
        // Manual validation
        let token = "dummy-token"; // Simulated token (can be removed if not needed)
        let role = null;

        if (credentials.email === "olive@gmail.com" && credentials.password === "123456789") {
            role = "SuperAdmin";
        } else {
            throw new Error();
        }

        // Store token & role
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // Refresh state to reflect login session
        window.location.reload();
    } catch (err) {
        setError('Invalid email or password');
    }
};


  return (
    <div className="login-alt-container light-theme">
      <div ref={threeContainerRef} className="three-background"></div>
      
      <div className="login-alt-card">
        <div className="login-alt-header">
          <div className="login-alt-logo">
            <div className="logo-badge">
              <Shield size={22} color='white'/>
            </div>
            <h1>Olive<span>IoT</span></h1>
          </div>
          <h5>Intelligent Power and energy analytics</h5>
          <p>Sign in to your account to access the dashboard</p>
        </div>

        {error && <div className="login-alt-error"><p>{error}</p></div>}

        <form onSubmit={handleSubmit} className="login-alt-form">
          <div className="login-alt-input-group">
            <div className="login-alt-input-wrapper">
              <div className="login-alt-input-icon"><User size={18} /></div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="login-alt-input-group">
            <div className="login-alt-input-wrapper">
              <div className="login-alt-input-icon"><Lock size={18} /></div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-alt-options">
            <label className="remember-option">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-option">Forgot password?</a>
          </div>

          <button type="submit" className="login-alt-button">
            <span>Sign In</span>
            <ChevronRight size={18} />
          </button>
        </form>

        <div className="login-alt-footer">
          <div className="login-alt-support">
            <p>© 2025 OliveIOT. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAlt;
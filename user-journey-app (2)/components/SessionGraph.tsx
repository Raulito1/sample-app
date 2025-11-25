import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  id: number;
  cluster: number;
}

interface SessionGraphProps {
  isPlaying: boolean;
  isDarkMode: boolean;
}

const SessionGraph: React.FC<SessionGraphProps> = ({ isPlaying, isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>(0);

  // Initialize Nodes
  useEffect(() => {
    const nodes: Node[] = [];
    const colors = ['#22d3ee', '#a855f7', '#f43f5e', '#10b981']; // Cyan, Purple, Rose, Emerald
    
    // Create clusters
    for (let i = 0; i < 4; i++) {
        const clusterX = Math.random() * 800 + 100;
        const clusterY = Math.random() * 600 + 100;
        const color = colors[i];

        for (let j = 0; j < 30; j++) {
            nodes.push({
                x: clusterX + (Math.random() - 0.5) * 200,
                y: clusterY + (Math.random() - 0.5) * 200,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: color,
                radius: Math.random() * 3 + 2,
                id: i * 30 + j,
                cluster: i
            });
        }
    }
    nodesRef.current = nodes;
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Resize
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
         canvas.width = canvas.clientWidth;
         canvas.height = canvas.clientHeight;
      }

      // Clear
      ctx.fillStyle = isDarkMode ? '#020617' : '#f8fafc'; // Slate 950 vs Slate 50
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Edges (Lines)
      ctx.lineWidth = 0.5;
      const nodes = nodesRef.current;
      
      for (let i = 0; i < nodes.length; i++) {
          const nodeA = nodes[i];
          
          // Move
          if (isPlaying) {
            nodeA.x += nodeA.vx;
            nodeA.y += nodeA.vy;

            // Bounce
            if (nodeA.x < 0 || nodeA.x > canvas.width) nodeA.vx *= -1;
            if (nodeA.y < 0 || nodeA.y > canvas.height) nodeA.vy *= -1;
          }

          // Draw connections to nearby nodes (Simulate graph edges)
          for (let j = i + 1; j < nodes.length; j++) {
             const nodeB = nodes[j];
             const dx = nodeA.x - nodeB.x;
             const dy = nodeA.y - nodeB.y;
             const dist = Math.sqrt(dx*dx + dy*dy);

             if (dist < 100) {
                 ctx.beginPath();
                 const opacity = (1 - dist/100) * 0.5;
                 ctx.strokeStyle = isDarkMode 
                    ? `rgba(148, 163, 184, ${opacity})` // Slate 400
                    : `rgba(100, 116, 139, ${opacity})`; // Slate 500
                 ctx.moveTo(nodeA.x, nodeA.y);
                 ctx.lineTo(nodeB.x, nodeB.y);
                 ctx.stroke();
             }
          }
      }

      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          
          // Glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = node.color;
          
          ctx.beginPath();
          ctx.fillStyle = node.color;
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, isDarkMode]);

  return (
    <canvas 
        ref={canvasRef} 
        className="w-full h-full block cursor-crosshair"
    />
  );
};

export default SessionGraph;
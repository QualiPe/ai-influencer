const { spawn } = require('child_process');

console.log('🚀 Starting AI Influencer Backend with INFT Integration...\n');

// Start the NestJS server
const server = spawn('npm', ['run', 'start:dev'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`\n🛑 Server stopped with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
  process.exit(0);
}); 
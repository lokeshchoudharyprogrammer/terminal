'use client';

// A lightweight browser-based Virtual Filesystem (VFS) and command emulator
export function initVFS() {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem('antigravity_vfs');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }
  const defaultVFS = {
    'README.md': '# Welcome to your Sandboxed Workspace\n\nYou are running inside a secure browser-based Web Sandbox context. No local VS Code installation is needed!',
    'src/index.js': '// Try writing some Javascript code here!\nconsole.log("Hello from Antigravity Virtual Sandbox Sandbox!");\n',
    'package.json': '{\n  "name": "sandboxed-app",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node src/index.js"\n  }\n}'
  };
  localStorage.setItem('antigravity_vfs', JSON.stringify(defaultVFS));
  return defaultVFS;
}

export function saveVFS(vfs) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('antigravity_vfs', JSON.stringify(vfs));
  }
}

export function executeSandboxCommand(cmdText, vfs, setVfs, onOutput, onDone) {
  const parts = cmdText.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  let isAsync = false;

  const print = (text) => {
    onOutput(text + '\n');
  };

  switch (command) {
    case 'ls': {
      const files = Object.keys(vfs);
      if (files.length === 0) {
        print('(empty directory)');
      } else {
        print('Files in sandboxed workspace:\n' + files.map(f => `📄 ${f}`).join('\n'));
      }
      break;
    }
    case 'mkdir': {
      print(`Created directory: ${args.join(' ')}`);
      break;
    }
    case 'touch': {
      const fileName = args[0] || 'untitled.js';
      const updated = { ...vfs };
      if (!updated[fileName]) {
        updated[fileName] = '';
        setVfs(updated);
        saveVFS(updated);
      }
      print(`Created empty file: ${fileName}`);
      break;
    }
    case 'cat': {
      const fileName = args[0];
      if (!fileName || !vfs[fileName]) {
        print(`cat: ${fileName || 'file'}: No such file or directory`);
      } else {
        print(vfs[fileName]);
      }
      break;
    }
    case 'rm': {
      const fileName = args[0];
      if (!fileName || !vfs[fileName]) {
        print(`rm: ${fileName || 'file'}: No such file`);
      } else {
        const updated = { ...vfs };
        delete updated[fileName];
        setVfs(updated);
        saveVFS(updated);
        print(`Removed file: ${fileName}`);
      }
      break;
    }
    case 'write': {
      const fileName = args[0];
      const content = args.slice(1).join(' ').replace(/^"(.*)"$/, '$1');
      if (!fileName) {
        print('write: specify filename');
      } else {
        const updated = { ...vfs };
        updated[fileName] = content;
        setVfs(updated);
        saveVFS(updated);
        print(`Wrote content to: ${fileName}`);
      }
      break;
    }
    case 'node': {
      const fileName = args[0];
      if (!fileName || !vfs[fileName]) {
        print(`node: ${fileName || 'file'}: Cannot find module`);
      } else {
        print(`[Node.js Engine] Executing ${fileName}...`);
        const originalLog = console.log;
        let logs = [];
        console.log = (...m) => logs.push(m.join(' '));
        try {
          const result = new Function(vfs[fileName])();
          console.log = originalLog;
          if (logs.length > 0) {
            print(logs.join('\n'));
          }
          if (result !== undefined) {
            print(`Returned: ${result}`);
          }
        } catch (err) {
          console.log = originalLog;
          print(`🔴 Runtime Error: ${err.message}`);
        }
      }
      break;
    }
    case 'npm': {
      const isInstall = args[0] === 'install' || args[0] === 'i';
      if (isInstall) {
        isAsync = true;
        const pkgName = args[1] || 'lucide-react';
        print(`[NPM Registry] Resolving dependency: ${pkgName}...`);
        
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          const bar = '█'.repeat(progress / 10) + '░'.repeat(10 - progress / 10);
          onOutput(`\r[NPM Installer] [${bar}] ${progress}% Fetching package...`);
          
          if (progress >= 100) {
            clearInterval(interval);
            onOutput('\n');
            
            // Add package to package.json
            const updated = { ...vfs };
            let pkgJson = {};
            try {
              pkgJson = JSON.parse(vfs['package.json'] || '{}');
            } catch (e) {}
            if (!pkgJson.dependencies) pkgJson.dependencies = {};
            pkgJson.dependencies[pkgName] = '^1.0.0';
            updated['package.json'] = JSON.stringify(pkgJson, null, 2);
            setVfs(updated);
            saveVFS(updated);
            
            onOutput(`✓ Added ${pkgName} to dependencies in package.json\n`);
            onOutput(`✓ npm install completed. Installed 1 package in 0.8s\n`);
            onDone(0);
          }
        }, 150);
      } else if (args[0] === 'run' || args[0] === 'start') {
        isAsync = true;
        const script = args[1] || 'start';
        print(`[NPM Package Runner] npm run ${script}`);
        if (script === 'start' && vfs['src/index.js']) {
          executeSandboxCommand('node src/index.js', vfs, setVfs, onOutput, onDone);
        } else {
          print('✓ npm build completed successfully (mocked).');
          onDone(0);
        }
      } else {
        print('npm install completed (packages fully cached).');
      }
      break;
    }
    case 'help': {
      print('Available sandboxed terminal commands:\n');
      print('  ls            - List files in virtual folder');
      print('  touch <file>  - Create a new virtual file');
      print('  cat <file>    - Read contents of a virtual file');
      print('  write <f> "c" - Write content to a file');
      print('  rm <file>     - Delete a virtual file');
      print('  node <file>   - Run a JS file in the emulated runner');
      print('  npm install <pkg> - Install npm package to package.json');
      print('  npm run dev   - Emulate developer bundler');
      break;
    }
    default: {
      isAsync = true;
      const lowerText = cmdText.toLowerCase();
      
      // If asking about models, quotas or limits, return the model quota list block
      if (lowerText.includes('quota') || lowerText.includes('limit') || lowerText.includes('model')) {
        const quotaLines = [
          '└ Model Quota',
          '',
          'Gemini 3.5 Flash (Medium)',
          '███████████ ███████████ ███████████ ███████████ ███████████ 100%',
          'Quota available',
          '',
          'Gemini 3.5 Flash (High)',
          '███████████ ███████████ ███████████ ███████████ ███████████ 100%',
          'Quota available',
          '',
          'Gemini 3.5 Flash (Low)',
          '███████████ ███████████ ███████████ ███████████ ███████████ 100%',
          'Quota available',
          '',
          'Gemini 3.1 Pro (Low)',
          '███████████ ███████████ ███████████ █████████ 75%',
          'Quota available'
        ];
        
        let lineIdx = 0;
        const interval = setInterval(() => {
          if (lineIdx < quotaLines.length) {
            onOutput(quotaLines[lineIdx] + '\n');
            lineIdx++;
          } else {
            clearInterval(interval);
            onDone(0);
          }
        }, 80);
      } else {
        // Stream back a simulated AI response with a typewriter effect
        const responseText = `Hello! I am your Antigravity AI coding assistant, running in **Browser-based Sandbox Mode** (since the local terminal WebSocket PTY is currently offline).\n\n` +
          `I can fully simulate coding tasks and terminal actions in this sandbox:\n` +
          `• **File Management**: Type \`touch index.js\` or \`write index.js "console.log('Hello world')"\`\n` +
          `• **Install Libraries**: Try installing dependencies, e.g. \`npm install lucide-react\`\n` +
          `• **Code execution**: Run virtual JS files via \`node index.js\` or \`npm run start\`\n\n` +
          `How can I help you build your application today?`;

        onOutput(`[Antigravity Sandbox Agent] Connecting to session...\n`);
        onOutput(`[Antigravity Sandbox Agent] Analyzing sandbox VFS context...\n\n`);

        const words = responseText.split(/(\s+)/);
        let wordIdx = 0;
        
        const interval = setInterval(() => {
          if (wordIdx < words.length) {
            onOutput(words[wordIdx]);
            wordIdx++;
          } else {
            clearInterval(interval);
            onOutput('\n');
            onDone(0);
          }
        }, 15);
      }
      break;
    }
  }

  if (!isAsync) {
    setTimeout(() => {
      onDone(0);
    }, 100);
  }
}

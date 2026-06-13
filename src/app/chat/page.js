'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Settings2,
  MessageSquare,
  Brain,
  TrendingUp,
  ListTodo,
  Pencil,
  Bell,
  FolderOpen,
  Shield,
  MessagesSquare,
  Target,
  ArrowUp,
  X,
  ChevronDown,
  Zap,
  Terminal,
  Copy,
  Clock,
  LogOut,
  DoorOpen,
  Home as HomeIcon
} from 'lucide-react';

import { initVFS, saveVFS, executeSandboxCommand } from './sandbox';
import { useRouter } from 'next/navigation';

// Full list of supported Slash Commands with icons & descriptions
const SLASH_COMMANDS = [
  { cmd: '/add-dir', desc: 'Add a directory to the workspace', icon: '📂' },
  { cmd: '/agents', desc: 'List available custom agents', icon: '🤖' },
  { cmd: '/artifact', desc: 'View and review artifacts', icon: '💎' },
  { cmd: '/btw', desc: 'Ask a side question without interrupting the task', icon: '💬' },
  { cmd: '/changelog', desc: 'View git commits and release history', icon: '📜' },
  { cmd: '/clear', desc: 'Clear conversation and start a new one', icon: '🧹' },
  { cmd: '/config', desc: 'Open settings and customize panel', icon: '⚙️' },
  { cmd: '/context', desc: 'Visualize current context window usage', icon: '🧠' },
  { cmd: '/copy', desc: 'Copy the last response to the clipboard', icon: '📋' },
  { cmd: '/credits', desc: 'Show developer and system credits', icon: '🎗️' },
  { cmd: '/diff', desc: 'View uncommitted git changes and diffs', icon: '🔄' },
  { cmd: '/exit', desc: 'Exit the dashboard session', icon: '🚪' },
  { cmd: '/fast', desc: 'Toggle fast direct execution mode', icon: '⚡' },
  { cmd: '/feedback', desc: 'Submit feedback to improve the agent', icon: '🗣️' },
  { cmd: '/fork', desc: 'Fork current chat into a new branch', icon: '🍴' },
  { cmd: '/help', desc: 'Show all available commands', icon: 'ℹ️' },
  { cmd: '/hooks', desc: 'Manage hook configurations for tool events', icon: '🪝' },
  { cmd: '/keybindings', desc: 'Set custom keyboard bindings', icon: '⌨️' },
  { cmd: '/logout', desc: 'Log out of the system session', icon: '🔒' },
  { cmd: '/mcp', desc: 'Manage MCP servers and integrations', icon: '🔌' },
  { cmd: '/model', desc: 'Change the running LLM model', icon: '🤖' },
  { cmd: '/open', desc: 'Open a workspace file in browser', icon: '📄' },
  { cmd: '/permissions', desc: 'Manage file and tool permissions', icon: '🛡️' },
  { cmd: '/planning', desc: 'Open interactive planner checklist', icon: '📋' },
  { cmd: '/rename', desc: 'Rename the current conversation', icon: '✏️' },
  { cmd: '/resume', desc: 'Browse and switch past conversations', icon: '📂' },
  { cmd: '/rewind', desc: 'Rewind conversation to a previous step', icon: '⏪' },
  { cmd: '/skills', desc: 'List available capabilities and skills', icon: '✨' },
  { cmd: '/statusline', desc: 'Toggle the visual statusline bar', icon: '📊' },
  { cmd: '/tasks', desc: 'View running background tasks', icon: '📋' },
  { cmd: '/title', desc: 'Toggle custom terminal window title', icon: '🏷️' },
  { cmd: '/usage', desc: 'View model quota usage details', icon: '📈' },
  { cmd: '/goal', desc: 'Run CLI until a specified goal is completed', icon: '🎯' },
  { cmd: '/schedule', desc: 'Set up a recurring cron task timer', icon: '📅' },
  { cmd: '/grill-me', desc: 'Start an alignment interview session', icon: '🔥' }
];

const SUGGESTIONS = [
  { title: 'Show Help Details', desc: 'Display all commands and flags', cmd: 'agy --help' },
  { title: 'Check CLI Version', desc: 'Verify installed version of agy', cmd: 'agy --version' },
  { title: 'List Running Agents', desc: 'Query active background agents', cmd: 'agy agent list' },
  { title: 'Run Interactive Mode', desc: 'Start default interactive session', cmd: 'agy run' }
];

const MODEL_DETAILS = {
  'Gemini 3.5 Flash (High)': {
    pricingModel: 'Gemini 3.5 Flash',
    creditLimit: '20.00',
    creditUsed: '5.80',
    creditsPercent: 71,
    maxContext: '128,000',
    usedContext: '8,204',
    contextPercent: 6.4,
    tokenText: '8,204 tokens / 128,000 max (6.4%)'
  },
  'Gemini 3.5 Flash (Medium)': {
    pricingModel: 'Gemini 3.5 Flash',
    creditLimit: '20.00',
    creditUsed: '8.50',
    creditsPercent: 57,
    maxContext: '128,000',
    usedContext: '12,044',
    contextPercent: 9.4,
    tokenText: '12,044 tokens / 128,000 max (9.4%)'
  },
  'Gemini 3.5 Flash (Low)': {
    pricingModel: 'Gemini 3.5 Flash',
    creditLimit: '20.00',
    creditUsed: '11.20',
    creditsPercent: 44,
    maxContext: '128,000',
    usedContext: '19,440',
    contextPercent: 15.2,
    tokenText: '19,440 tokens / 128,000 max (15.2%)'
  },
  'Gemini 3.1 Pro (High)': {
    pricingModel: 'Gemini 3.1 Pro',
    creditLimit: '50.00',
    creditUsed: '32.50',
    creditsPercent: 35,
    maxContext: '1,000,000',
    usedContext: '120,400',
    contextPercent: 12.0,
    tokenText: '120,400 tokens / 1,000,000 max (12.0%)'
  },
  'Gemini 3.1 Pro (Low)': {
    pricingModel: 'Gemini 3.1 Pro',
    creditLimit: '50.00',
    creditUsed: '42.10',
    creditsPercent: 15,
    maxContext: '1,000,000',
    usedContext: '45,000',
    contextPercent: 4.5,
    tokenText: '45,000 tokens / 1,000,000 max (4.5%)'
  },
  'Claude Sonnet 4.6 (Thinking)': {
    pricingModel: 'Anthropic Claude 3.5 Sonnet',
    creditLimit: '100.00',
    creditUsed: '42.50',
    creditsPercent: 57,
    maxContext: '200,000',
    usedContext: '45,200',
    contextPercent: 22.6,
    tokenText: '45,200 tokens / 200,000 max (22.6%)'
  },
  'Claude Opus 4.6 (Thinking)': {
    pricingModel: 'Anthropic Claude 3.0 Opus',
    creditLimit: '200.00',
    creditUsed: '145.00',
    creditsPercent: 27,
    maxContext: '200,000',
    usedContext: '92,400',
    contextPercent: 46.2,
    tokenText: '92,400 tokens / 200,000 max (46.2%)'
  },
  'GPT-OSS 120B (Medium)': {
    pricingModel: 'GPT-OSS 120B (Hosted)',
    creditLimit: '10.00',
    creditUsed: '1.50',
    creditsPercent: 85,
    maxContext: '32,768',
    usedContext: '10,400',
    contextPercent: 31.7,
    tokenText: '10,400 tokens / 32,768 max (31.7%)'
  }
};

// Clean raw PTY text
function renderCleanText(rawText) {
  if (!rawText) return '';
  // Strip ANSI escape codes
  let text = rawText.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  
  // Replace carriage return + newline (\r\n) with just newline (\n)
  text = text.replace(/\r\n/g, '\n');
  
  let lines = [''];
  let currentLineIdx = 0;
  let cursorX = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '\n') {
      lines.push('');
      currentLineIdx = lines.length - 1;
      cursorX = 0;
    } else if (char === '\r') {
      cursorX = 0;
    } else if (char === '\b') {
      if (cursorX > 0) {
        cursorX--;
      }
    } else {
      let line = lines[currentLineIdx];
      if (cursorX < line.length) {
        lines[currentLineIdx] = line.slice(0, cursorX) + char + line.slice(cursorX + 1);
      } else {
        lines[currentLineIdx] += char;
      }
      cursorX++;
    }
  }

  let clean = lines.join('\n');
  clean = clean.replace(/[\u2800-\u28FF]/g, ''); // strip spinners (Braille)
  clean = clean.replace(/─{4,}/g, ''); // strip horizontal lines
  clean = clean.replace(/={4,}/g, '');
  clean = clean.replace(/\n{3,}/g, '\n\n');
  return clean.trim();
}

function parseModelsQuota(text) {
  if (!text) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const models = [];
  let currentModel = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Model Quota')) continue;
    
    // Check if it is a model name line
    if (line.includes('Gemini') || line.includes('Claude') || line.includes('GPT')) {
      if (currentModel) {
        models.push(currentModel);
      }
      currentModel = { name: line, bar: '', percentage: '0%', status: '' };
    } else if (currentModel) {
      if (line.includes('%')) {
        const match = line.match(/(.*?)\s+(\d+)%/);
        if (match) {
          currentModel.bar = match[1].trim();
          currentModel.percentage = match[2] + '%';
        } else {
          currentModel.percentage = line.trim();
        }
      } else {
        currentModel.status = line;
      }
    }
  }
  if (currentModel) {
    models.push(currentModel);
  }
  return models;
}

export default function ChatPage() {
  const router = useRouter();
  const [vfs, setVfs] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('antigravity_user');
      if (!user) {
        router.push('/login');
      }
    }
    setVfs(initVFS());
  }, [router]);

  // Chat page — no landing state needed (landing is at root /)
  const [status, setStatus] = useState('connecting'); // connecting, connected, disconnected, error
  const [commandInput, setCommandInput] = useState('');
  const [isProcessActive, setIsProcessActive] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to Antigravity AI Assistant. Type '/' to see all slash commands or run a query directly.",
      isSystem: true
    }
  ]);

  // Model Selector dropdown state
  const [selectedModel, setSelectedModel] = useState('Gemini 3.5 Flash (High)');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const currentQuota = MODEL_DETAILS[selectedModel] || MODEL_DETAILS['Gemini 3.5 Flash (High)'];

  // Sidebar Chat History list
  const [chatHistory, setChatHistory] = useState([
    { id: '1', title: 'Show Help Details', cmd: 'agy --help' },
    { id: '2', title: 'Check CLI Version', cmd: 'agy --version' }
  ]);

  // Unified Control Center Modal State
  const [controlCenterTab, setControlCenterTab] = useState('settings'); // settings, workspace, capabilities, diagnostics, operations
  const [showControlCenter, setShowControlCenter] = useState(false);

  // Settings Panel Config (/config, /keybindings, /statusline, /title)
  const [settings, setSettings] = useState({
    theme: 'Dark Graphite',
    fontSize: '13px',
    autoPrependAgy: true,
    showStatusline: true,
    customTitle: 'Antigravity CLI Dashboard',
    keybindings: 'Standard VSCode'
  });

  // Workspace folders list (/add-dir)
  const [workspaceDirs, setWorkspaceDirs] = useState(['/Users/lokeshchoudhary/eksaq/scripts/terminal-ui']);
  const [newDirInput, setNewDirInput] = useState('');

  // Artifacts list (/artifact)
  const [artifacts, setArtifacts] = useState([
    { name: 'terminal_ui_implementation.md', path: 'brain/.../terminal_ui_implementation.md', size: '2.9 KB' }
  ]);

  // Hooks Configuration (/hooks)
  const [hooks, setHooks] = useState([
    { event: 'on_command_run', script: 'log_history.sh', enabled: true },
    { event: 'on_error_throw', script: 'notify_developer.sh', enabled: false }
  ]);

  // MCP Servers (/mcp)
  const [mcpServers, setMcpServers] = useState([
    { name: 'chrome-devtools', status: 'connected', type: 'MCP server' },
    { name: 'firebase-basics', status: 'connected', type: 'MCP server' },
    { name: 'google-antigravity-sdk', status: 'idle', type: 'MCP server' }
  ]);

  // Skills List (/skills)
  const [skills, setSkills] = useState([
    { name: 'troubleshooting', desc: 'Diagnose terminal connections' },
    { name: 'chrome-devtools', desc: 'Debug web page interactions' },
    { name: 'firebase-firestore', desc: 'Manage NoSQL Cloud databases' }
  ]);

  // Simulated Active Tasks (/tasks)
  const [tasks, setTasks] = useState([
    { id: '1', name: 'Git Listener', status: 'watching', time: 'Active' },
    { id: '2', name: 'Background Bundler', status: 'idle', time: 'Paused' }
  ]);

  // Interactive Scheduler (/schedule, /goal)
  const [schedules, setSchedules] = useState([]);
  const [activeGoal, setActiveGoal] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [scheduleInput, setScheduleInput] = useState({ task: '', cron: '' });

  // Floating "/btw" side-chat drawer
  const [showBtwChat, setShowBtwChat] = useState(false);
  const [btwInput, setBtwInput] = useState('');
  const [btwMessages, setBtwMessages] = useState([
    { role: 'assistant', content: 'Ask me any quick question side-by-side without cluttering your main task!' }
  ]);

  // "/rename" inline state
  const [showRename, setShowRename] = useState(false);
  const [currentSessionTitle, setCurrentSessionTitle] = useState('Antigravity Session 1');
  const [renameInput, setRenameInput] = useState('Antigravity Session 1');

  // "/resume" and "/rewind" drawers
  const [showResume, setShowResume] = useState(false);
  const [showRewind, setShowRewind] = useState(false);
  const [pastSessions, setPastSessions] = useState([
    { id: 'session_1', title: 'Antigravity Session 1', lastActive: '10m ago' },
    { id: 'session_2', title: 'Firebase Deployment Setup', lastActive: '2h ago' }
  ]);

  // Fast mode flag (/fast)
  const [fastMode, setFastMode] = useState(false);

  // Slash commands dropdown autocomplete
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [filteredSlashCmds, setFilteredSlashCmds] = useState(SLASH_COMMANDS);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState('');

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const btwMessagesEndRef = useRef(null);

  const typingQueueRef = useRef('');
  const typingTimerRef = useRef(null);
  const isProcessActiveRef = useRef(false);

  useEffect(() => {
    isProcessActiveRef.current = isProcessActive;
  }, [isProcessActive]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  const startTypingTimer = () => {
    if (typingTimerRef.current) return;
    typingTimerRef.current = setInterval(() => {
      if (typingQueueRef.current.length > 0) {
        const chunkSize = 4;
        const chunk = typingQueueRef.current.slice(0, chunkSize);
        typingQueueRef.current = typingQueueRef.current.slice(chunkSize);

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant' && !last.isMeta && !last.isError && !last.isSystem) {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk
            };
          }
          return updated;
        });
      } else if (!isProcessActiveRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 15);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessActive]);

  useEffect(() => {
    btwMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [btwMessages]);

  useEffect(() => {
    if (commandInput.startsWith('/')) {
      const query = commandInput.toLowerCase();
      const filtered = SLASH_COMMANDS.filter(item => 
        item.cmd.toLowerCase().startsWith(query) || 
        item.desc.toLowerCase().includes(query)
      );
      setFilteredSlashCmds(filtered);
      setShowSlashMenu(filtered.length > 0);
    } else {
      setShowSlashMenu(false);
    }
  }, [commandInput]);

  useEffect(() => {
    let wsUrl = process.env.NEXT_PUBLIC_PTY_SERVER_URL;
    if (wsUrl) {
      wsUrl = wsUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
      const separator = wsUrl.includes('?') ? '&' : '?';
      wsUrl = `${wsUrl}${separator}mode=chat`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}/api/pty?mode=chat`;
    }
    const originSep = wsUrl.includes('?') ? '&' : '?';
    wsUrl = `${wsUrl}${originSep}origin=${encodeURIComponent(window.location.origin)}`;
    console.log('[PTY Chat] Connecting to:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'output') {
          const rawStripped = msg.data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
          const isLimitDetect = rawStripped.includes('Refreshes in') || rawStripped.includes('0%') || rawStripped.includes('░░░');

          if (isLimitDetect) {
            // Bypass typewriter queue for quota limits so they display instantly!
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant' && !last.isMeta && !last.isError && !last.isSystem) {
                const updated = [...prev];
                const newRaw = (last.raw || '') + msg.data;
                const cleanText = renderCleanText(newRaw);
                const lines = rawStripped.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.includes('Refreshes in') || l.includes('0%') || l.includes('░'));
                const quotaText = lines.length > 0 ? lines.join('\n') : last.quotaText;
                
                updated[updated.length - 1] = {
                  ...last,
                  raw: newRaw,
                  content: cleanText,
                  isQuotaLimit: true,
                  quotaText: quotaText || cleanText
                };
                return updated;
              } else {
                let quotaText = '';
                const lines = rawStripped.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.includes('Refreshes in') || l.includes('0%') || l.includes('░'));
                quotaText = lines.join('\n');
                return [
                  ...prev,
                  { 
                    role: 'assistant', 
                    raw: msg.data, 
                    content: renderCleanText(msg.data),
                    isQuotaLimit: true,
                    quotaText: quotaText
                  }
                ];
              }
            });
          } else {
            // For normal output, push it to typing queue
            const cleanChunk = renderCleanText(msg.data);
            typingQueueRef.current += cleanChunk;
            startTypingTimer();

            // Still track the raw accumulation in state but do not overwrite visible content
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant' && !last.isMeta && !last.isError && !last.isSystem) {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...last,
                  raw: (last.raw || '') + msg.data
                };
                return updated;
              } else {
                return [
                  ...prev,
                  { role: 'assistant', raw: msg.data, content: '' }
                ];
              }
            });
          }
        } else if (msg.type === 'done') {
          setIsProcessActive(false);
          if (msg.exitCode !== 0) {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: `*[Process completed with exit code ${msg.exitCode}]*`, isMeta: true }
            ]);
          }
        } else if (msg.type === 'error') {
          setIsProcessActive(false);
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `⚠️ Error: ${msg.message}`, isError: true }
          ]);
        }
      } catch (err) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'assistant' && !last.isMeta && !last.isError && !last.isSystem) {
            const updated = [...prev];
            const newRaw = (last.raw || '') + event.data;
            updated[updated.length - 1] = {
              ...last,
              raw: newRaw,
              content: renderCleanText(newRaw)
            };
            return updated;
          } else {
            return [
              ...prev,
              { role: 'assistant', raw: event.data, content: renderCleanText(event.data) }
            ];
          }
        });
      }
    };

    ws.onerror = () => setStatus('error');
    ws.onclose = () => setStatus('disconnected');

    return () => {
      ws.close();
    };
  }, []);

  const handleSendCommand = (cmdText = commandInput) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    // INTERCEPT SLASH COMMANDS LOCALLY
    if (trimmed.startsWith('/')) {
      const parts = trimmed.split(' ');
      const mainCmd = parts[0];
      const argument = parts.slice(1).join(' ');

      if (mainCmd === '/clear') {
        handleNewSession();
        setCommandInput('');
        return;
      } else if (mainCmd === '/config') {
        setControlCenterTab('settings');
        setShowControlCenter(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/tasks') {
        setControlCenterTab('operations');
        setShowControlCenter(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/model') {
        if (argument) {
          handleSelectModel(argument);
        } else {
          setShowModelDropdown(true);
          setIsProcessActive(true);
          setMessages((prev) => [
            ...prev,
            { role: 'user', content: '/model' },
            { role: 'assistant', raw: '', content: '' }
          ]);
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'run', command: 'agy models' }));
          }
        }
        setCommandInput('');
        return;
      } else if (mainCmd === '/usage') {
        setControlCenterTab('diagnostics');
        setShowControlCenter(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/context') {
        setControlCenterTab('diagnostics');
        setShowControlCenter(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/agents' || mainCmd === '/skills' || mainCmd === '/mcp' || mainCmd === '/permissions') {
        setControlCenterTab('capabilities');
        setShowControlCenter(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/open' || mainCmd === '/add-dir' || mainCmd === '/artifact' || mainCmd === '/diff' || mainCmd === '/changelog' || mainCmd === '/fork') {
        setControlCenterTab('workspace');
        setShowControlCenter(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/schedule' || mainCmd === '/goal') {
        setControlCenterTab('operations');
        setShowControlCenter(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/copy') {
        // Copy last assistant reply to clipboard
        const assistantMsgs = messages.filter(m => m.role === 'assistant' && !m.isSystem && !m.isMeta);
        const lastMsg = assistantMsgs[assistantMsgs.length - 1];
        if (lastMsg) {
          navigator.clipboard.writeText(lastMsg.content);
          showToast('📋 Copied last response to clipboard!');
        } else {
          showToast('⚠️ No response found to copy.');
        }
        setCommandInput('');
        return;
      } else if (mainCmd === '/btw') {
        setShowBtwChat(true);
        if (argument) {
          handleSendBtw(argument);
        }
        setCommandInput('');
        return;
      } else if (mainCmd === '/rename') {
        if (argument) {
          setCurrentSessionTitle(argument);
          setRenameInput(argument);
          showToast(`✏️ Renamed session to: "${argument}"`);
        } else {
          setShowRename(true);
        }
        setCommandInput('');
        return;
      } else if (mainCmd === '/resume') {
        setShowResume(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/rewind') {
        setShowRewind(true);
        setCommandInput('');
        return;
      } else if (mainCmd === '/fast') {
        setFastMode(!fastMode);
        showToast(fastMode ? '⚡ Fast Mode disabled' : '⚡ Fast Mode active');
        setCommandInput('');
        return;
      } else if (mainCmd === '/logout') {
        showToast('🔒 Logging out session...');
        setTimeout(() => window.location.reload(), 1000);
        setCommandInput('');
        return;
      } else if (mainCmd === '/exit') {
        showToast('🚪 Closing dashboard workspace...');
        setTimeout(() => {
          setMessages([{ role: 'assistant', content: 'Session ended. You can close this tab.', isSystem: true }]);
          setIsProcessActive(false);
        }, 1000);
        setCommandInput('');
        return;
      } else if (mainCmd === '/grill-me') {
        // Start interview state inside chat
        setMessages(prev => [
          ...prev,
          { role: 'user', content: '/grill-me' },
          { 
            role: 'assistant', 
            content: `🔥 **Antigravity Interactive Alignment Interview (/grill-me)**\n\n1. *Question 1*: What is the primary architecture of your workspace application?\n   *(Type your answer in the box below)*` 
          }
        ]);
        setCommandInput('');
        return;
      } else if (mainCmd === '/help') {
        setMessages(prev => [
          ...prev,
          { role: 'user', content: '/help' },
          { 
            role: 'assistant', 
            isSystem: true,
            content: `Here are all available slash commands:\n\n${SLASH_COMMANDS.map(c => `${c.icon} **${c.cmd}**: ${c.desc}`).join('\n')}` 
          }
        ]);
        setCommandInput('');
        return;
      }
    }

    // Standard WebSocket command sending or Sandbox execution fallback
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (isProcessActive) {
        wsRef.current.send(JSON.stringify({ type: 'input', data: `${trimmed}\n` }));
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: trimmed }
        ]);
      } else {
        let targetCommand = trimmed;
        
        const isPlainPrompt = (cmd) => {
          const lower = cmd.toLowerCase().trim();
          const knownCommandPrefixes = [
            'git', 'npm', 'node', 'yarn', 'deno', 'bun', 'python', 'pip', 
            'cargo', 'docker', 'ls', 'cd', 'pwd', 'cat', 'echo', 'mkdir', 
            'rm', 'grep', 'find', 'curl', 'wget', 'chmod', 'chown', 'which'
          ];
          
          if (knownCommandPrefixes.some(prefix => lower.startsWith(prefix + ' ') || lower === prefix)) {
            return false;
          }
          
          const agySubcommands = [
            'changelog', 'models', 'plugin', 'plugins', 'update', 'agent', 'run', 'install', 'help'
          ];
          
          if (lower.startsWith('agy ')) {
            const afterAgy = lower.slice(4).trim();
            if (afterAgy.startsWith('-') || agySubcommands.some(sub => afterAgy.startsWith(sub + ' ') || afterAgy === sub)) {
              return false;
            }
            return true;
          }
          
          return settings.autoPrependAgy;
        };

        if (isPlainPrompt(trimmed)) {
          let promptContent = trimmed;
          if (trimmed.toLowerCase().startsWith('agy ')) {
            promptContent = trimmed.slice(4).trim();
          }
          const escapedPrompt = promptContent.replace(/"/g, '\\"');
          targetCommand = `agy --model '${selectedModel}' --print "${escapedPrompt}"`;
        }

        setIsProcessActive(true);
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: trimmed },
          { role: 'assistant', raw: '', content: '' }
        ]);

        wsRef.current.send(JSON.stringify({ type: 'run', command: targetCommand }));

        // Add to history
        const newHist = {
          id: Date.now().toString(),
          title: targetCommand,
          cmd: targetCommand
        };
        setChatHistory((prev) => [newHist, ...prev.slice(0, 9)]);
      }
      setCommandInput('');
    } else {
      // In-browser virtual sandbox fallback!
      if (isProcessActive) {
        showToast('⚠️ Process is already running in Sandbox.');
      } else {
        setIsProcessActive(true);
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: trimmed },
          { role: 'assistant', raw: '', content: 'Loading sandbox context...' }
        ]);

        executeSandboxCommand(
          trimmed,
          vfs,
          setVfs,
          (chunk) => {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant' && !last.isMeta && !last.isError && !last.isSystem) {
                const updated = [...prev];
                const cleanText = (last.content === 'Loading sandbox context...' ? '' : last.content) + chunk;
                updated[updated.length - 1] = {
                  ...last,
                  content: cleanText
                };
                return updated;
              }
              return prev;
            });
          },
          (exitCode) => {
            setIsProcessActive(false);
          }
        );

        // Add to history
        const newHist = {
          id: Date.now().toString(),
          title: trimmed,
          cmd: trimmed
        };
        setChatHistory((prev) => [newHist, ...prev.slice(0, 9)]);
      }
      setCommandInput('');
    }
  };

  const handleCancelProcess = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'cancel' }));
      setIsProcessActive(false);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '*[Process cancelled]*', isMeta: true }
      ]);
    }
  };

  const handleNewSession = () => {
    handleCancelProcess();
    setMessages([
      {
        role: 'assistant',
        content: "Session reset. What CLI command would you like to run next? (Type '/' for suggestions)",
        isSystem: true
      }
    ]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('antigravity_selected_model');
      if (stored) {
        setSelectedModel(stored);
      }
    }
  }, []);

  const handleSelectModel = (modelName) => {
    setSelectedModel(modelName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('antigravity_selected_model', modelName);
    }
    setShowModelDropdown(false);
    showToast(`🤖 Switched model to: ${modelName}`);

    setMessages(prev => [
      ...prev,
      { role: 'user', content: `/model ${modelName}` },
      { role: 'assistant', content: `*[System switched LLM inference to ${modelName}]*`, isMeta: true }
    ]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'input', data: `/model ${modelName}\n` }));
    }
  };

  // "/btw" Side Chat Messaging
  const handleSendBtw = (text = btwInput) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setBtwMessages(prev => [
      ...prev,
      { role: 'user', content: trimmed }
    ]);
    setBtwInput('');

    // Simulated helper answer
    setTimeout(() => {
      setBtwMessages(prev => [
        ...prev,
        { role: 'assistant', content: `This is a side-channel query. The main PTY execution remains active in the background. Answer to "${trimmed}": Antigravity handles files relative to your current workspace root.` }
      ]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCommand();
    }
  };

  const handleAddDirectory = () => {
    if (newDirInput.trim()) {
      setWorkspaceDirs([...workspaceDirs, newDirInput.trim()]);
      showToast(`📂 Added workspace directory: ${newDirInput.trim()}`);
      setNewDirInput('');
    }
  };

  const handleAddSchedule = () => {
    if (scheduleInput.task && scheduleInput.cron) {
      setSchedules([...schedules, { ...scheduleInput, id: Date.now() }]);
      showToast(`📅 Scheduled task: ${scheduleInput.task}`);
    }
  };

  const handleSaveGoal = () => {
    if (goalInput.trim()) {
      setActiveGoal(goalInput.trim());
      showToast(`🎯 Tracking goal: "${goalInput.trim()}"`);
      setGoalInput('');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#06070a] text-[#ececf1] overflow-hidden font-sans select-none relative">
      {/* Glow Blobs for Dashboard */}
      <div className="bg-glow-container pointer-events-none opacity-20">
        <div className="glow-blob glow-blob-1"></div>
        <div className="glow-blob glow-blob-2"></div>
      </div>
      
      {/* Grid Overlays */}
      <div className="line-grid opacity-15"></div>
      <div className="dot-grid opacity-25"></div>

      {/* Toast Notification Box */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#090a0f]/95 border border-zinc-800 rounded-xl shadow-2xl px-4 py-3 text-xs font-semibold text-indigo-300 flex items-center gap-2 animate-fade-in-up backdrop-blur-xl">
          <Bell className="w-3.5 h-3.5" />
          {toastMessage}
        </div>
      )}

      {/* 1. Left Sidebar */}
      <aside className="w-[280px] bg-[#090a0f]/90 backdrop-blur-md flex flex-col h-full border-r border-zinc-900 shrink-0 hidden md:flex z-10">
        {/* New Session Controls */}
        <div className="p-3.5 flex gap-2">
          <button 
            onClick={handleNewSession}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900/80 hover:border-zinc-700/80 text-xs font-semibold transition-all cursor-pointer text-white"
          >
            <PlusCircle className="w-3.5 h-3.5" /> New Chat
          </button>
          <button 
            onClick={() => setShowControlCenter(true)}
            className="px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900/80 hover:border-zinc-700/80 text-xs font-semibold cursor-pointer text-white transition-all"
            title="Open Control Center"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Saved Commands / Sessions */}
        <div className="overflow-y-auto px-3 py-2 flex flex-col gap-1.5 scrollbar-thin">
          <div className="flex justify-between items-center px-3 py-1">
            <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider font-mono">Recent Commands</span>
            <button onClick={() => setShowResume(true)} className="text-[10px] text-zinc-400 hover:text-white cursor-pointer font-medium">Browse All</button>
          </div>
          {chatHistory.map((hist) => (
            <button
              key={hist.id}
              onClick={() => handleSendCommand(hist.cmd)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent hover:border-zinc-900/50 text-left transition-all truncate font-mono cursor-pointer"
              title={hist.cmd}
            >
              <MessageSquare className="w-3 h-3 text-zinc-600 shrink-0" />
              <span className="truncate flex-1">{hist.title}</span>
            </button>
          ))}
        </div>

        {/* Quota & Context Usage Cards (/usage & /context) */}
        <div className="px-4 py-2 mt-2 flex flex-col gap-3">
          <div className="glass-panel p-3.5 border-zinc-900 bg-zinc-950/20 cursor-pointer hover:border-indigo-500/20" onClick={() => { setControlCenterTab('diagnostics'); setShowControlCenter(true); }}>
            <div className="flex justify-between items-center mb-1.5 text-[11px]">
              <span className="text-zinc-450 font-medium flex items-center gap-1.5"><Brain className="w-3 h-3" /> Context Window (/context)</span>
              <span className="font-mono text-indigo-300 font-bold">{currentQuota.usedContext} / {currentQuota.maxContext}</span>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900/60">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: `${currentQuota.contextPercent}%` }}></div>
            </div>
          </div>

          <div className="glass-panel p-3.5 border-zinc-900 bg-zinc-950/20 cursor-pointer hover:border-emerald-500/20" onClick={() => { setControlCenterTab('diagnostics'); setShowControlCenter(true); }}>
            <div className="flex justify-between items-center mb-1.5 text-[11px]">
              <span className="text-zinc-450 font-medium flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Quota Credits (/usage)</span>
              <span className="font-mono text-emerald-400 font-bold">${(parseFloat(currentQuota.creditLimit) - parseFloat(currentQuota.creditUsed)).toFixed(2)} left</span>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900/60">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full" style={{ width: `${currentQuota.creditsPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Active Tasks Widget (/tasks) */}
        <div className="px-4 py-2 flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider font-mono">Background Tasks (/tasks)</span>
            <button onClick={() => { setControlCenterTab('operations'); setShowControlCenter(true); }} className="text-[10px] text-zinc-400 hover:text-white cursor-pointer font-medium">Configure</button>
          </div>
          <div className="flex flex-col gap-1.5">
            {tasks.map(t => (
              <div key={t.id} className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-950/20 border border-zinc-900 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'watching' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-650'}`}></span>
                  <span className="font-mono font-medium text-zinc-350">{t.name}</span>
                </div>
                <span className="text-zinc-500 font-semibold">{t.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Card */}
        <div className="p-3.5 border-t border-zinc-900 mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-900/60 transition-colors cursor-pointer" onClick={() => setShowRename(true)}>
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-650 flex items-center justify-center font-bold text-xs text-white">
                AG
              </div>
              <div className="flex-1 truncate">
                <p className="text-xs font-semibold text-white truncate">{currentSessionTitle}</p>
                <p className="text-[9.5px] text-zinc-500 truncate font-mono">Rename conversation (/rename)</p>
              </div>
            </div>
            <Pencil className="w-3 h-3 text-zinc-550" />
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('antigravity_user');
              router.push('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:bg-rose-950/20 hover:border-rose-900/40 hover:text-rose-400 text-xs font-semibold transition-all cursor-pointer text-zinc-400"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Conversational Panel */}
      <main className="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden z-10">
        
        {/* Model Selector Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-900 bg-[#06070a]/65 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/35 bg-zinc-950/25 hover:bg-zinc-900/80 text-sm font-semibold transition-all cursor-pointer text-white shadow-[0_0_15px_rgba(16,185,129,0.02)]"
              >
                <span>
                  {selectedModel.includes('Claude Sonnet') ? '🧡' : 
                   selectedModel.includes('Claude Opus') ? '🔥' : 
                   selectedModel.includes('Gemini 3.1') ? '💎' : 
                   selectedModel.includes('Gemini 3.5') ? '⚡' : '⚙️'}{' '}
                  {selectedModel}{' '}
                  <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] ml-1.5 uppercase px-1.5 py-0.5 rounded font-sans tracking-wider shadow-sm">Free</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              
              {showModelDropdown && (
                <div className="absolute top-11 left-0 w-80 bg-[#090a0f]/95 border border-zinc-800/80 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 z-20 select-none max-h-80 overflow-y-auto scrollbar-thin backdrop-blur-xl">
                  <button 
                    onClick={() => handleSelectModel('Gemini 3.5 Flash (High)')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-900 flex flex-col cursor-pointer transition-colors"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="font-semibold text-white">⚡ Gemini 3.5 Flash (High)</span>
                      <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] px-2 py-0.5 rounded font-sans tracking-wide shadow-[0_0_8px_rgba(16,185,129,0.3)]">[Free]</span>
                    </span>
                    <span className="text-[10px] text-zinc-450">Current active model</span>
                  </button>
                  <button 
                    onClick={() => handleSelectModel('Gemini 3.5 Flash (Medium)')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-900 flex flex-col cursor-pointer transition-colors"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="font-semibold text-white">⚡ Gemini 3.5 Flash (Medium)</span>
                      <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] px-2 py-0.5 rounded font-sans tracking-wide shadow-[0_0_8px_rgba(16,185,129,0.3)]">[Free]</span>
                    </span>
                    <span className="text-[10px] text-zinc-450">Balanced performance & latency</span>
                  </button>
                  <button 
                    onClick={() => handleSelectModel('Gemini 3.5 Flash (Low)')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-900 flex flex-col cursor-pointer transition-colors"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="font-semibold text-white">⚡ Gemini 3.5 Flash (Low)</span>
                      <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] px-2 py-0.5 rounded font-sans tracking-wide shadow-[0_0_8px_rgba(16,185,129,0.3)]">[Free]</span>
                    </span>
                    <span className="text-[10px] text-zinc-450">Resource saver configuration</span>
                  </button>
                  <button 
                    onClick={() => handleSelectModel('Gemini 3.1 Pro (High)')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-900 flex flex-col cursor-pointer transition-colors"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="font-semibold text-white">💎 Gemini 3.1 Pro (High)</span>
                      <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] px-2 py-0.5 rounded font-sans tracking-wide shadow-[0_0_8px_rgba(16,185,129,0.3)]">[Free]</span>
                    </span>
                    <span className="text-[10px] text-zinc-450">Advanced reasoning & agent actions</span>
                  </button>
                  <button 
                    onClick={() => handleSelectModel('Gemini 3.1 Pro (Low)')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-900 flex flex-col cursor-pointer transition-colors"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="font-semibold text-white">💎 Gemini 3.1 Pro (Low)</span>
                      <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] px-2 py-0.5 rounded font-sans tracking-wide shadow-[0_0_8px_rgba(16,185,129,0.3)]">[Free]</span>
                    </span>
                    <span className="text-[10px] text-zinc-450">Compact pro reasoning mode</span>
                  </button>
                  <button 
                    onClick={() => handleSelectModel('Claude Sonnet 4.6 (Thinking)')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-900 flex flex-col cursor-pointer transition-colors"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="font-semibold text-white">🧡 Claude Sonnet 4.6 (Thinking)</span>
                      <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] px-2 py-0.5 rounded font-sans tracking-wide shadow-[0_0_8px_rgba(16,185,129,0.3)]">[Free]</span>
                    </span>
                    <span className="text-[10px] text-zinc-450">Thinking capabilities enabled</span>
                  </button>
                  <button 
                    onClick={() => handleSelectModel('Claude Opus 4.6 (Thinking)')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-900 flex flex-col cursor-pointer transition-colors"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="font-semibold text-white">🔥 Claude Opus 4.6 (Thinking)</span>
                      <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] px-2 py-0.5 rounded font-sans tracking-wide shadow-[0_0_8px_rgba(16,185,129,0.3)]">[Free]</span>
                    </span>
                    <span className="text-[10px] text-zinc-450">Extra deep reasoning model</span>
                  </button>
                  <button 
                    onClick={() => handleSelectModel('GPT-OSS 120B (Medium)')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-900 flex flex-col cursor-pointer transition-colors"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="font-semibold text-white">⚙️ GPT-OSS 120B (Medium)</span>
                      <span className="text-[9px] font-extrabold text-[#06070a] bg-[#10b981] px-2 py-0.5 rounded font-sans tracking-wide shadow-[0_0_8px_rgba(16,185,129,0.3)]">[Free]</span>
                    </span>
                    <span className="text-[10px] text-zinc-450">Open-source hosted variant</span>
                  </button>
                </div>
              )}
            </div>
            <span className="text-zinc-800">|</span>
            <span className="font-bold text-xs text-zinc-400 font-mono hidden sm:inline tracking-wide">{settings.customTitle}</span>
          </div>

          {/* Quick Toolbar Modals triggers */}
          <div className="flex items-center gap-2.5">
            {fastMode && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-bold tracking-wider animate-pulse">
                <Zap className="w-2.5 h-2.5" /> FAST MODE ACTIVE
              </span>
            )}
            {/* Back to Home */}
            <Link
              href="/"
              className="px-2.5 py-1 rounded-lg bg-zinc-900/40 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer border border-zinc-800/60 flex items-center gap-1.5"
              title="Back to Landing Page"
            >
              <HomeIcon className="w-3 h-3" /> Home
            </Link>

            {/* Connection Indicators */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/60 border border-zinc-850 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-400 text-[10px]">Ready</span>
            </div>
          </div>
        </header>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto w-full flex flex-col items-center">
          {activeGoal && (
            <div className="w-full max-w-3xl px-4 mt-4 shrink-0">
              <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 text-indigo-300 text-xs flex justify-between items-center shadow-xl">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" />
                  <span>Active Goal (/goal): <strong>"{activeGoal}"</strong></span>
                </div>
                <button onClick={() => setActiveGoal('')} className="text-indigo-400 hover:text-white font-bold cursor-pointer">Clear</button>
              </div>
            </div>
          )}

          <div className="w-full max-w-3xl flex flex-col flex-1 px-4 py-8">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`py-6 flex gap-4 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start border-b border-zinc-900/30'}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0">
                    α
                  </div>
                )}

                <div className={`max-w-[85%] flex flex-col gap-1.5 ${msg.role === 'user' ? 'bg-[#121320]/80 text-white px-4 py-3 rounded-2xl border border-indigo-500/15 shadow-[0_4px_20px_rgba(99,102,241,0.03)]' : 'text-zinc-200'}`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap select-text font-medium">{msg.content}</p>
                  ) : (
                    <div className="select-text w-full">
                      {msg.isMeta ? (
                        <p className="text-xs text-zinc-550 italic font-mono">{msg.content}</p>
                      ) : msg.isError ? (
                        <p className="text-rose-400 font-semibold">{msg.content}</p>
                      ) : msg.isSystem ? (
                        <div className="leading-relaxed whitespace-pre-line text-zinc-300 font-medium">{msg.content}</div>
                      ) : (
                        // Normal ChatGPT-style prose response
                        <div className="w-full flex flex-col gap-2">
                          <div className="leading-7 text-zinc-200 text-sm whitespace-pre-wrap select-text prose-sm">
                            {(() => {
                              const isModelsList = msg.content && msg.content.includes('Model Quota');
                              const isQuotaLimit = !isModelsList && (msg.isQuotaLimit || (msg.content && (msg.content.includes('Refreshes in') || msg.content.includes('░░░') || msg.content.includes('0%'))));

                              if (isModelsList) {
                                return (
                                  <div className="w-full max-w-lg p-5 rounded-2xl border border-zinc-850 bg-zinc-950/90 shadow-2xl flex flex-col gap-4 my-2 select-text">
                                    <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
                                      <Brain className="w-4 h-4 text-indigo-400" />
                                      <span className="font-bold text-sm text-white tracking-wide">Model Quotas & Limits Status</span>
                                    </div>
                                    <div className="flex flex-col gap-3.5">
                                      {parseModelsQuota(msg.content).map((m, idx) => {
                                        const isAvailable = m.status.toLowerCase().includes('available');
                                        const percentVal = parseInt(m.percentage) || 0;
                                        return (
                                          <div key={idx} className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-800/40">
                                            <div className="flex items-center justify-between text-xs">
                                              <span className="font-semibold text-zinc-200">{m.name}</span>
                                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide ${isAvailable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                                {m.status}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                              <div className="flex-1 h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                                <div 
                                                  className={`h-full rounded-full transition-all duration-500 ${isAvailable ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'}`} 
                                                  style={{ width: `${percentVal}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] font-mono font-bold text-zinc-400 shrink-0 w-8 text-right">{m.percentage || '0%'}</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              }

                              if (isQuotaLimit) {
                                return (
                                  <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 text-amber-300 flex flex-col gap-2 shadow-lg my-1 max-w-md">
                                    <div className="flex items-center gap-2 font-semibold">
                                      <Zap className="w-4 h-4 text-amber-400 animate-pulse animate-duration-1000" />
                                      <span>Model Quota Limit Exceeded</span>
                                    </div>
                                    <p className="text-xs text-zinc-400">
                                      You have completed the free quota limit for this model. Please switch to another model or wait for the refresh window.
                                    </p>
                                    <div className="text-xs font-mono bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-900 text-amber-200/90 mt-1 select-text">
                                      {msg.quotaText || (msg.content && msg.content.trim()) || 'Refreshes in 3h 40m'}
                                    </div>
                                  </div>
                                );
                              }

                              const isLastMessage = i === messages.length - 1;
                              const isStreaming = isLastMessage && isProcessActive;

                              if (msg.content) {
                                const renderSegments = msg.content.split('```').map((segment, si) => {
                                  if (si % 2 === 1) {
                                    // Code block segment
                                    const lines = segment.split('\n');
                                    const lang = lines[0]?.trim() || 'code';
                                    const code = lines.slice(1).join('\n');
                                    return (
                                      <div key={si} className="my-3 rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-900/60">
                                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{lang}</span>
                                          <button
                                            onClick={() => { navigator.clipboard.writeText(code); showToast('Copied code!'); }}
                                            className="text-[10px] text-zinc-550 hover:text-zinc-300 font-mono transition-colors cursor-pointer select-none"
                                          >Copy</button>
                                        </div>
                                        <pre className="whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto max-h-[480px]">{code}</pre>
                                      </div>
                                    );
                                  }
                                  // Plain text segment — render inline `code` spans
                                  return (
                                    <span key={si}>
                                      {segment.split('`').map((part, pi) =>
                                        pi % 2 === 1
                                          ? <code key={pi} className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-300 text-[0.78em] font-mono border border-zinc-700/60">{part}</code>
                                          : <span key={pi}>{part}</span>
                                      )}
                                    </span>
                                  );
                                });

                                return (
                                  <>
                                    {renderSegments}
                                    {isStreaming && (
                                      <span className="inline-block w-1.5 h-3.5 bg-indigo-400 ml-1 animate-pulse rounded-full align-middle"></span>
                                    )}
                                  </>
                                );
                              }
                              
                              return <span className="text-zinc-500 italic text-xs">Generating response...</span>;
                            })()}
                          </div>
                          {msg.content && 
                           !msg.isQuotaLimit && 
                           !msg.content.includes('Model Quota') && 
                           !(msg.content.includes('Refreshes in') || msg.content.includes('░░░') || msg.content.includes('0%')) && (
                            <button
                              onClick={() => { navigator.clipboard.writeText(msg.content); showToast('Copied response!'); }}
                              className="self-start mt-1 text-[10px] text-zinc-600 hover:text-zinc-400 font-mono transition-colors cursor-pointer flex items-center gap-1 select-none"
                            >
                              <Copy className="w-2.5 h-2.5" /> Copy
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessActive && (
              <div className="py-6 flex gap-4 text-sm justify-start border-b border-zinc-900/30">
                <div className="w-8 h-8 rounded-lg bg-indigo-650/15 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0 animate-pulse">
                  α
                </div>
                <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-zinc-950/30 border border-zinc-850/80 text-xs text-zinc-400 font-medium font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-1 text-[10px]">agy running...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions Grid */}
        {messages.length === 1 && (
          <div className="w-full max-w-2xl mx-auto px-4 pb-4 animate-fade-in shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full text-left">
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleSendCommand(sug.cmd);
                  }}
                  className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/30 hover:bg-zinc-900/60 transition-all text-zinc-350 flex flex-col gap-0.5 hover:border-zinc-800 duration-200 cursor-pointer"
                >
                  <span className="font-semibold text-xs text-zinc-200">{sug.title}</span>
                  <span className="text-[10px] text-zinc-550 font-mono">{sug.cmd}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Autocomplete slash menu */}
        {showSlashMenu && (
          <div className="w-full max-w-3xl mx-auto px-4 relative shrink-0 z-20">
            <div className="absolute bottom-2 left-4 right-4 bg-[#090a0f]/95 border border-zinc-800/80 rounded-2xl shadow-2xl p-2 flex flex-col gap-0.5 max-h-56 overflow-y-auto scrollbar-thin backdrop-blur-xl">
              <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 border-b border-zinc-900 mb-1.5 font-mono">Autocomplete Slash Commands</span>
              {filteredSlashCmds.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCommandInput(item.cmd + ' ');
                    setShowSlashMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs hover:bg-zinc-900/80 flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{item.icon}</span>
                    <span className="font-mono font-bold text-zinc-200 group-hover:text-white">{item.cmd}</span>
                  </div>
                  <span className="text-zinc-500 text-[11px] font-medium">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <footer className="w-full flex flex-col items-center px-4 md:px-0 pb-6 shrink-0 bg-transparent relative z-10">
          <div className="w-full max-w-3xl relative">
            
            <div className="relative flex items-center w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-xl shadow-2xl focus-within:border-indigo-500/40 focus-within:shadow-[0_0_24px_rgba(99,102,241,0.04)] transition-all">
              <textarea
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isProcessActive ? "Process is running. Type input and press Enter..." : "Ask the CLI or type '/' for slash commands..."}
                rows={1}
                className="w-full bg-transparent outline-none resize-none py-4 pl-4 pr-24 text-sm text-white placeholder-zinc-550"
                style={{ maxHeight: '180px' }}
              />
              
              <div className="absolute right-3 flex items-center gap-2">
                {isProcessActive && (
                  <button
                    onClick={handleCancelProcess}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition-all text-xs font-semibold cursor-pointer"
                    title="Stop process (Ctrl+C)"
                  >
                    Stop
                  </button>
                )}
                
                <button
                  onClick={() => handleSendCommand()}
                  disabled={!commandInput.trim()}
                  className={`p-2 rounded-xl text-white transition-all flex items-center justify-center ${commandInput.trim() ? 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-zinc-850 text-zinc-650 cursor-not-allowed border border-zinc-900/60'}`}
                  title="Submit"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Visual Statusline (/statusline) */}
            {settings.showStatusline && (
              <div className="flex justify-between items-center text-[10px] text-zinc-550 px-2 mt-3 select-none font-mono">
                <span>Model: {selectedModel}</span>
                <span>Workspace: {status === 'connected' ? 'terminal-ui (PTY Live)' : 'Browser Sandbox VFS'}</span>
                <span>Mode: {fastMode ? 'Fast ⚡' : 'Normal'}</span>
              </div>
            )}
          </div>
        </footer>
      </main>

      {/* ================= FLOATING WIDGETS ================= */}

      {/* Floating Side Chat Widget (/btw) */}
      {showBtwChat && (
        <div className="fixed bottom-24 right-6 w-85 h-[420px] bg-[#090a0f]/95 border border-zinc-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 backdrop-blur-xl animate-fade-in-up">
          <div className="p-3.5 border-b border-zinc-900 bg-zinc-950/40 flex justify-between items-center text-xs font-bold text-white select-none">
            <span className="flex items-center gap-1.5"><MessagesSquare className="w-3.5 h-3.5" /> Side-Chat (/btw)</span>
            <button onClick={() => setShowBtwChat(false)} className="text-zinc-550 hover:text-white transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin">
            {btwMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-md' : 'bg-zinc-900/60 border border-zinc-850/60 text-zinc-350'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={btwMessagesEndRef} />
          </div>
          <div className="p-3.5 border-t border-zinc-900 bg-zinc-950/20 flex gap-2">
            <input 
              value={btwInput}
              onChange={(e) => setBtwInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendBtw()}
              placeholder="Ask side question..."
              className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-2.5 text-xs text-white outline-none placeholder-zinc-650 transition-all focus:border-indigo-500/40"
            />
            <button 
              onClick={() => handleSendBtw()}
              className="bg-indigo-650 hover:bg-indigo-500 px-4 py-2.5 rounded-xl text-xs text-white font-semibold cursor-pointer transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* ================= MODALS OVERLAYS ================= */}

      {/* 1. Unified Control Center Modal */}
      {showControlCenter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-container w-full max-w-3xl h-[65vh] border-white/10 flex overflow-hidden animate-fade-in">
            {/* Sidebar Tabs */}
            <div className="w-56 bg-zinc-950/40 border-r border-white/[0.06] flex flex-col p-4 gap-1 select-none">
              <h3 className="text-xs font-bold text-zinc-550 uppercase tracking-widest px-3.5 py-2 mb-2 font-mono">Control Center</h3>
              <button 
                onClick={() => setControlCenterTab('settings')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${controlCenterTab === 'settings' ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20' : 'text-zinc-450 hover:bg-zinc-900'}`}
              >
                <Settings2 className="w-3 h-3 inline mr-1.5" />Settings & System
              </button>
              <button 
                onClick={() => setControlCenterTab('diagnostics')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${controlCenterTab === 'diagnostics' ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20' : 'text-zinc-450 hover:bg-zinc-900'}`}
              >
                <Brain className="w-3 h-3 inline mr-1.5" />Diagnostics & Quota
              </button>
              
              <button 
                onClick={() => { setShowControlCenter(false); handleSendCommand('/exit'); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors mt-auto cursor-pointer"
              >
                <DoorOpen className="w-3 h-3 inline mr-1.5" />Exit CLI Bridge (/exit)
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-zinc-900/10">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-3 mb-5 shrink-0">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {controlCenterTab === 'settings' && 'Settings & Keybindings'}
                  {controlCenterTab === 'diagnostics' && 'Quota & Token Diagnostics'}
                </h4>
                <button onClick={() => setShowControlCenter(false)} className="text-zinc-500 hover:text-white cursor-pointer transition-colors"><X className="w-3.5 h-3.5" /></button>
              </div>

              {/* Settings & System Tab */}
              {controlCenterTab === 'settings' && (
                <div className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-450 font-medium">Layout Theme</label>
                    <select 
                      value={settings.theme} 
                      onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                      className="bg-zinc-950 border border-zinc-850/80 p-2.5 rounded-xl text-zinc-200 outline-none focus:border-indigo-500/40 text-xs transition-all"
                    >
                      <option>Dark Graphite</option>
                      <option>Midnight Blue</option>
                      <option>Deep Emerald</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-450 font-medium">Text Display Size</label>
                    <select 
                      value={settings.fontSize} 
                      onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                      className="bg-zinc-950 border border-zinc-850/80 p-2.5 rounded-xl text-zinc-200 outline-none font-mono focus:border-indigo-500/40 text-xs transition-all"
                    >
                      <option value="11px">11px (Tiny)</option>
                      <option value="13px">13px (Default)</option>
                      <option value="15px">15px (Large)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-t border-zinc-900/60">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">Auto Prepend 'agy'</span>
                      <span className="text-[10px] text-zinc-550">Automatically adds agy prefix to commands</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.autoPrependAgy}
                      onChange={(e) => setSettings({ ...settings, autoPrependAgy: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-indigo-500 rounded border-zinc-800 bg-zinc-950"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-b border-zinc-900/60">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">Show Statusline Bar (/statusline)</span>
                      <span className="text-[10px] text-zinc-550">Displays workspace state information</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.showStatusline}
                      onChange={(e) => setSettings({ ...settings, showStatusline: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-indigo-500 rounded border-zinc-800 bg-zinc-950"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-455 font-medium">Keybinding Mode (/keybindings)</label>
                    <select 
                      value={settings.keybindings} 
                      onChange={(e) => setSettings({ ...settings, keybindings: e.target.value })}
                      className="bg-zinc-950 border border-zinc-850/80 p-2.5 rounded-xl text-zinc-200 outline-none focus:border-indigo-500/40 text-xs transition-all"
                    >
                      <option>Standard VSCode</option>
                      <option>Emacs Bindings</option>
                      <option>Vim Normal Mode</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-455 font-medium">Dashboard Window Title (/title)</label>
                    <input 
                      value={settings.customTitle}
                      onChange={(e) => setSettings({ ...settings, customTitle: e.target.value })}
                      className="bg-zinc-950 border border-zinc-850/80 p-2.5 rounded-xl text-zinc-200 outline-none focus:border-indigo-500/40 text-xs transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Workspace Tab */}
              {controlCenterTab === 'workspace' && (
                <div className="flex flex-col gap-5 text-xs">
                  {/* Workspace dirs (/add-dir) */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-300 font-mono">Workspace Directories (/add-dir)</span>
                    <div className="flex gap-2">
                      <input 
                        value={newDirInput}
                        onChange={(e) => setNewDirInput(e.target.value)}
                        placeholder="Add absolute folder path..."
                        className="flex-1 bg-zinc-950 border border-zinc-850/80 p-2.5 rounded-xl text-zinc-200 outline-none focus:border-indigo-500/40 text-xs transition-all placeholder-zinc-650"
                      />
                      <button onClick={handleAddDirectory} className="glass-button px-4.5 py-2.5 font-semibold text-white cursor-pointer">Add</button>
                    </div>
                    <div className="flex flex-col gap-1 mt-1.5">
                      {workspaceDirs.map((dir, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-900 font-mono text-[10.5px] text-zinc-400">
                          {dir}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Artifacts view (/artifact) */}
                  <div className="flex flex-col gap-2 border-t border-zinc-900/60 pt-4">
                    <span className="font-bold text-zinc-300 font-mono">Artifacts Registry (/artifact)</span>
                    <div className="flex flex-col gap-2">
                      {artifacts.map((art, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-955 border border-zinc-900">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{art.name}</span>
                            <span className="text-[10px] text-zinc-550 font-mono">{art.path}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 text-[10px] font-mono">{art.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Virtual Filesystem Files Tree (Cloud Sandbox) */}
                  <div className="flex flex-col gap-2 border-t border-zinc-900/60 pt-4">
                    <span className="font-bold text-zinc-300 font-mono">Virtual Sandbox Files Explorer</span>
                    <div className="flex flex-col gap-2">
                      {Object.keys(vfs).length === 0 ? (
                        <span className="text-zinc-500 italic text-[11px]">No virtual files in sandbox yet. Use `touch filename` in terminal!</span>
                      ) : (
                        Object.entries(vfs).map(([filename, content], idx) => (
                          <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-900">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-zinc-200">📄 {filename}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">Size: {content.length} characters</span>
                            </div>
                            <div className="flex gap-1.5">
                              <button 
                                onClick={() => {
                                  setMessages(prev => [
                                    ...prev,
                                    { role: 'user', content: `cat ${filename}` },
                                    { role: 'assistant', content: `### ${filename}\n\`\`\`javascript\n${content}\n\`\`\`` }
                                  ]);
                                  setShowControlCenter(false);
                                }}
                                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-indigo-400 font-semibold cursor-pointer"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => {
                                  const updated = { ...vfs };
                                  delete updated[filename];
                                  setVfs(updated);
                                  saveVFS(updated);
                                  showToast(`Removed file: ${filename}`);
                                }}
                                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-rose-400 font-semibold cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Changelog & Git status (/changelog, /diff, /fork) */}
                  <div className="flex flex-col gap-2 border-t border-zinc-900/60 pt-4">
                    <span className="font-bold text-zinc-300 font-mono">Git Branches & Diffs (/diff, /fork, /changelog)</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setShowControlCenter(false); setShowDiff(true); }} className="glass-button flex-1 py-2.5 font-semibold text-zinc-350 cursor-pointer">View Git Diff</button>
                      <button onClick={() => { showToast('🍴 Forked session to workspace branch: "patch-1"'); }} className="glass-button flex-1 py-2.5 font-semibold text-zinc-355 cursor-pointer">Fork Session (/fork)</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Capabilities Tab */}
              {controlCenterTab === 'capabilities' && (
                <div className="flex flex-col gap-5 text-xs">
                  {/* Skills List (/skills) */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-300 font-mono">System capabilities & Skills (/skills)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {skills.map((s, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-zinc-955 border border-zinc-900">
                          <div className="font-semibold text-white font-mono">{s.name}</div>
                          <div className="text-[10px] text-zinc-550 mt-0.5">{s.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MCP Servers (/mcp) */}
                  <div className="flex flex-col gap-2 border-t border-zinc-900/60 pt-4">
                    <span className="font-bold text-zinc-300 font-mono">Model Context Protocol Servers (/mcp)</span>
                    <div className="flex flex-col gap-1.5">
                      {mcpServers.map((server, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-955 border border-zinc-900">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white font-mono">{server.name}</span>
                            <span className="text-[10px] text-zinc-550">{server.type}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${server.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                            {server.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permissions (/permissions) */}
                  <div className="flex flex-col gap-2 border-t border-zinc-900/60 pt-4">
                    <span className="font-bold text-zinc-300 font-mono">Tool Permission Presets (/permissions)</span>
                    <button onClick={() => { setShowControlCenter(false); setShowPermissions(true); }} className="glass-button w-full py-2.5 font-semibold text-zinc-350 cursor-pointer">Configure Security Settings</button>
                  </div>
                </div>
              )}

              {/* Diagnostics Tab */}
              {controlCenterTab === 'diagnostics' && (
                <div className="flex flex-col gap-5 text-xs">
                  {/* Quotas & Credits (/usage, /credits) */}
                  <div className="flex flex-col gap-3">
                    <span className="font-bold text-zinc-300 font-mono">Usage & Credits (/usage, /credits) - {selectedModel}</span>
                    <div className="p-4 rounded-xl bg-zinc-955 border border-zinc-900 flex flex-col gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1.5 font-mono text-zinc-400">
                          <span>API Credits Left:</span>
                          <span className="text-emerald-400 font-bold">
                            ${(parseFloat(currentQuota.creditLimit) - parseFloat(currentQuota.creditUsed)).toFixed(2)} left / ${currentQuota.creditLimit} limits
                          </span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-850/50">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${currentQuota.creditsPercent}%` }}></div>
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-550 border-t border-zinc-900/60 pt-2 flex justify-between">
                        <span>Pricing Model: {currentQuota.pricingModel}</span>
                        <span>Credits reset monthly</span>
                      </div>
                    </div>
                  </div>

                  {/* Context Window (/context) */}
                  <div className="flex flex-col gap-3 border-t border-zinc-900/60 pt-4">
                    <span className="font-bold text-zinc-300 font-mono">Context Window Visualizer (/context)</span>
                    <div className="p-4 rounded-xl bg-zinc-955 border border-zinc-900 flex flex-col gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1.5 font-mono text-zinc-400">
                          <span>Token Window Size:</span>
                          <span className="text-indigo-400 font-bold">{currentQuota.tokenText}</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-850/50">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${currentQuota.contextPercent}%` }}></div>
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-550 border-t border-zinc-900/60 pt-2">
                        System automatically prunes distant buffer logs to maintain tokens below threshold.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Operations Tab */}
              {controlCenterTab === 'operations' && (
                <div className="flex flex-col gap-5 text-xs">
                  {/* Goal configuration (/goal) */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-300 font-mono">Define Specified Goal (/goal)</span>
                    <div className="flex gap-2">
                      <input 
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        placeholder="Task will run continuously until this is completed..."
                        className="flex-1 bg-zinc-950 border border-zinc-850/80 p-2.5 rounded-xl text-zinc-200 outline-none focus:border-indigo-500/40 text-xs transition-all placeholder-zinc-650"
                      />
                      <button onClick={handleSaveGoal} className="glass-button px-4.5 py-2.5 font-semibold text-white cursor-pointer">Set Goal</button>
                    </div>
                  </div>

                  {/* Scheduler (/schedule) */}
                  <div className="flex flex-col gap-2 border-t border-zinc-900/60 pt-4">
                    <span className="font-bold text-zinc-300 font-mono">Recurring Task Scheduler (/schedule)</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input 
                          value={scheduleInput.task}
                          onChange={(e) => setScheduleInput({ ...scheduleInput, task: e.target.value })}
                          placeholder="Task command (e.g. agy test)"
                          className="flex-1 bg-zinc-950 border border-zinc-850/80 p-2.5 rounded-xl text-zinc-250 outline-none text-xs focus:border-indigo-500/40 transition-all placeholder-zinc-600"
                        />
                        <input 
                          value={scheduleInput.cron}
                          onChange={(e) => setScheduleInput({ ...scheduleInput, cron: e.target.value })}
                          placeholder="Cron expression (e.g. */5 * * * *)"
                          className="w-48 bg-zinc-950 border border-zinc-850/80 p-2.5 rounded-xl text-zinc-250 outline-none text-xs focus:border-indigo-500/40 transition-all placeholder-zinc-600"
                        />
                      </div>
                      <button onClick={handleAddSchedule} className="glass-button w-full py-2.5 font-bold text-zinc-350 cursor-pointer">Schedule Timer</button>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-2">
                      {schedules.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-955 border border-zinc-900">
                          <span className="font-mono font-semibold text-zinc-300">{s.task}</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-500 font-mono border border-zinc-850">{s.cron}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 2. Resume Conversations list Drawer (/resume) */}
      {showResume && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
          <div className="w-80 bg-[#090a0f]/95 border-r border-zinc-900 h-full p-5 flex flex-col gap-4 animate-fade-in-right backdrop-blur-xl">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-widest font-mono">Saved Conversations</h3>
              <button onClick={() => setShowResume(false)} className="text-zinc-550 hover:text-white cursor-pointer transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {pastSessions.map(sess => (
                <button
                  key={sess.id}
                  onClick={() => {
                    setCurrentSessionTitle(sess.title);
                    setRenameInput(sess.title);
                    setShowResume(false);
                    showToast(`📂 Resumed conversation: "${sess.title}"`);
                  }}
                  className="w-full text-left p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900 hover:bg-zinc-900/60 hover:border-zinc-800/60 transition-all flex flex-col gap-1 cursor-pointer"
                >
                  <span className="font-semibold text-xs text-zinc-200">{sess.title}</span>
                  <span className="text-[10px] text-zinc-550 font-mono">{sess.lastActive}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Rewind step Drawer (/rewind) */}
      {showRewind && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-container w-full max-w-md p-6 border-white/10 flex flex-col gap-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono"><Clock className="w-3.5 h-3.5" /> Rewind Chat Step (/rewind)</h3>
              <button onClick={() => setShowRewind(false)} className="text-zinc-550 hover:text-white cursor-pointer transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              Rewind the conversation back to a previous prompt to undo tools and execution steps:
            </p>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {messages.filter(m => m.role === 'user').map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    // Truncate messages after this index
                    const targetIdx = messages.indexOf(m);
                    setMessages(prev => prev.slice(0, targetIdx + 1));
                    setShowRewind(false);
                    showToast('⏪ Rewound conversation successfully.');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-zinc-950/40 border border-zinc-900 hover:bg-zinc-900/65 hover:border-zinc-800 hover:text-white transition-all text-xs font-mono truncate text-zinc-350 cursor-pointer"
                >
                  {m.content}
                </button>
              ))}
              {messages.filter(m => m.role === 'user').length === 0 && (
                <div className="text-xs text-zinc-600 italic py-4">No prompts to rewind to</div>
              )}
            </div>

            <button 
              onClick={() => setShowRewind(false)}
              className="glass-button w-full py-3 font-bold text-xs cursor-pointer text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 4. Rename Popup dialog (/rename) */}
      {showRename && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-container w-full max-w-sm p-6 border-white/10 flex flex-col gap-4 animate-fade-in">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2"><Pencil className="w-3.5 h-3.5" /> Rename Session</h3>
            <input 
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              placeholder="Session title..."
              className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500/40 transition-all"
            />
            <div className="flex gap-2.5">
              <button onClick={() => setShowRename(false)} className="glass-button flex-1 py-2.5 font-semibold text-xs text-zinc-350 cursor-pointer">Cancel</button>
              <button 
                onClick={() => {
                  setCurrentSessionTitle(renameInput.trim());
                  setShowRename(false);
                  showToast(`✏️ Renamed session to: "${renameInput.trim()}"`);
                }}
                className="glass-button glass-button-primary flex-1 py-2.5 font-semibold text-xs text-white cursor-pointer"
              >
                Save Rename
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

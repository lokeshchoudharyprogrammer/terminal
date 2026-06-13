'use client';

import Link from 'next/link';
import { 
  Check,
  CheckCircle2,
  ArrowRight, 
  ExternalLink, 
  Cpu, 
  Brain, 
  Shield, 
  Plug, 
  History, 
  ListTodo,
  Zap,
  BrainCircuit,
  Flame,
  Gem,
  Bot,
  Sparkles,
  Terminal,
  GitBranch,
  Lock,
  Users,
  Server,
  BarChart3,
  BookOpen,
  Mail
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-150 font-sans selection:bg-emerald-500 selection:text-white relative overflow-y-auto scrollbar-thin">
      {/* Glow Blobs */}
      <div className="bg-glow-container pointer-events-none">
        <div className="glow-blob glow-blob-1 opacity-25" style={{ background: 'radial-gradient(circle, #10b981 0%, rgba(16, 185, 129, 0) 70%)' }}></div>
        <div className="glow-blob glow-blob-2 opacity-20" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, rgba(139, 92, 246, 0) 70%)' }}></div>
        <div className="glow-blob glow-blob-3 opacity-15" style={{ background: 'radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 210, 0) 70%)' }}></div>
      </div>

      {/* Grid Overlays */}
      <div className="line-grid opacity-50"></div>
      <div className="dot-grid opacity-60"></div>

      {/* 1. Header/Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900/60 bg-[#06070a]/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-violet-650 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15 L85 75 L15 75 Z" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" fill="none" />
                <circle cx="50" cy="53" r="10" fill="currentColor" />
              </svg>
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-white font-mono">Antigravity AI</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#models" className="hover:text-white transition-colors">Models</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              Docs <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Launch CTA */}
          <div>
            <Link 
              href="/chat"
              className="glass-button inline-flex items-center justify-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 cursor-pointer transition-all duration-300"
            >
              <Terminal className="w-3.5 h-3.5" />
              Launch Console
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 text-center flex flex-col items-center gap-7 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-[10px] font-bold text-emerald-300 tracking-wide uppercase shadow-[0_0_15px_rgba(16,185,129,0.08)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 8 FLAGSHIP MODELS NOW 100% FREE
        </div>
        
        <h1 className="max-w-4xl text-5xl md:text-7.5xl font-extrabold tracking-tight leading-[1.10] text-white font-sans animate-fade-in">
          AI-powered coding, <span className="bg-gradient-to-r from-emerald-400 via-teal-350 to-violet-400 bg-clip-text text-transparent glow-text-cyan">completely unlocked</span>.
        </h1>
        
        <p className="max-w-2xl text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
          The premium agentic AI coding workspace. Connect your local terminal to an advanced Web UI with real-time token counters, background agents, and secure local sandboxing.
        </p>

        {/* Model Class Cards (5 models) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl w-full mt-4">
          {/* Claude Opus 4.6 (Thinking) */}
          <div className="flex flex-col justify-between p-4.5 rounded-2xl border border-orange-500/15 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.04)] text-left group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <BrainCircuit className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[8.5px] font-black text-orange-950 bg-orange-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans shadow-sm">Free</span>
            </div>
            <div>
              <div className="text-xs font-bold text-orange-400 group-hover:text-orange-350 transition-colors">Claude Opus 4.6 (Thinking)</div>
              <div className="text-[9.5px] text-zinc-400 mt-1 leading-relaxed">Anthropic's flagship logical reasoning & coding leader.</div>
            </div>
          </div>
          
          {/* Claude Sonnet 4.6 (Thinking)
 */}
          <div className="flex flex-col justify-between p-4.5 rounded-2xl border border-red-500/15 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.04)] text-left group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[8.5px] font-black text-red-950 bg-red-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans shadow-sm">Free</span>
            </div>
            <div>
              <div className="text-xs font-bold text-red-400 group-hover:text-red-350 transition-colors">Claude Sonnet 4.6 (Thinking)
</div>
              <div className="text-[9.5px] text-zinc-400 mt-1 leading-relaxed">Deep reasoning power for comprehensive project tasks.</div>
            </div>
          </div>

          {/* Gemini 3.1 Pro */}
          <div className="flex flex-col justify-between p-4.5 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.04)] text-left group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <Gem className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[8.5px] font-black text-cyan-950 bg-cyan-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans shadow-sm">Free</span>
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400 group-hover:text-cyan-350 transition-colors">Gemini 3.1 Pro</div>
              <div className="text-[9.5px] text-zinc-400 mt-1 leading-relaxed">Premier reasoning engine with 1M token context capacity.</div>
            </div>
          </div>

          {/* Gemini 3.5 Flash */}
          <div className="flex flex-col justify-between p-4.5 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.04)] text-left group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[8.5px] font-black text-emerald-950 bg-emerald-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans shadow-sm">Free</span>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-350 transition-colors">Gemini 3.5 Flash</div>
              <div className="text-[9.5px] text-zinc-400 mt-1 leading-relaxed">Google's fast, low-latency code iteration specialist.</div>
            </div>
          </div>

          {/* GPT-OSS 120B */}
          <div className="flex flex-col justify-between p-4.5 rounded-2xl border border-slate-500/15 bg-slate-500/5 hover:bg-slate-500/10 hover:border-slate-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(100,116,139,0.04)] text-left group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <Bot className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[8.5px] font-black text-slate-950 bg-slate-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans shadow-sm">Free</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 group-hover:text-slate-350 transition-colors">GPT-OSS 120B</div>
              <div className="text-[9.5px] text-zinc-400 mt-1 leading-relaxed">Hosted open-source champion for offline autonomy.</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link 
            href="/chat"
            className="glass-button-primary px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-2 group"
            style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(139, 92, 246, 0.35) 100%)', borderColor: 'rgba(139, 92, 246, 0.45)' }}
          >
            Start Chatting Free
            <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#models"
            className="glass-button px-8 py-3.5 rounded-xl text-sm font-bold text-zinc-350 hover:text-white transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Explore Free Models
          </a>
        </div>

        {/* Floating UI Mockup */}
        <div className="w-full max-w-5xl mt-16 rounded-2xl border border-zinc-800 bg-[#0c0d12]/75 backdrop-blur-sm p-3.5 shadow-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-violet-600 rounded-2xl opacity-12 blur-xl group-hover:opacity-18 transition-opacity pointer-events-none"></div>
          {/* Window bar */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-zinc-900/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-wider">Dashboard Preview</span>
            <div className="w-12"></div>
          </div>
          {/* Mockup Body */}
          <div className="grid grid-cols-4 h-[380px] text-left rounded-b-xl overflow-hidden bg-[#07080c]/85">
            {/* Sidebar Mock */}
            <div className="col-span-1 border-r border-zinc-900/75 p-4 flex flex-col gap-4 bg-[#090a0e]/90">
              <div className="h-6 bg-zinc-900/70 border border-zinc-800/40 rounded-lg w-full"></div>
              <div className="flex flex-col gap-2.5 mt-4">
                <div className="h-4 bg-zinc-900/50 rounded-md w-4/5"></div>
                <div className="h-4 bg-zinc-900/50 rounded-md w-11/12"></div>
                <div className="h-4 bg-zinc-900/50 rounded-md w-3/4"></div>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex flex-col gap-1.5">
                  <div className="h-2.5 bg-emerald-400/30 rounded w-1/2"></div>
                  <div className="h-1.5 bg-emerald-400/20 rounded w-full"></div>
                </div>
                <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/15 flex flex-col gap-1.5">
                  <div className="h-2.5 bg-violet-400/30 rounded w-2/3"></div>
                  <div className="h-1.5 bg-violet-400/20 rounded w-full"></div>
                </div>
              </div>
            </div>
            {/* Chat Panel Mock */}
            <div className="col-span-3 p-6 flex flex-col justify-between relative bg-transparent">
              {/* Chat items */}
              <div className="flex flex-col gap-4 overflow-y-hidden">
                <div className="flex justify-end">
                  <div className="bg-[#121320]/80 border border-emerald-500/15 px-4 py-2.5 rounded-2xl text-[11px] max-w-[70%] text-zinc-100 shadow-sm">
                    How do I set up a local workspace directory using slash commands?
                  </div>
                </div>
                <div className="flex justify-start gap-2.5">
                  <div className="w-6.5 h-6.5 rounded-full bg-emerald-650/15 border border-emerald-500/20 flex items-center justify-center font-bold text-[10px] text-emerald-400">α</div>
                  <div className="bg-zinc-950/70 border border-zinc-900/80 px-4 py-3 rounded-2xl text-[11px] font-mono text-zinc-300 max-w-[80%] flex flex-col gap-1.5 shadow-sm">
                    <span className="text-zinc-400">Use the <span className="text-emerald-400">/add-dir</span> command. Syntax:</span>
                    <span className="text-emerald-450 font-bold">$ /add-dir /path/to/project</span>
                  </div>
                </div>
              </div>
              {/* Chat input mockup */}
              <div className="border border-zinc-900 p-2.5 rounded-xl bg-zinc-950/50 flex items-center justify-between mt-auto">
                <span className="text-[11px] text-zinc-650 font-medium">Type your query or '/' to open command suggestions...</span>
                <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-[10px] text-white">↑</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Models Showcase Section */}
      <section id="models" className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900/50 relative z-10">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Industry Leading Models</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Choose from 8 Flagship LLM Configurations</h2>
          <p className="max-w-xl text-zinc-400 text-xs md:text-sm font-medium leading-relaxed">
            Why pay subscription fees? We provide direct, unlocked access to the best reasoning, speed, and intelligence configurations in the world at zero cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gemini 3.5 Flash (High) */}
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/20 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between h-56 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 text-[8.5px] font-black text-emerald-400 uppercase tracking-wider font-sans">
              Free
            </div>
            <div className="flex flex-col gap-2.5 text-left">
              <Zap className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-extrabold text-white text-base">Gemini 3.5 Flash (High)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Google's flagship speed model configured at high parameters. Designed for rapid prompt-and-run code iterations and instant terminal updates.
              </p>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono mt-2 text-left">
              Context Window: 128,000 max tokens
            </span>
          </div>

          {/* Gemini 3.5 Flash (Medium) */}
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/20 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between h-56 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 text-[8.5px] font-black text-emerald-400 uppercase tracking-wider font-sans">
              Free
            </div>
            <div className="flex flex-col gap-2.5 text-left">
              <Zap className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-extrabold text-white text-base">Gemini 3.5 Flash (Medium)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Balanced latency configuration. Excellent general-purpose model for parsing code lists, checking lint status, and generating components.
              </p>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono mt-2 text-left">
              Context Window: 128,000 max tokens
            </span>
          </div>

          {/* Gemini 3.5 Flash (Low) */}
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/20 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between h-56 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 text-[8.5px] font-black text-emerald-400 uppercase tracking-wider font-sans">
              Free
            </div>
            <div className="flex flex-col gap-2.5 text-left">
              <Zap className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-extrabold text-white text-base">Gemini 3.5 Flash (Low)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Resource-saving speed configuration. Optimizes server latency for simple, straightforward terminal lookups and command checks.
              </p>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono mt-2 text-left">
              Context Window: 128,000 max tokens
            </span>
          </div>

          {/* Gemini 3.1 Pro (High) */}
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/20 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between h-56 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full border border-cyan-500/35 bg-cyan-500/10 text-[8.5px] font-black text-cyan-400 uppercase tracking-wider font-sans">
              Free
            </div>
            <div className="flex flex-col gap-2.5 text-left">
              <Gem className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-extrabold text-white text-base">Gemini 3.1 Pro (High)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Google's premier reasoning engine with high parameter tolerance. Unmatched context size, allowing you to feed in entire folder structures.
              </p>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono mt-2 text-left">
              Context Window: 1,000,000 max tokens
            </span>
          </div>

          {/* Gemini 3.1 Pro (Low) */}
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/20 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between h-56 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full border border-cyan-500/35 bg-cyan-550/10 text-[8.5px] font-black text-cyan-400 uppercase tracking-wider font-sans">
              Free
            </div>
            <div className="flex flex-col gap-2.5 text-left">
              <Gem className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-extrabold text-white text-base">Gemini 3.1 Pro (Low)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Compact reasoning mode. Ideal for targeted diagnostics, algorithmic debugging, and deep repository parsing with resource safety.
              </p>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono mt-2 text-left">
              Context Window: 1,000,000 max tokens
            </span>
          </div>

          {/* Claude Sonnet 4.6 (Thinking) */}
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/20 hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between h-56 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full border border-orange-500/35 bg-orange-500/10 text-[8.5px] font-black text-orange-400 uppercase tracking-wider font-sans">
              Free
            </div>
            <div className="flex flex-col gap-2.5 text-left">
              <BrainCircuit className="w-7 h-7 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-extrabold text-white text-base">Claude Sonnet 4.6 (Thinking)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Anthropic's flagship logical reasoning engine. Excels at complex refactoring, script planning, code generation, and step-by-step checks.
              </p>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono mt-2 text-left">
              Context Window: 200,000 max tokens
            </span>
          </div>

          {/* Claude Opus 4.6 (Thinking) */}
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/20 hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between h-56 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full border border-red-500/35 bg-red-550/10 text-[8.5px] font-black text-red-400 uppercase tracking-wider font-sans">
              Free
            </div>
            <div className="flex flex-col gap-2.5 text-left">
              <Flame className="w-7 h-7 text-red-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-extrabold text-white text-base">Claude Opus 4.6 (Thinking)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Elite deep intelligence engine. Outstanding planning capabilities for comprehensive project updates, code rewriting, and system design.
              </p>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono mt-2 text-left">
              Context Window: 200,000 max tokens
            </span>
          </div>

          {/* GPT-OSS 120B (Medium) */}
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/20 hover:border-slate-500/40 transition-all duration-300 flex flex-col justify-between h-56 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full border border-slate-500/35 bg-slate-500/10 text-[8.5px] font-black text-slate-400 uppercase tracking-wider font-sans">
              Free
            </div>
            <div className="flex flex-col gap-2.5 text-left">
              <Bot className="w-7 h-7 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-extrabold text-white text-base">GPT-OSS 120B (Medium)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                A massive open-source coding specialist model hosted on high-performance infrastructure. Completely free, transparent, and unlocked.
              </p>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono mt-2 text-left">
              Context Window: 32,768 max tokens
            </span>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900/50 relative z-10">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Core Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Architected for Speed & Precision</h2>
          <p className="max-w-xl text-zinc-400 text-xs md:text-sm font-medium leading-relaxed">
            Every detail is engineered to optimize your terminal workflows, removing friction and automating coding operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/25 hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Background Subagent Runner</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Launch autonomous subagents using <span className="font-mono text-zinc-300">/agents</span> to research, test, and write code concurrently in separate workspaces without blocking your thread.
            </p>
          </div>
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/25 hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Real-time Context Diagnostic</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Check exact tokens and remaining credits dynamically. Built-in alert notifications warn you before crossing context boundaries or daily API caps.
            </p>
          </div>
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/25 hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Strict Sandbox Security Rules</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Run terminal processes safely. Our sandboxing system automatically flags unsafe commands and seeks approval for non-sandboxed actions.
            </p>
          </div>
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/25 hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
              <Plug className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Universal MCP Connection</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Integrate custom Model Context Protocol servers directly. Connect databases, private documentation stores, and custom APIs seamlessly.
            </p>
          </div>
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/25 hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
              <GitBranch className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Stateful Session Rewinds</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Never lose your history. Revert files, rollback prompts, or fork conversations into independent branches with simple slash commands.
            </p>
          </div>
          <div className="glass-panel p-6 border-zinc-900 bg-zinc-950/25 hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
              <ListTodo className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Interactive Planning Board</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Visualize multi-step engineering checklists. Checkoff items, add tasks on-the-fly, and verify task lists before committing code.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Interactive Console Demo Section */}
      <section id="demo" className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900/50 flex flex-col lg:flex-row gap-12 items-center relative z-10">
        <div className="flex-1 flex flex-col gap-4 text-left">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Interactive Terminal
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Operate directly from your CLI</h2>
          <p className="text-zinc-400 text-xs md:text-sm font-medium leading-relaxed">
            Run prompt iterations, execute shell scripts, and verify changes directly. Everything you type translates to native shell processes inside your local workspace.
          </p>
          <ul className="flex flex-col gap-3 mt-4 text-xs font-medium text-zinc-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Type <span className="font-mono text-zinc-200">agy --help</span> to browse subcommands
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Prepend prompts using <span className="font-mono text-zinc-200">agy --print</span> for non-interactive outputs
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Full PTY stream with clean ANSI-cleansing filter
            </li>
          </ul>
        </div>
        {/* Mock Console */}
        <div className="w-full max-w-lg bg-zinc-950/80 border border-zinc-900 rounded-2xl p-5 shadow-2xl flex flex-col justify-between h-[360px] font-mono text-xs relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-650/20 rounded-2xl opacity-10 blur-lg pointer-events-none"></div>
          <div className="overflow-y-auto flex-1 flex flex-col gap-1.5 scrollbar-thin text-left z-10">
            <div className="text-zinc-500 font-semibold border-b border-zinc-900/60 pb-1.5 mb-1.5 flex justify-between items-center">
              <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> ZSH (interactive)</span>
              <span>tty-PTY</span>
            </div>
            <div className="text-zinc-50">$ agy --version</div>
            <div className="text-zinc-300">1.0.7</div>
            <div className="text-zinc-50">$ agy --print "Explain React components"</div>
            <div className="text-indigo-350 leading-relaxed whitespace-pre-wrap">
              React components are independent, reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML via a render() function.
            </div>
            <div className="text-emerald-400 font-bold">$ Process completed successfully.</div>
          </div>
          <div className="border-t border-zinc-900/60 pt-3 flex items-center gap-2 mt-3 text-left z-10">
            <span className="text-indigo-400 font-bold">$</span>
            <input 
              type="text" 
              placeholder="Interactive console demo only..." 
              disabled 
              className="flex-1 bg-transparent text-zinc-650 border-none outline-none text-xs" 
            />
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900/50 text-center relative z-10">
        <div className="flex flex-col items-center gap-3 mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Subscription Tiers</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Simple, Transparent Pricing</h2>
          <p className="max-w-xl text-zinc-400 text-xs md:text-sm font-medium leading-relaxed">
            No subscription gates. Free access to Google Gemini and Anthropic Claude models for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left items-stretch">
          {/* Free Tier */}
          <div className="glass-panel p-8 border-zinc-900 bg-zinc-950/15 hover:border-zinc-800 transition-all flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Free Starter</h3>
                <p className="text-zinc-550 text-xs mt-0.5">For standard local terminal tasks.</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">$0</span>
              <span className="text-zinc-500 text-xs">/ forever</span>
            </div>
            <ul className="flex flex-col gap-3 text-xs text-zinc-450 font-medium border-t border-zinc-900/40 pt-4">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Gemini 3.5 Flash & 3.1 Pro (Free)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Standard Local Workspace indexing</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Single Agent Execution</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Community support</li>
            </ul>
            <Link 
              href="/chat"
              className="glass-button w-full py-3 font-bold text-xs mt-auto cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" /> Launch Community
            </Link>
          </div>
          {/* Pro Tier (Free!) */}
          <div className="glass-panel p-8 border-indigo-500/30 bg-indigo-500/5 flex flex-col gap-6 relative shadow-[0_0_32px_rgba(99,102,241,0.08)] scale-[1.03]">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-indigo-600 text-[9px] font-bold text-white uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              Unconditional Free Access
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Claude Unlocked Plan</h3>
                <p className="text-zinc-400 text-xs mt-0.5">For professional engineers.</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">$0</span>
              <span className="text-zinc-400 text-xs">/ month (Free)</span>
            </div>
            <ul className="flex flex-col gap-3 text-xs text-zinc-300 font-medium border-t border-indigo-500/15 pt-4">
              <li className="text-indigo-350 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Claude Opus 4.6 (Thinking) (Free)
              </li>
              <li className="text-indigo-350 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Claude Sonnet 4.6 (Thinking)
 (Free)
              </li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> Multi-Agent Background tasks</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> GPT-OSS 120B (Free)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> Real-time Credits & Quota monitor</li>
            </ul>
            <Link 
              href="/chat"
              className="glass-button-primary w-full py-3 font-bold text-xs mt-auto cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Launch with Claude Free
            </Link>
          </div>
          {/* Enterprise Tier */}
          <div className="glass-panel p-8 border-zinc-900 bg-zinc-950/15 hover:border-zinc-800 transition-all flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center">
                <Server className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise</h3>
                <p className="text-zinc-550 text-xs mt-0.5">For organizations & teams.</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">Custom</span>
            </div>
            <ul className="flex flex-col gap-3 text-xs text-zinc-450 font-medium border-t border-zinc-900/40 pt-4">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-zinc-500" /> Custom MCP Server allowance</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-zinc-500" /> SSO, Okta, Active Directory auth</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-zinc-500" /> Dedicated VPC deployment</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-zinc-500" /> Custom SLAs and training</li>
            </ul>
            <Link 
              href="/chat"
              className="glass-button w-full py-3 font-bold text-xs mt-auto cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer Section */}
      <footer className="border-t border-zinc-955 bg-[#040407] py-16 text-zinc-500 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 text-left">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-6 h-6 rounded-lg bg-indigo-650/20 border border-indigo-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" strokeDasharray="30 10" />
                  <polygon points="50,35 60,55 40,55" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-sm uppercase font-mono tracking-wider">Antigravity AI</span>
            </div>
            <p className="max-w-xs text-zinc-550 leading-relaxed">
              Autonomous and interactive AI coding systems running natively on your local infrastructure.
            </p>
            <span className="text-[10px] text-zinc-650 font-mono mt-2">
              © 2026 Antigravity Inc. All rights reserved.
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="font-bold text-white text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"><BarChart3 className="w-3 h-3" /> Product</span>
            <a href="#features" className="hover:text-zinc-300 transition-colors">Features</a>
            <a href="#demo" className="hover:text-zinc-300 transition-colors">Playground</a>
            <a href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <a href="https://github.com" className="hover:text-zinc-300 transition-colors">Releases</a>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="font-bold text-white text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Resources</span>
            <a href="https://github.com" className="hover:text-zinc-300 transition-colors flex items-center gap-1"><BookOpen className="w-3 h-3" /> Docs</a>
            <a href="https://github.com" className="hover:text-zinc-300 transition-colors flex items-center gap-1"><GitBranch className="w-3 h-3" /> GitHub</a>
            <a href="https://github.com" className="hover:text-zinc-300 transition-colors flex items-center gap-1"><History className="w-3 h-3" /> Changelog</a>
            <a href="https://github.com" className="hover:text-zinc-300 transition-colors flex items-center gap-1"><Lock className="w-3 h-3" /> Security Rules</a>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="font-bold text-white text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"><Users className="w-3 h-3" /> Company</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">About Us</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Blog</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Customers</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Careers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

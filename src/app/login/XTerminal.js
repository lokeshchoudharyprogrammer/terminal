'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const XTerminal = forwardRef(function XTerminal({ onReady, onData, onAuthDone }, ref) {
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const fitRef = useRef(null);

  useImperativeHandle(ref, () => ({
    write: (data) => termRef.current?.write(data),
    writeln: (data) => termRef.current?.writeln(data),
    focus: () => termRef.current?.focus(),
    get cols() { return termRef.current?.cols || 220; },
    get rows() { return termRef.current?.rows || 50; },
    dispose: () => termRef.current?.dispose(),
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let term, fitAddon, ro;

    (async () => {
      const { Terminal }     = await import('@xterm/xterm');
      const { FitAddon }     = await import('@xterm/addon-fit');
      const { WebLinksAddon} = await import('@xterm/addon-web-links');

      if (disposed) return;

      term = new Terminal({
        fontFamily: '"JetBrains Mono","Fira Code","Cascadia Code",Menlo,monospace',
        fontSize: 13.5,
        lineHeight: 1.55,
        letterSpacing: 0.3,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 5000,
        allowTransparency: true,
        convertEol: false,
        disableStdin: false,
        allowProposedApi: true,
        theme: {
          background:          '#06070a',
          foreground:          '#e4e4e7',
          cursor:              '#6366f1',
          cursorAccent:        '#06070a',
          selectionBackground: 'rgba(99,102,241,0.25)',
          black:   '#18181b', red:     '#f87171', green:   '#34d399',
          yellow:  '#fbbf24', blue:    '#6366f1', magenta: '#c084fc',
          cyan:    '#22d3ee', white:   '#e4e4e7',
          brightBlack:   '#3f3f46', brightRed:   '#fb7185',
          brightGreen:   '#4ade80', brightYellow:'#fde047',
          brightBlue:    '#818cf8', brightMagenta:'#d8b4fe',
          brightCyan:    '#67e8f9', brightWhite:  '#f4f4f5',
        },
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      term.open(containerRef.current);
      fitAddon.fit();
      term.focus();

      termRef.current = term;
      fitRef.current  = fitAddon;

      // Forward keystrokes
      term.onData((data) => onData?.(data));

      // Resize observer
      ro = new ResizeObserver(() => {
        try { fitAddon.fit(); } catch {}
        onReady?.({ cols: term.cols, rows: term.rows, resized: true });
      });
      ro.observe(containerRef.current);

      onReady?.({ cols: term.cols, rows: term.rows });
    })();

    return () => {
      disposed = true;
      ro?.disconnect();
      try { term?.dispose(); } catch {}
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflow: 'hidden', padding: '10px 8px 8px' }}
    />
  );
});

export default XTerminal;

'use client';
import { useEffect, useRef, useState } from 'react';
import { cipher } from '@/lib/lab';
import { certifications, profile, projects } from '@/data/portfolio';
const intro = [
  'Hyper-Drive sandbox shell (simulated). Type help to begin.',
  'Rule: only test systems you own or have explicit permission to test.',
];
export function Terminal() {
  const [lines, setLines] = useState(intro);
  const [input, setInput] = useState('');
  const history = useRef<string[]>([]),
    position = useRef(0);
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [lines]);
  const run = () => {
    const line = input.trim();
    setInput('');
    if (!line) return;
    history.current.push(line);
    if (history.current.length > 200) history.current.shift();
    position.current = history.current.length;
    const [raw, ...args] = line.split(/\s+/),
      command = raw.toLowerCase(),
      argument = args.join(' ');
    if (command === 'clear') {
      setLines([]);
      return;
    }
    const files: Record<string, string> = {
      'README.md': 'Sandbox only. Test only what you own or have written permission to test.',
      'about.txt': 'Cloud-focused engineer in Canberra. AWS serverless, React, Python and CI/CD.',
      'flag.enc': cipher(),
    };
    let result: string[];
    switch (command) {
      case 'help':
        result = [
          'help · ls · cat <file> · whoami · skills · projects · certs · contact · nmap portfolio · clear · sudo hire gowtham',
          'Hint: there is an encrypted file. Try ls.',
        ];
        break;
      case 'ls':
        result = [Object.keys(files).join('  ')];
        break;
      case 'cat':
        result = [
          !argument
            ? 'usage: cat <file>'
            : argument === '/etc/passwd'
              ? 'Permission denied. Stay in scope.'
              : Object.hasOwn(files, argument)
                ? files[argument]
                : `cat: ${argument}: No such file`,
        ];
        break;
      case 'whoami':
        result = ['gowtham: cloud and full-stack engineer, Canberra'];
        break;
      case 'skills':
        result = ['AWS · Terraform · React · TypeScript · Python · Flask · GitHub Actions'];
        break;
      case 'projects':
        result = [projects.map((project) => project.title).join(' · ')];
        break;
      case 'certs':
        result = [certifications.map((cert) => `AWS ${cert.title} ${cert.level}`).join(' · ')];
        break;
      case 'contact':
        result = [profile.linkedin, profile.github];
        break;
      case 'nmap':
        result =
          argument === 'portfolio'
            ? [
                'Starting simulated scan of portfolio.local...',
                'PORT      STATE     SERVICE',
                '443/tcp   open      https',
                '22/tcp    filtered  ssh',
                '3306/tcp  filtered  mysql',
                'Scan complete. Static demo only. No network requests were made.',
              ]
            : ['Sandbox target only. Try: nmap portfolio'];
        break;
      case 'sudo':
        result =
          argument.toLowerCase() === 'hire gowtham'
            ? ['[sudo] recruiter authorization accepted', 'Opening contact channel...']
            : ['Access denied. Try sudo hire gowtham'];
        if (argument.toLowerCase() === 'hire gowtham') {
          const contact = document.getElementById('contact');
          contact?.scrollIntoView();
          contact?.setAttribute('tabindex', '-1');
          contact?.focus({ preventScroll: true });
        }
        break;
      case 'rm':
        result = ['Negative. Safe sandbox: destructive commands are disabled.'];
        break;
      default:
        result = [`command not found: ${command}. Type help.`];
    }
    setLines((current) => [...current, `visitor@hyperdrive:~$ ${line}`, ...result].slice(-200));
  };
  return (
    <>
      <div
        className="terminal-output"
        ref={output}
        role="log"
        aria-label="Simulated terminal output"
        tabIndex={0}
      >
        {lines.map((line, i) => (
          <div key={i} className={line.startsWith('visitor@') || i === 0 ? 'terminal-accent' : ''}>
            {line}
          </div>
        ))}
      </div>
      <form
        className="terminal-input"
        onSubmit={(event) => {
          event.preventDefault();
          run();
        }}
      >
        <label htmlFor="terminal-command">
          $<span className="sr-only"> Terminal command</span>
        </label>
        <input
          id="terminal-command"
          value={input}
          maxLength={500}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="type help"
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              position.current = Math.max(0, position.current - 1);
              setInput(history.current[position.current] ?? '');
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              position.current = Math.min(history.current.length, position.current + 1);
              setInput(history.current[position.current] ?? '');
            }
          }}
        />
        <button type="submit" className="terminal-run" aria-label="Run simulated command">
          ↵
        </button>
      </form>
    </>
  );
}

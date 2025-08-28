import React, { useState, useRef, useEffect } from "react";

// Extend the global Window interface to include debugLog
declare global {
  interface Window {
    debugLog?: (message: string) => void;
  }
}

export function DebugConsole() {
  const [logs, setLogs] = useState<{message: string, level: string}[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, level: string = 'DEBUG') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, {message: `[${timestamp}] ${message}`, level}]);
  };

  const formatArg = (arg: any): string => {
    if (typeof arg === 'object' && arg !== null) {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return String(arg);
      }
    }
    return String(arg);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  // Global function to add logs from anywhere
  useEffect(() => {
    window.debugLog = addLog;
    
    // Store original console methods
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
    };

    // Override console methods to also log to debug console
    console.log = (...args) => {
      originalConsole.log(...args);
      addLog(args.map(formatArg).join(' '), 'LOG');
    };

    console.info = (...args) => {
      originalConsole.info(...args);
      addLog(args.map(formatArg).join(' '), 'INFO');
    };

    console.warn = (...args) => {
      originalConsole.warn(...args);
      addLog(args.map(formatArg).join(' '), 'WARN');
    };

    console.error = (...args) => {
      originalConsole.error(...args);
      addLog(args.map(formatArg).join(' '), 'ERROR');
    };

    return () => {
      // Restore original console methods
      console.log = originalConsole.log;
      console.info = originalConsole.info;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      delete window.debugLog;
    };
  }, []);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
        <span className="text-sm font-medium text-gray-200">Debug Console</span>
        <button
          onClick={clearLogs}
          className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>
      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 font-mono text-sm bg-gray-900 min-h-0"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 text-xs">
            Console ready. Use window.debugLog("message") or console.log() to add logs.
          </div>
        ) : (
          logs.map((log, index) => {
            const getLogColor = (level: string) => {
              switch (level) {
                case 'ERROR': return 'text-red-400';
                case 'WARN': return 'text-yellow-400';
                case 'INFO': return 'text-blue-400';
                case 'LOG': return 'text-white';
                default: return 'text-green-400';
              }
            };
            
            return (
              <div key={index} className={`mb-1 text-xs break-words ${getLogColor(log.level)}`}>
                {log.message}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
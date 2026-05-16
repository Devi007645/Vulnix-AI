import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Search, Shield, Zap, Terminal, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AgentPage() {
  const [target, setTarget] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("full-scan");

  const agents = [
    { id: "full-scan", name: "Full Recon & Scan", icon: Shield, desc: "End-to-end security analysis." },
    { id: "recon", name: "Reconnaissance", icon: Search, desc: "OSINT and subdomain discovery." },
    { id: "vulnerability", name: "Vulnerability Analysis", icon: Zap, desc: "Active scanning and CVE mapping." },
  ];

  useEffect(() => {
    // Subscribe to scan logs for the "system" or specific scanId
    const subscription = supabase
      .channel('scan_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scan_logs' }, (payload) => {
        setLogs((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const runAgent = async () => {
    if (!target) return;
    setIsRunning(true);
    setLogs([]); // Clear logs for new run
    
    try {
      const response = await fetch("http://localhost:3001/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow: selectedAgent, target }),
      });
      
      if (!response.ok) throw new Error("Failed to start agent");
      
      const data = await response.json();
      console.log("Agent started:", data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          AI Security Orchestrator
        </h1>
        <p className="text-muted-foreground text-lg">
          Deploy autonomous agents to secure your infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle>Select Agent</CardTitle>
              <CardDescription>Choose a specialized AI agent for your task.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                    selectedAgent === agent.id 
                      ? "border-primary bg-primary/5 shadow-primary/10" 
                      : "border-transparent hover:border-muted bg-muted/30"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${selectedAgent === agent.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <agent.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Target Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target URL / IP</label>
                <Input 
                  placeholder="example.com" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <Button 
                className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20" 
                onClick={runAgent}
                disabled={isRunning || !target}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Agent Working...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-5 w-5" />
                    Launch Agent
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col border-primary/20 shadow-xl">
            <CardHeader className="border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal size={18} className="text-primary" />
                  <CardTitle>Autonomous Agent Logs</CardTitle>
                </div>
                <Badge variant="outline" className="animate-pulse bg-green-500/10 text-green-500 border-green-500/20">
                  Realtime Monitoring
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden">
              <ScrollArea className="h-full p-4 font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                    <Bot size={48} className="opacity-10" />
                    <p>Waiting for agent activity...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log, i) => (
                      <div key={i} className="flex space-x-3 animate-in slide-in-from-left duration-300">
                        <span className="text-muted-foreground shrink-0">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                        <span className={`
                          ${log.level === 'error' ? 'text-red-500' : 
                            log.level === 'warn' ? 'text-yellow-500' : 
                            log.level === 'debug' ? 'text-blue-400' : 'text-foreground'}
                        `}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

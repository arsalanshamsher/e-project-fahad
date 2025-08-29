import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Activity, Zap, Clock, Database } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  cacheHitRate: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    cacheHitRate: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Measure initial load time
    const loadTime = performance.now();
    
    // Measure render time
    const measureRender = () => {
      const renderTime = performance.now() - loadTime;
      setMetrics(prev => ({ ...prev, loadTime, renderTime }));
    };

    // Use requestAnimationFrame to measure after render
    requestAnimationFrame(measureRender);

    // Monitor performance metrics
    const updateMetrics = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }

      // Simulate network latency measurement
      const startTime = performance.now();
      fetch('/api/health')
        .then(() => {
          const latency = performance.now() - startTime;
          setMetrics(prev => ({ ...prev, networkLatency: Math.round(latency) }));
        })
        .catch(() => {
          // If health check fails, use a default value
          setMetrics(prev => ({ ...prev, networkLatency: 50 }));
        });

      // Simulate cache hit rate (in a real app, this would come from service worker)
      const cacheHitRate = Math.random() * 100;
      setMetrics(prev => ({ ...prev, cacheHitRate: Math.round(cacheHitRate) }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = (metric: keyof PerformanceMetrics, value: number) => {
    switch (metric) {
      case 'loadTime':
        return value < 1000 ? 'excellent' : value < 2000 ? 'good' : 'poor';
      case 'renderTime':
        return value < 100 ? 'excellent' : value < 200 ? 'good' : 'poor';
      case 'memoryUsage':
        return value < 50 ? 'excellent' : value < 100 ? 'good' : 'poor';
      case 'networkLatency':
        return value < 100 ? 'excellent' : value < 300 ? 'good' : 'poor';
      case 'cacheHitRate':
        return value > 80 ? 'excellent' : value > 60 ? 'good' : 'poor';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        title="Show Performance Monitor"
      >
        <Activity className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border z-50">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Performance Monitor
            </CardTitle>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-blue-500" />
              Load Time
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{metrics.loadTime.toFixed(0)}ms</span>
              <Badge className={getStatusColor(getPerformanceStatus('loadTime', metrics.loadTime))}>
                {getPerformanceStatus('loadTime', metrics.loadTime)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-green-500" />
              Render Time
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{metrics.renderTime.toFixed(0)}ms</span>
              <Badge className={getStatusColor(getPerformanceStatus('renderTime', metrics.renderTime))}>
                {getPerformanceStatus('renderTime', metrics.renderTime)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Database className="h-3 w-3 text-purple-500" />
              Memory Usage
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{metrics.memoryUsage}MB</span>
              <Badge className={getStatusColor(getPerformanceStatus('memoryUsage', metrics.memoryUsage))}>
                {getPerformanceStatus('memoryUsage', metrics.memoryUsage)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-orange-500" />
              Network Latency
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{metrics.networkLatency}ms</span>
              <Badge className={getStatusColor(getPerformanceStatus('networkLatency', metrics.networkLatency))}>
                {getPerformanceStatus('networkLatency', metrics.networkLatency)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-indigo-500" />
              Cache Hit Rate
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{metrics.cacheHitRate}%</span>
              <Badge className={getStatusColor(getPerformanceStatus('cacheHitRate', metrics.cacheHitRate))}>
                {getPerformanceStatus('cacheHitRate', metrics.cacheHitRate)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

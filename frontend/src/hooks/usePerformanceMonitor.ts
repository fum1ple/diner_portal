import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
}

type DependencyValue = string | number | boolean | object | null | undefined;

export const usePerformanceMonitor = (dependencies: DependencyValue[]) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0
  });

  const renderStartTimeRef = useRef<number>(0);
  const renderTimesRef = useRef<number[]>([]);
  const isFirstRenderRef = useRef(true);
  const prevDepsRef = useRef<DependencyValue[]>([]);

  // レンダリング開始時間を記録（毎レンダリング実行）
  renderStartTimeRef.current = performance.now();

  // 依存関係をメモ化してシリアライズ
  const serializedDeps = useMemo(() => 
    JSON.stringify(dependencies), 
    [dependencies]
  );

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - renderStartTimeRef.current;
    
    // 前回の依存関係と比較
    const prevSerialized = JSON.stringify(prevDepsRef.current);
    const depsChanged = !isFirstRenderRef.current && serializedDeps !== prevSerialized;
    
    if (isFirstRenderRef.current || depsChanged) {
      renderTimesRef.current.push(renderTime);
      const totalTime = renderTimesRef.current.reduce((sum, time) => sum + time, 0);
      const count = renderTimesRef.current.length;
      
      setMetrics({
        renderCount: count,
        lastRenderTime: renderTime,
        averageRenderTime: totalTime / count,
        totalRenderTime: totalTime
      });

      if (isFirstRenderRef.current) {
        isFirstRenderRef.current = false;
      }
    }

    prevDepsRef.current = dependencies;
  }, [serializedDeps, dependencies]);

  const resetMetrics = useCallback(() => {
    renderTimesRef.current = [];
    setMetrics({
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      totalRenderTime: 0
    });
    isFirstRenderRef.current = true;
  }, []);

  return { metrics, resetMetrics };
};

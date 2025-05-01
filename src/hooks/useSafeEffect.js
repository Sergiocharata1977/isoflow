import { useEffect, useRef, useState, useCallback } from "react";

export function useSafeEffect(effect, deps = []) {
  const isMounted = useRef(true);
  const cleanupFn = useRef();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (cleanupFn.current) {
        cleanupFn.current();
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;

    const cleanup = effect();
    cleanupFn.current = cleanup;

    return () => {
      if (cleanup && typeof cleanup === "function") {
        cleanup();
      }
    };
  }, deps);
}

export function useSafeState(initialState) {
  const isMounted = useRef(true);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setSafeState = useCallback((data) => {
    if (isMounted.current) {
      setState(data);
    }
  }, []);

  return [state, setSafeState];
}

export function useAsyncEffect(effect, deps = []) {
  useSafeEffect(() => {
    const promise = effect();
    return () => {
      if (promise && typeof promise.abort === "function") {
        promise.abort();
      }
    };
  }, deps);
}

export function useDelayUnmount(isMounted, delayTime) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);

  return shouldRender;
}

export default useSafeEffect;

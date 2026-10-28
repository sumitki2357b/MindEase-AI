import { useState, useEffect, useRef, useCallback } from 'react';
import { StuckRadarConfig } from '../types';

interface UseStuckRadarProps {
  config: StuckRadarConfig;
  isSessionActive: boolean;
  onTriggerCheckIn?: (reason: string, explanation: string) => void;
}

export function useStuckRadar({
  config,
  isSessionActive,
  onTriggerCheckIn,
}: UseStuckRadarProps) {
  const [secondsInactive, setSecondsInactive] = useState<number>(0);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [triggerReason, setTriggerReason] = useState<string>('');
  const [triggerExplanation, setTriggerExplanation] = useState<string>('');
  const [lastDismissedAt, setLastDismissedAt] = useState<number | null>(null);

  const requestTimesRef = useRef<number[]>([]);
  const dismissalTimesRef = useRef<number[]>([]);
  const lastActivityRef = useRef<number>(Date.now());

  // Track in-app user activity (clicks, keydown, pointer)
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      setSecondsInactive(0);
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Interval timer for evaluating in-app inactivity during focus session
  useEffect(() => {
    if (!config.enabled || !isSessionActive) {
      setSecondsInactive(0);
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const diffSec = Math.floor((now - lastActivityRef.current) / 1000);
      setSecondsInactive(diffSec);

      // Check cooldown
      if (lastDismissedAt) {
        const cooldownRemaining = config.dismissalCooldownSeconds - Math.floor((now - lastDismissedAt) / 1000);
        if (cooldownRemaining > 0) {
          return;
        }
      }

      // Check threshold
      if (diffSec >= config.inactivityThresholdSeconds && !showPrompt) {
        const reason = 'inactivity';
        const explanation = `This check-in was offered after ${config.inactivityThresholdSeconds}s without in-app interaction during your focus session.`;
        setTriggerReason(reason);
        setTriggerExplanation(explanation);
        setShowPrompt(true);
        onTriggerCheckIn?.(reason, explanation);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config, isSessionActive, lastDismissedAt, showPrompt, onTriggerCheckIn]);

  // Record an intervention request
  const recordInterventionRequest = useCallback(() => {
    const now = Date.now();
    requestTimesRef.current.push(now);
    // Keep within last 10 minutes (600,000 ms)
    requestTimesRef.current = requestTimesRef.current.filter(t => now - t <= 600000);

    if (requestTimesRef.current.length >= config.repeatedRequestLimit && !showPrompt) {
      const reason = 'repeated_requests';
      const explanation = `This check-in was offered because you've explored several strategies recently. Would a different format or break help?`;
      setTriggerReason(reason);
      setTriggerExplanation(explanation);
      setShowPrompt(true);
      onTriggerCheckIn?.(reason, explanation);
    }
  }, [config.repeatedRequestLimit, showPrompt, onTriggerCheckIn]);

  // Record dismissal
  const dismissPrompt = useCallback((takeBreak: boolean = false) => {
    const now = Date.now();
    setLastDismissedAt(now);
    setShowPrompt(false);
    lastActivityRef.current = now;
    setSecondsInactive(0);

    dismissalTimesRef.current.push(now);
    dismissalTimesRef.current = dismissalTimesRef.current.filter(t => now - t <= 600000);
  }, []);

  const voluntaryTrigger = useCallback(() => {
    const reason = 'voluntary_report';
    const explanation = 'You selected "I\'m feeling stuck" to explore a supportive alternative.';
    setTriggerReason(reason);
    setTriggerExplanation(explanation);
    setShowPrompt(true);
  }, []);

  return {
    secondsInactive,
    showPrompt,
    triggerReason,
    triggerExplanation,
    recordInterventionRequest,
    dismissPrompt,
    voluntaryTrigger,
    lastDismissedAt,
  };
}

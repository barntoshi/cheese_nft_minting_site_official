// File: NewTimer.tsx
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Text } from "@chakra-ui/react";

interface NewTimerProps {
  /**
   * The current Solana time in seconds as a bigint.
   */
  solanaTime: bigint;

  /**
   * The future time (in seconds, as a bigint) we are counting down to.
   */
  toTime: bigint;

  /**
   * Callback to trigger once we have reached or passed the `toTime`.
   */
  setCheckEligibility: Dispatch<SetStateAction<boolean>>;
}

export function NewTimer({ solanaTime, toTime, setCheckEligibility }: NewTimerProps) {
  // Initialize remaining time as the difference between toTime and the current solanaTime
  const [remainingTime, setRemainingTime] = useState<bigint>(toTime - solanaTime);

  console.log("s:", solanaTime)
  console.log("t:", toTime)
  useEffect(() => {
    // Decrement the remaining time by 1 every second.
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        // If we are already at zero or below, do nothing.
        if (prev <= BigInt(0)) {
          return prev;
        }
        return prev - BigInt(1);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // If we’re at or below zero, invoke setCheckEligibility and display nothing.
  if (remainingTime <= BigInt(0)) {
    setCheckEligibility(true);
    window.location.reload();
    return null; // or <Text></Text> if you prefer an empty Text
  }

  // Convert to days/hours/minutes/seconds
  const days = remainingTime / BigInt(86400);
  const hours = (remainingTime % BigInt(86400)) / BigInt(3600);
  const minutes = (remainingTime % BigInt(3600)) / BigInt(60);
  const seconds = remainingTime % BigInt(60);

  // Render the biggest nonzero chunk. 
  // You could also choose to always render the full "d h m s" format, 
  // but here we'll do an example that collapses if days=0, etc.
  if (days > BigInt(0)) {
    return (
      <Text fontSize="xl" fontWeight="bold">
        Starting in: {days.toString()}d {hours.toString()}h {minutes.toString()}m {seconds.toString()}s
      </Text>
    );
  }

  if (hours > BigInt(0)) {
    return (
      <Text fontSize="xl" fontWeight="bold">
        Starting in: {hours.toString()}h {minutes.toString()}m {seconds.toString()}s
      </Text>
    );
  }

  if (minutes > BigInt(0)) {
    return (
      <Text fontSize="xl" fontWeight="bold">
        Starting in: {minutes.toString()}m {seconds.toString()}s
      </Text>
    );
  }
  // If we’re down to minutes and seconds:
  return (
    <Text fontSize="xl" fontWeight="bold">
      Starting in: {seconds.toString()}s
    </Text>
  );
}

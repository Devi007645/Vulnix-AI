import { useState, useEffect, useMemo } from 'react';

export function useActor<T>(createActorFn: () => T) {
  const actor = useMemo(() => createActorFn(), [createActorFn]);
  return {
    actor,
    isFetching: false, // We're using local fetch, so no "fetching" state for the actor itself
  };
}

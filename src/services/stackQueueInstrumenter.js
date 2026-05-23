export function instrumentStackQueueCode(code) {
  return code;
}

export function parseStackQueueOutput(output) {
  console.log('parseStackQueueOutput called with:', output);
  if (!output || typeof output !== 'string') {
    return { stack: [], queue: [], stackSnapshots: [], queueSnapshots: [] };
  }
  
  const queueSnapshots = [];
  let currentQueue = [];
  let maxQueue = [];
  
  const queueEnqueueMatches = output.matchAll(/\[Q:(\d+)\]/g);
  const queueDequeueMatches = output.matchAll(/\[D:(\d+)\]/g);
  
  for (const match of queueEnqueueMatches) {
    console.log('Q match:', match[1]);
    currentQueue.push(parseInt(match[1]));
    queueSnapshots.push([...currentQueue]);
    if (currentQueue.length > maxQueue.length) maxQueue = [...currentQueue];
  }
  
  for (const match of queueDequeueMatches) {
    console.log('D match:', match[1]);
    currentQueue.shift();
    queueSnapshots.push([...currentQueue]);
  }
  
  console.log('returning queue:', maxQueue.length > 0 ? maxQueue : currentQueue);
  return { 
    stack: [],
    queue: maxQueue.length > 0 ? maxQueue : currentQueue,
    stackSnapshots: [],
    queueSnapshots
  };
}

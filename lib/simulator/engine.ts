export type GateType = "AND" | "OR" | "NOT" | "NAND" | "XOR" | "SWITCH" | "LED";

export type CircuitNode = {
  id: string;
  type: GateType;
  x: number;
  y: number;
  inputs: boolean[];
  output: boolean;
};

export type Wire = {
  id: string;
  sourceId: string;
  targetId: string;
  targetInputIndex: number;
};

// Pure function to calculate a single gate's output
export function evaluateGate(
  type: GateType,
  inputs: boolean[],
  currentState: boolean,
): boolean {
  const a = inputs[0] || false;
  const b = inputs[1] || false;

  switch (type) {
    case "AND":
      return a && b;
    case "OR":
      return a || b;
    case "NOT":
      return !a;
    case "NAND":
      return !(a && b);
    case "XOR":
      return a !== b;
    case "SWITCH":
      return currentState; // Switch creates its own state
    case "LED":
      return a; // LED just reflects input
    default:
      return false;
  }
}

// The Simulation Loop: Updates the whole circuit
export function simulateCircuit(
  nodes: CircuitNode[],
  wires: Wire[],
): CircuitNode[] {
  // Create a map for quick lookups
  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n }]));
  let hasChanges = true;
  let iterations = 0;

  // Propagate signals until stable (or max iterations to prevent infinite loops)
  while (hasChanges && iterations < 100) {
    hasChanges = false;
    iterations++;

    // 1. Reset all inputs first (except Switches which hold state)
    nodeMap.forEach((node) => {
      if (node.type !== "SWITCH") {
        node.inputs = [false, false]; // Default to low
      }
    });

    // 2. Transfer signals via Wires
    wires.forEach((wire) => {
      const source = nodeMap.get(wire.sourceId);
      const target = nodeMap.get(wire.targetId);
      if (source && target) {
        target.inputs[wire.targetInputIndex] = source.output;
      }
    });

    // 3. Recalculate Outputs
    nodeMap.forEach((node) => {
      const newOutput = evaluateGate(node.type, node.inputs, node.output);
      if (node.output !== newOutput) {
        node.output = newOutput;
        hasChanges = true;
      }
    });
  }

  return Array.from(nodeMap.values());
}

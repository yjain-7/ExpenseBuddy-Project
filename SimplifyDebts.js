// const OFFSET = 1000000000L;

// class SimplifyDebts {
//   constructor() {
//     this.visitedEdges = new Set();
//   }

//   static createGraphForDebts(people) {
//     const solver = new Dinics(people.length, people);
//     solver.addAllTransactions();
//     return solver;
//   }

//   static getNonVisitedEdge(edges) {
//     for (let i = 0; i < edges.length; i++) {
//       const edge = edges[i];
//       if (!this.visitedEdges.has(this.getHashKeyForEdge(edge.from, edge.to))) {
//         return i;
//       }
//     }
//     return null;
//   }

//   static getHashKeyForEdge(u, v) {
//     return u * OFFSET + v;
//   }
// }

// class Dinics extends NetworkFlowSolverBase {
//   constructor(n, vertexLabels) {
//     super(n, vertexLabels);
//     this.level = new Array(n).fill(-1);
//   }

//   solve() {
//     let next = new Array(this.n).fill(0);

//     while (this.bfs()) {
//       next.fill(0);
//       let f;
//       while ((f = this.dfs(this.s, next, Infinity)) > 0) {
//         this.maxFlow += f;
//       }
//     }

//     for (let i = 0; i < this.n; i++) {
//       if (this.level[i] !== -1) {
//         this.minCut[i] = true;
//       }
//     }
//   }

//   bfs() {
//     this.level.fill(-1);
//     this.level[this.s] = 0;
//     const queue = [];
//     queue.push(this.s);

//     while (queue.length > 0) {
//       const node = queue.shift();
//       for (const edge of this.graph[node]) {
//         const cap = edge.remainingCapacity();
//         if (cap > 0 && this.level[edge.to] === -1) {
//           this.level[edge.to] = this.level[node] + 1;
//           queue.push(edge.to);
//         }
//       }
//     }

//     return this.level[this.t] !== -1;
//   }

//   dfs(at, next, flow) {
//     if (at === this.t) return flow;

//     const numEdges = this.graph[at].length;
//     for (let i = next[at]; i < numEdges; i++) {
//       const edge = this.graph[at][i];
//       const cap = edge.remainingCapacity();
//       if (cap > 0 && this.level[edge.to] === this.level[at] + 1) {
//         const bottleNeck = this.dfs(edge.to, next, Math.min(flow, cap));
//         if (bottleNeck > 0) {
//           edge.augment(bottleNeck);
//           return bottleNeck;
//         }
//       }
//       next[at]++;
//     }

//     return 0;
//   }
// }

// class NetworkFlowSolverBase {
//   static INF = Math.floor(Number.MAX_VALUE / 2);

//   constructor(n, vertexLabels) {
//     this.n = n;
//     this.maxFlow = 0;
//     this.minCost = 0;
//     this.minCut = new Array(n).fill(false);
//     this.graph = new Array(n).fill(null).map(() => []);
//     this.vertexLabels = vertexLabels;
//     this.edges = [];
//     this.visitedToken = 1;
//     this.visited = new Array(n).fill(0);
//     this.solved = false;
//   }

//   addAllTransactions() {
//     // Add transactions based on your specific data
//     // (similar to the Java implementation)
//   }

//   addEdge(from, to, capacity) {
//     const e1 = new Edge(from, to, capacity);
//     const e2 = new Edge(to, from, 0);
//     e1.residual = e2;
//     e2.residual

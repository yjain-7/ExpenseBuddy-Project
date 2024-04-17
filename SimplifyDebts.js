class Edge {
    constructor(from, to, capacity, cost = 0) {
        this.from = from;
        this.to = to;
        this.capacity = capacity;
        this.cost = cost;
        this.flow = 0;
        this.residual = null;
    }

    isResidual() {
        return this.capacity === 0;
    }

    remainingCapacity() {
        return this.capacity - this.flow;
    }

    augment(bottleNeck) {
        this.flow += bottleNeck;
        this.residual.flow -= bottleNeck;
    }
}

class Dinics {
    constructor(n, vertexLabels) {
        this.n = n;
        this.graph = new Array(n).fill().map(() => []);
        this.level = new Array(n).fill(0);
        this.vertexLabels = vertexLabels;
    }

    solve() {
        let maxFlow = 0;

        while (this.bfs()) {
            let flow;
            while ((flow = this.dfs(this.s, new Array(this.n).fill(0), Infinity)) !== 0) {
                maxFlow += flow;
            }
        }

        return maxFlow;
    }

    bfs() {
        this.level.fill(-1);
        this.level[this.s] = 0;
        const queue = [this.s];

        while (queue.length > 0) {
            const node = queue.shift();
            for (const edge of this.graph[node]) {
                const cap = edge.remainingCapacity();
                if (cap > 0 && this.level[edge.to] === -1) {
                    this.level[edge.to] = this.level[node] + 1;
                    queue.push(edge.to);
                }
            }
        }

        return this.level[this.t] !== -1;
    }

    dfs(at, next, flow) {
        if (at === this.t) return flow;

        for (; next[at] < this.graph[at].length; next[at]++) {
            const edge = this.graph[at][next[at]];
            const cap = edge.remainingCapacity();
            if (cap > 0 && this.level[edge.to] === this.level[at] + 1) {
                const bottleNeck = this.dfs(edge.to, next, Math.min(flow, cap));
                if (bottleNeck > 0) {
                    edge.augment(bottleNeck);
                    return bottleNeck;
                }
            }
        }

        return 0;
    }

    addEdge(from, to, capacity) {
        const e1 = new Edge(from, to, capacity);
        const e2 = new Edge(to, from, 0);
        e1.residual = e2;
        e2.residual = e1;
        this.graph[from].push(e1);
        this.graph[to].push(e2);
    }
}

class SimplifyDebts {
    static OFFSET = 1000000000;
    static visitedEdges = new Set();

    static main() {
        console.log("In main");
        this.createGraphForDebts();
    }

    static createGraphForDebts() {
        const person = ["Alice", "Bob", "Charlie", "David", "Ema", "Fred", "Gabe"];
        const n = person.length;
        const solver = new Dinics(n, person);
        this.addAllTransactions(solver);

        console.log();
        console.log("Simplifying Debts...");
        console.log("--------------------");
        console.log();

        let edgePos;

        while ((edgePos = this.getNonVisitedEdge(solver.graph)) !== null) {
            solver.recompute();
            const firstEdge = solver.graph[edgePos[0]][edgePos[1]];
            solver.s = firstEdge.from;
            solver.t = firstEdge.to;
            const residualGraph = solver.graph.map(edges => edges.map(edge => {
                const remainingFlow = edge.flow < 0 ? edge.capacity : edge.capacity - edge.flow;
                if (remainingFlow > 0) {
                    return new Edge(edge.from, edge.to, remainingFlow);
                }
            }));
            const newEdges = residualGraph.flat().filter(edge => edge);
            const maxFlow = solver.solve();
            if (!this.visitedEdgesContains(this.getHashKeyForEdge(solver.s, solver.t))) {
                this.visitedEdges.add(this.getHashKeyForEdge(solver.s, solver.t));
            }
            const newSolver = new Dinics(n, person);
            newSolver.graph = residualGraph;
            newSolver.addEdge(solver.s, solver.t, maxFlow);
        }

        solver.printEdges();
        console.log();
    }

    static addAllTransactions(solver) {
        solver.addEdge(1, 2, 40);
        solver.addEdge(2, 3, 20);
        solver.addEdge(3, 4, 50);
        solver.addEdge(5, 1, 10);
        solver.addEdge(5, 2, 30);
        solver.addEdge(5, 3, 10);
        solver.addEdge(5, 4, 10);
        solver.addEdge(6, 1, 30);
        solver.addEdge(6, 3, 10);
    }

    static getNonVisitedEdge(graph) {
        for (let i = 0; i < graph.length; i++) {
            for (let j = 0; j < graph[i].length; j++) {
                const edge = graph[i][j];
                if (!this.visitedEdgesContains(this.getHashKeyForEdge(edge.from, edge.to))) {
                    return [i, j];
                }
            }
        }
        return null;
    }

    static getHashKeyForEdge(u, v) {
        return u * this.OFFSET + v;
    }

    static visitedEdgesContains(key) {
        for (const k of this.visitedEdges) {
            if (k === key) {
                return true;
            }
        }
        return false;
    }
}

SimplifyDebts.main();

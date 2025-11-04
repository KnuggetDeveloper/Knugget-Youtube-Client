// Video 4: Barry Zhang - Complete Summaries
export const video4KeyTakeaways = [
  {
    icon: "🎯",
    text: "Don't build agents for everything; use agents only for tasks where they add real value and keep the scope simple for as long as possible.",
  },
  {
    icon: "🔧",
    text: "Start simple and iterate on the three core components of an agent—environment, tools, and system prompt—before optimizing later for cost and performance.",
  },
  {
    icon: "🤔",
    text: "Think like your agent; put yourself in the agent's context to understand its decisions, limitations, and how to improve trust and effectiveness.",
  },
];

export const video4Quotes = [
  {
    icon: "🚫",
    text: '"Don\'t build agents for everything."',
  },
  {
    icon: "✨",
    text: '"Keep it as simple as possible."',
  },
  {
    icon: "🧠",
    text: '"Think like your agents. Gain their perspective, and help them do their job."',
  },
];

export const video4Examples = [
  {
    icon: "💻",
    text: "Coding agents: Used to go from design doc to PR, with reliability in coding workflows and verifiable outputs via unit tests and CI.",
  },
  {
    icon: "🔄",
    text: "Three basic agent components in practice: environment, tools, and system prompt, all within a loop of model calls.",
  },
  {
    icon: "🤖",
    text: "Personal musings on future of multi-agent systems: predictions about budget controls, self-evolving tools, and growing multi-agent collaboration in production.",
  },
];

export const video4DetailedNotes = [
  {
    title: "Introduction and framing",
    content: "Barry introduces the topic of building effective agents and references a prior blog post with Eric: Building Effective Agents. The talk centers on three core ideas: 1) don't build agents for everything, 2) keep it simple, and 3) think like your agents, with personal musings at the end.",
  },
  {
    title: "Recap of evolution toward agentic systems",
    content: "Early stage: simple features (summarization, classification, extraction) became table stakes. Mid stage: single model calls evolved into workflows with predefined control flows to trade off latency and performance. Emergence of agentic systems: agents can decide their trajectory and operate with environment feedback, enabling more autonomy. Production trends: growth of domain-specific agents; potential future developments include general-purpose single agents and multi-agent collaboration/delegation. Costs and risks rise with increased agent agency (cost, latency, errors).",
  },
  {
    title: "First core idea: Don't build agents for everything",
    content: "Agents scale complex, valuable tasks but are not a universal replacement for all use cases. Favor workflows for many common scenarios; they remain valuable today. A practical agent-building checklist includes task complexity (agents shine in ambiguous problems), value of the task (token usage and exploration costs matter), budget considerations, de-risking critical capabilities, and cost of error and discovery. Real-world example: coding as a great agent use-case due to its ambiguity from design doc to PR, value of good code, heavy use of cloud for coding, and verifiable outputs through tests/CI.",
  },
  {
    title: "Task complexity and value assessment",
    content: "Task complexity: Agents shine in ambiguous problems; if you can map and optimize every node in a decision tree, explicit builds are cost-effective and controllable. Value of the task: Token usage and exploration costs matter; higher tokens per task require justification. Example: 10-cent budget per task implies 30,000–50,000 tokens; use workflows for common scenarios to capture most value. Budget-minded vs. cost-agnostic: If the priority is simply 'get the task done' regardless of tokens, explore alternatives; this is a cue for the GTM team to engage.",
  },
  {
    title: "Risk management and critical capabilities",
    content: "De-risk critical capabilities: Ensure key capabilities (e.g., coding agents writing, debugging, recovering from errors) function well; bottlenecks increase cost and latency, so reduce scope if needed. Cost of error and discovery: High-stakes or hard-to-detect errors require limiting scope, read-only access, or more human-in-the-loop, which can slow scaling.",
  },
  {
    title: "Second core idea: Keep it simple",
    content: "Conceptual model: An agent is a loop with three defining components: environment, tools, and system prompt. Environment: The system the agent operates in. Tools: Interfaces the agent uses to perform actions and receive feedback. System prompt: Goals, constraints, and expected behavior guiding the agent. Principle: Upfront complexity kills iteration speed; focusing on these three components yields the highest ROI and fastest learning. Practical takeaway: After establishing these basics, more optimization can follow.",
  },
  {
    title: "Demonstrations and practical examples",
    content: "Demonstrations: Three example agent use cases show diverse product surfaces but share the same backbone and nearly identical code; environment depends on use case, while the two core design decisions are tools and the prompt. Suggestions for tooling and learning: A plug for a Model Context Protocol (MCP) workshop by Mahes to deepen understanding of tools and contexts.",
  },
  {
    title: "Optimization guidance",
    content: "Optimization guidance: For coding and computer use cases, optimize trajectory to reduce cost; for search, parallelize tool calls to reduce latency; for most cases, present progress to build user trust.",
  },
  {
    title: "Third core idea: Think like your agents",
    content: "Encourage empathy with the agent by placing yourself in the agent's context window. Agents can appear highly sophisticated, but each step is a limited inference over a small context window (10–20k tokens). Limiting context helps reveal true agent behavior and gaps.",
  },
  {
    title: "Agent perspective and thought experiments",
    content: "A thought experiment: If you were a computer-using agent with a simple set of tools and a task, your actions would be reactive to tool outputs rather than internal contemplation. The 'eyes closed' analogy: acting without seeing the outcome can lead to unknown results; a full task-from-agent perspective reveals what the agent would have needed (e.g., screen resolution, recommended actions, limitations).",
  },
  {
    title: "Practical exercises and validation",
    content: "Practical exercise: Run a full task from the agent's perspective to understand what context and guardrails are needed; use this to avoid unnecessary exploration and guide tool usage. Cloud-based validation: Use cloud to run the agent's entire trajectory, then question the agent about its decisions to gain perspective on decision-making and improve it. Overall guidance: Think like the agent during iteration, and you'll better understand limitations and improvement paths.",
  },
  {
    title: "Personal musings and open questions",
    content: "Budgeting agents: Agents lack strong built-in budget control; defining and enforcing budgets in time, money, or tokens is an open area to enable broader production use cases. Self-evolving tools: Meta-tools where agents can design and improve their own tooling ergonomics to generalize across use cases. Multi-agent collaboration: Expect more multi-agent collaborations in production, with sub-agents protecting the main agent's context window; key open questions center on how agents communicate, especially moving from synchronous to asynchronous interactions and enabling cross-agent roles and recognition.",
  },
  {
    title: "Future directions and collaboration",
    content: "Invitation for engagement: The speaker invites others to discuss these ideas, including sharing contact information.",
  },
  {
    title: "Conclusion and practical takeaways",
    content: "Reiterated three takeaways: don't build agents for everything; keep them simple; think like your agent to understand and improve its performance. Encouragement to stay connected and continue building. Personal anecdote: The speaker's transformative experience of becoming an AI engineer, inspired by the blog post, and a commitment to making AI practical and useful.",
  },
];

export default {
  keyTakeaways: video4KeyTakeaways,
  detailedNotes: video4DetailedNotes,
  quotes: video4Quotes,
  examples: video4Examples,
};

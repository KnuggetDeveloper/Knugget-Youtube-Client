// Video 3: Marc Andreessen & Amjad Masad - Complete Summaries
export const video3KeyTakeaways = [
  {
    icon: "🤖",
    text: "Replit and AI agents are transforming software creation: you describe a shift from manual, environment-heavy coding to English-driven prompts, automated design, code generation, testing, deployment, and even multi-agent collaboration that can produce production-ready apps in a fraction of the time.",
  },
  {
    icon: "🧠",
    text: "Long-horizon reasoning and verification are central breakthroughs: achieving coherent, multi-step problem solving with AI requires long context, memory compression, and a verification loop (in-loop checking and testing). RLHF/RLHF+trajectory-based training enables sustained reasoning, with real-world benchmarks showing dramatic gains in lasting coherence and practical task completion.",
  },
  {
    icon: "🎯",
    text: "The trajectory toward AGI is mixed and debated: coding and concrete, verifiable domains are advancing fastest, while more abstract domains (law, medicine, social science) lag behind due to verifiability challenges. There's a tension between 'good enough' progress in a local maximum and the broader quest for true, transferable AGI.",
  },
];

export const video3Quotes = [
  {
    icon: "💭",
    text: '"Instead of typing syntax, you\'re actually typing thoughts, which is what we ultimately want. And the machine writes the code."',
  },
  {
    icon: "🤖",
    text: '"The agent is a programmer that has tools and interface. It\'s a bot… a multi-agent system that can test, debug, and iterate just like a human."',
  },
  {
    icon: "📈",
    text: "\"Worse is better. We're in a local maximum trap where it's good enough for so much economically productive work, and that relieves the pressure to solve generalized intelligence.\"",
  },
];

export const video3Examples = [
  {
    icon: "⚡",
    text: "End-to-end product building in 20–30 minutes: the agent reads a user's English description (e.g., 'I want to sell crepes online'), proposes tasks (database setup, payments, design), builds the app, tests it in a browser, and publishes to the cloud with a production database.",
  },
  {
    icon: "🔄",
    text: "Multi-agent collaboration and orchestration: multiple agents work in parallel on features (design, refactoring, database changes) and then merge their outputs into a cohesive product, with each step feeding the next through summarized prompts.",
  },
  {
    icon: "✅",
    text: "Verification-driven improvement: adding a verifier in the loop (inspired by Nvidia's approach to kernel optimization) to run and validate actions, enabling longer-running, more reliable agent sessions (e.g., 10–20–200 minutes) by checking outcomes and restarting trajectories when issues arise.",
  },
];

export const video3DetailedNotes = [
  {
    title: "General context of speed and potential",
    content: "The conversation frames AI/ML progress as incredibly rapid and magical compared with traditional computer speed, suggesting a mix of awe and disappointment about pace and practical limits.",
  },
  {
    title: "Target audience and onboarding with Replit AI",
    content: "Replit aims to simplify setup, letting users focus on what they want to build (product, data visualization, startup idea). Users input in plain English; the system classifies the best technology stack (e.g., Python for data apps, JavaScript + PostgreSQL for web apps) and supports many languages; users can choose specific languages if they want, but the platform will select the most suitable default.",
  },
  {
    title: "Language as programming language",
    content: "The pipeline argues that English can be the primary programming language, with AI understanding translating natural language prompts into executable software. Grace Hopper's vision of moving from machine code toward English-like programming is cited as a historical anchor, with the speaker suggesting we're at the next step: thinking in English while the machine writes the code.",
  },
  {
    title: "Language support and historical perspective",
    content: "While English is primary, other languages (e.g., Japanese) are supported; AI tends to perform well on mainstream languages. The discussion references the evolution from low-level assembly to high-level languages and the democratization of programming via higher-level abstractions.",
  },
  {
    title: "User experience flow",
    content: "The agent shows what it understood by listing tasks (set up database, payments, etc.) and offers a design-first or full-build option. If a full build is chosen, the agent handles database migrations, code generation, testing in a browser, and iterative fixes based on feedback from testing or user reports.",
  },
  {
    title: "Capabilities of agent 3",
    content: "Recent improvements include writing software and then spinning up a browser to test it; it can iterate and fix issues, and notify when the app is ready for testing on different devices. This makes a 20–30 minute build feasible for common ideas.",
  },
  {
    title: "Real-world deployment and abstraction layers",
    content: "Replit abstracts complexity (dev environments, cloud provisioning) but preserves layers for users who want to inspect code, push to GitHub, or edit in their editor—combining ease of use with transparency.",
  },
  {
    title: "The role of the agent and user",
    content: 'The agent acts as the programmer, listing and executing tasks; the user shifts toward high-level direction while the agent\'s outputs become the implementation. The speaker notes this can cause the "agent programmer" to become the primary driver of the workflow.',
  },
  {
    title: "Coherence and long-horizon reasoning",
    content: "Long context is crucial. Techniques include context memory management and compression of logs and data to maintain coherence over extended reasoning. The context box now includes user input, environment input, and the AI's internal reasoning.",
  },
  {
    title: "RL and trajectory-based training",
    content: "Reinforcement learning, especially with code execution feedback, enables the model to roll out multiple trajectories and learn effective problem-solving strategies. A human-provided ground truth (e.g., a PR with tests) helps shape rewards and correct trajectories.",
  },
  {
    title: "Benchmarks and real-world validation",
    content: "Meter and SOBench benchmarks track how long models can reason coherently in useful tasks (programming, math, etc.). Real-user AB testing shows practical success; agents reaching longer time horizons (minutes to hours) correlate with real app publishing and economic usefulness.",
  },
  {
    title: "Verification loop and testing",
    content: "The use of a verifier in the loop helps ensure the agent's outputs are correct and optimizes performance. This approach is influenced by Nvidia's work on kernel optimization with verification, enabling longer-running and more reliable agent activity.",
  },
  {
    title: "Context length and memory management",
    content: "Since LLMs have finite context length, memory compression is used to summarize longer memories (e.g., log paragraphs) to keep the agent coherent over long tasks.",
  },
  {
    title: "RL breakthroughs and the role of alpha-go-like reasoning",
    content: "The combination of neural models with discrete, deterministic search methods (tree search, verification) mirrors AlphaGo's hybrid approach: generate candidates with a neural network, then prune with a discrete algorithm to select optimal moves.",
  },
  {
    title: "Domains and verifiability",
    content: "For RL to work effectively, problems must have defined, verifiable outcomes (e.g., coding tasks, math proofs). More subjective domains like law, medicine still struggle due to the need for verifiable ground truths or human adjudication.",
  },
  {
    title: "Synthetic data and human-generated data",
    content: "Foundations models leverage synthetic training data generation, human experts to craft training data with verifiable results, and systems that generate tests and validation results themselves. This helps scale training for software tasks but not to the same extent for more soft domains.",
  },
  {
    title: "Concrete vs. transfer learning",
    content: "The speaker emphasizes that transfer learning across domains remains hard; expertise in one domain doesn't automatically transfer to another. This challenges the notion of universal AGI and aligns with debates about true cross-domain generalization.",
  },
  {
    title: "AGI debate and perspectives",
    content: 'The conversation covers Rogers/Sutton\'s "bitter lesson" and arguments about whether progress should rely on more data and compute (toward AGI) vs. seeking domain-general, transferable intelligence. The speakers acknowledge this is a contentious area with no consensus.',
  },
  {
    title: "Local maxima vs. breakthrough",
    content: 'The idea that the industry may be climbing a local maximum due to "good enough" progress in concrete problems (e.g., coding) while grand, generalized breakthroughs lag behind. This is framed against the possibility of true AGI, which may or may not be within reach in the near term.',
  },
  {
    title: "Practical outlook and future of software development",
    content: "The expectation is that by next year, developers will manage multiple agents in parallel to plan and implement features, refactor databases, and coordinate across teams, with multimodal interfaces enhancing interaction.",
  },
  {
    title: "Personal backstory",
    content: "The speaker shares a personal journey from Jordan to Silicon Valley, early exposure to computing, entrepreneurship in high school, and pivotal moments (e.g., hacking the university system, building web-based programming environments, involvement with Code Academy) that shaped his path and led to founding Replit. Key anecdotes include: Early computer experiences in DOS and batch scripting, and Visual Basic for real software development. A teen entrepreneur building a logging software for a gaming café, learning about business viability. A rebellious stint hacking the university system to adjust grades and the subsequent lessons about responsibility. The pivotal moment when an opportunity to join a major company (Code Academy and later Replit's origin) arose, and the decision to pursue building a platform that runs code in the browser.",
  },
  {
    title: "Philosophical reflections",
    content: 'The speaker contemplates what AGI means, the difference between a "perfect driver" vs. a "better driver," and questions about consciousness, transferability, and the ultimate trajectory of AI. There\'s also humor and candidness about public perception, and a candid view that true AGI may not be realized within our lifetimes, or may require redefining what "AGI" means.',
  },
];

export default {
  keyTakeaways: video3KeyTakeaways,
  detailedNotes: video3DetailedNotes,
  quotes: video3Quotes,
  examples: video3Examples,
};

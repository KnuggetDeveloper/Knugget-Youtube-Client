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

export const video3DetailedNotes = [
  {
    title: "End-to-end product building in 20–30 minutes",
    content: "The agent reads a user's English description (e.g., 'I want to sell crepes online'), proposes tasks (database setup, payments, design), builds the app, tests it in a browser, and publishes to the cloud with a production database.",
  },
  {
    title: "Multi-agent collaboration and orchestration",
    content: "Multiple agents work in parallel on features (design, refactoring, database changes) and then merge their outputs into a cohesive product, with each step feeding the next through summarized prompts.",
  },
  {
    title: "Verification-driven improvement",
    content: "Adding a verifier in the loop (inspired by Nvidia's approach to kernel optimization) to run and validate actions, enabling longer-running, more reliable agent sessions (e.g., 10–20–200 minutes) by checking outcomes and restarting trajectories when issues arise.",
  },
];

export default {
  keyTakeaways: video3KeyTakeaways,
  detailedNotes: video3DetailedNotes,
  quotes: video3Quotes,
};

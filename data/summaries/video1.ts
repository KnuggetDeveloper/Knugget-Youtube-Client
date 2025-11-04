// Video 1: Andrej Karpathy - Complete Summaries
export const video1KeyTakeaways = [
  {
    icon: "🤖",
    text: "The decade of agents vs. year of agents: Andre Karpathy argues that progress will come from progressively capable, multimodal agents that can operate with real-world tasks over a decade, rather than expecting a single 'year of AGI.' This framing emphasizes a staged, additive progression across representations, memory, and interaction with the world.",
  },
  {
    icon: "🧠",
    text: "Pre-training vs. context learning; cognitive core concept: He distinguishes between pre-training (large token-based knowledge encoding with heavy compression) and in-context learning (dynamic working memory, near-term adaptation). He envisions a cognitive core—a lean, memory-light core containing algorithms and problem-solving strategies—surrounded by knowledge that could be distilled or reduced to avoid collapse and improve long-horizon reasoning.",
  },
  {
    icon: "🎓",
    text: "Education as a crucial frontier and societal anchor: Beyond engineering progress, Karpathy is pursuing Eureka and Starfleet Academy as ways to reshape education with AI tutors, ramps to knowledge, and scalable training for millions. He envisions a future where AI-enabled education empowers humans to stay in control and flourish, not replace them.",
  },
];

export const video1Quotes = [
  {
    icon: "👻",
    text: '"We\'re not actually building animals. We\'re building ghosts."',
  },
  {
    icon: "🥤",
    text: '"Sucking supervision through a straw."',
  },
  {
    icon: "📚",
    text: '"Education will pretty fundamentally change with AI on the side… not just as prompting, but as a tutor that understands you and adapts."',
  },
];

export const video1DetailedNotes = [
  {
    title: "Nanochat project and learning philosophy",
    content: "Andre describes Nanochat as a minimal, end-to-end repo with around 8,000 lines, aimed at teaching people to build a complete coding agent; the emphasis on not copy-pasting code to force genuine understanding is a concrete example of his learning philosophy.",
  },
  {
    title: "Reinforcement learning challenges",
    content: 'The "Sucking supervision through a straw" analogy for RL: He contrasts RL\'s high-variance, final-reward-upweighting with how humans learn, highlighting the inefficiency and register of supervision in RL.',
  },
  {
    title: "Eureka and Starfleet Academy vision",
    content: "A concrete plan to revolutionize education—combining AI-assisted instruction with a premier, up-to-date institution to teach frontier technology, plus a scalable digital tier to reach billions.",
  },
];

export default {
  keyTakeaways: video1KeyTakeaways,
  detailedNotes: video1DetailedNotes,
  quotes: video1Quotes,
};

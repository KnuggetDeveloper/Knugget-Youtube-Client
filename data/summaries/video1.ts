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

export const video1Examples = [
  {
    icon: "💻",
    text: "Nanochat project and the discussion of how to build and learn from code: Andre describes Nanohat as a minimal, end-to-end repo with around 8,000 lines, aimed at teaching people to build a complete coding agent; the emphasis on not copy-pasting code to force genuine understanding is a concrete example of his learning philosophy.",
  },
  {
    icon: "🎯",
    text: 'The "Sucking supervision through a straw" analogy for RL: He contrasts RL\'s high-variance, final-reward-upweighting with how humans learn, highlighting the inefficiency and register of supervision in RL. This concrete analogy helps illustrate why model-based, process-based supervision is challenging.',
  },
  {
    icon: "🏫",
    text: "Eureka and Starfleet Academy concept: A concrete plan to revolutionize education—combining AI-assisted instruction with a premier, up-to-date institution to teach frontier technology, plus a scalable digital tier to reach billions. This example grounds his broader vision for AI in societal impact.",
  },
];

export const video1DetailedNotes = [
  {
    title: "General stance on reinforcement learning (RL) and optimism",
    content: 'He begins by calling RL "terrible" in the abstract but insists that prior approaches were worse and that progress is tractable and optimistic. The chatter on social media (fundraising, hype) clouds practical progress; his focus is on building useful systems, not ghostly demos.',
  },
  {
    title: "The decade vs. year framing for agents",
    content: 'The phrase "the decade of agents" is a reaction to the claim that we\'re in the year of agents due to LLMs; he believes the trend will unfold over a decade with gradual improvements. Early agents (Cloud, CodeEx, etc.) are impressive and used daily, but significant work remains: multimodality, continual learning, robust memory, and real-world interaction.',
  },
  {
    title: "How to think about a real agent",
    content: "An agent is like an employee or intern: a tool that should be deployed when it can actually do the work. Current agents fail because they are not intelligent enough, multimodal, or capable of continual learning. The bottlenecks: lack of intelligence, multimodality, ability to use computers, continual lifelong learning, and robust representations.",
  },
  {
    title: "History and breakthroughs in AI as context",
    content: "He contextualizes major shifts: deep learning near Hinton's era; AlexNet's reorientation toward neural nets; Atari/RL shift in 2013 as an early attempt at agents but ultimately a misstep because games don't necessarily lead to general intelligence. He argues for a progression: per-task neural nets, then pretraining representations (the LLM stage), then agents built on top of strong representations, rather than attempting to leap straight to agents.",
  },
  {
    title: "Representations vs. evolution in brains",
    content: 'He cautions against over-anthropomorphizing AI by drawing too close parallels to animal brains: evolution shapes brains with hardwired hardware, while AI builds "ghosts" by imitating humans and data on the internet. Pre-training is framed as a "crappy evolution" that provides a starting point, not the full animal. He sees a path to more animal-like properties by improving representations and architectural stacks on top of LLMs, but it\'s not strictly about mimicking evolution.',
  },
  {
    title: "The role of pre-training and the cognitive core",
    content: "Pre-training encodes knowledge and fosters in-context learning, but the knowledge can become a crutch; a cognitive core—an intelligent, algorithmic essence stripped of excess knowledge—could be more powerful for general problem solving. He emphasizes the need to reduce memory reliance in the weights and to use external or working memory to expand horizon length without bloat.",
  },
  {
    title: "In-context learning vs. pre-training",
    content: "In-context learning is pattern completion within a token window that leverages a vast internet with internalized patterns; it potentially uses a small internal gradient-like process. Some papers show that linear regression can be performed inside the context, suggesting some internal optimization-like phenomenon. The difference between the two: in-context learning uses an active working memory vs. pre-training; weights store a compressed memory of the internet, not raw data.",
  },
  {
    title: "Memory, working memory, and long contexts",
    content: "Weights contain a hazy memory of training data; context windows (KV cache) act as working memory that is directly accessible to the model. They highlight long-context capabilities via sparse attention and memory architectures; future AI likely needs both strong working memory and compact cognitive cores.",
  },
  {
    title: "Architecture and scaling trajectory",
    content: "He predicts that in 10 years, major architectural ideas will persist: giant neural nets trained with gradient descent, but with advances across data, hardware, kernels, and algorithms. He emphasizes that progress requires improvements across multiple dimensions (architecture, optimizer, loss functions) in tandem.",
  },
  {
    title: "Nanochat and code tooling",
    content: "Nanochat is a minimal, end-to-end repository for building a ChatGPT-like assistant; it's intentionally simple to teach the pipeline but is not boilerplate code. He notes limitations in LLMs for code: LLMs can be good for boilerplate or boilerplate-like tasks but struggle with uniquely structured, non-boilerplate, deeply technical code; specific integration decisions by the user are essential.",
  },
  {
    title: "LLMs as a continuum with computing",
    content: 'He views AI as an extension of computing—progress resembles a continuum from compilers to runtime optimizations to AI-assisted coding and beyond. The "autonomy slider" concept is introduced: increasing automation of tasks that can be automated, while leaving humans to supervise higher-level processes.',
  },
  {
    title: "Role of AI in coding vs. other domains",
    content: "AI has been highly effective in coding and text-heavy domains due to structured, textual patterns and well-established tooling (IDEs, diffs, version control). Other domains (slides, non-text visuals) are harder due to lack of robust diffs and standard infrastructure. Even so, there is a gap in applying AI effectively to non-code, non-text tasks, due to the lack of consistent representations and evaluation methods.",
  },
  {
    title: "The nature of education in the AI era",
    content: 'Eureka and Starfleet Academy aim to create elite educational institutions and scalable digital courses, with a focus on "ramps to knowledge" and Eurekas per second. The goal is not only to teach but to empower and safeguard humanity by equipping people to understand and guide AI, preventing a dystopian outcome. The near-term plan: hire faculty to build state-of-the-art courses; later, AI assistants may act as TAs; in the long term, AI could take over more design and instruction tasks.',
  },
  {
    title: "The concept of culture and multi-agent systems",
    content: 'He believes a true AI culture among LLMs would require agents that can create, read, and respond to each other\'s content, akin to cultural transmission and self-play. He expects a gradual emergence of culture and collaboration rather than a sudden, singular "AGI moment."',
  },
  {
    title: "Self-driving as a comparison",
    content: "He uses self-driving as a benchmark and argues it's not a complete analogy to AI education or coding agents. The self-driving domain is safety-critical and requires robust perception and generalization, which is analogous to real-world deployment constraints for AI agents. He notes that self-driving progress is slow due to safety, regulatory, and deployment constraints; the AI coding domain may progress differently due to lower physical risk costs.",
  },
  {
    title: "AGI, growth, and economic impact",
    content: "He distinguishes two camps: one that expects an economic explosion (a discrete leap, a singular breakthrough) and one that expects gradual diffusion of AI capabilities across industries. He is skeptical of a sudden, singular AGI leap but acknowledges that AI will diffuse across the economy, with productivity gains accruing to both coders and non-coders as automation expands. He emphasizes that the growth rate of the economy has been accelerating slowly due to automation for centuries and expects AI to follow a similar trajectory—more gradual, not a sudden jump.",
  },
  {
    title: "Safety, governance, and societal impact",
    content: "He expresses concern about humanity's ability to manage increasingly autonomous AI systems and emphasizes the importance of education to keep humans in control. He acknowledges geopolitical and regulatory considerations and urges grounding expectations in reality and caution to avoid missteps.",
  },
  {
    title: "Final notes on personal journey and philosophy",
    content: 'He discusses his roles, the evolution from Tesla to OpenAI-style environments, and his personal belief that "the geniuses of today are barely scratching the surface" of human potential. He reiterates that he remains optimistic about the potential of AI, provided that education, governance, and responsible deployment keep pace with technical advances.',
  },
];

export default {
  keyTakeaways: video1KeyTakeaways,
  detailedNotes: video1DetailedNotes,
  quotes: video1Quotes,
  examples: video1Examples,
};

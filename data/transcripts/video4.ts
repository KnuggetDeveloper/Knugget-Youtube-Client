export const video4Transcripts = [
  {
    time: "0:00",
    text: "[Music]",
  },
  {
    time: "0:17",
    text: "Wow, it's uh incredible to be on the",
  },
  {
    time: "0:18",
    text: "same stage as uh so many people I've",
  },
  {
    time: "0:20",
    text: "learned so much from. Let's get into it.",
  },
  {
    time: "0:23",
    text: "My name is Barry and today we're going",
  },
  {
    time: "0:25",
    text: "to be talking about how we build",
  },
  {
    time: "0:26",
    text: "effective",
  },
  {
    time: "0:28",
    text: "agents. About two months ago, Eric and I",
  },
  {
    time: "0:31",
    text: "wrote a blog post called Building",
  },
  {
    time: "0:32",
    text: "Effective Agents. In there, we shared",
  },
  {
    time: "0:35",
    text: "some opinionated take on what an agent",
  },
  {
    time: "0:37",
    text: "is and isn't, and we give some practical",
  },
  {
    time: "0:39",
    text: "learnings that we have gained along the",
  },
  {
    time: "0:41",
    text: "way. Today, I'd like to go deeper on",
  },
  {
    time: "0:44",
    text: "three core ideas from the blog post and",
  },
  {
    time: "0:46",
    text: "provide you with some personal musings",
  },
  {
    time: "0:48",
    text: "at the",
  },
  {
    time: "0:49",
    text: "end. Here are those",
  },
  {
    time: "0:52",
    text: "ideas. First, don't build agents for",
  },
  {
    time: "0:55",
    text: "everything. Second, keep it simple. And",
  },
  {
    time: "0:58",
    text: "third, think like your",
  },
  {
    time: "1:01",
    text: "agents. Let's first start with a recap",
  },
  {
    time: "1:04",
    text: "of how we got here. Most of us probably",
  },
  {
    time: "1:07",
    text: "started building very simple features.",
  },
  {
    time: "1:09",
    text: "Things like summarization,",
  },
  {
    time: "1:10",
    text: "classification, extraction, just really",
  },
  {
    time: "1:13",
    text: "simple things that felt like magic two",
  },
  {
    time: "1:14",
    text: "to three years ago and have now become",
  },
  {
    time: "1:16",
    text: "table stakes. Then as we got more",
  },
  {
    time: "1:19",
    text: "sophisticated and as products mature, we",
  },
  {
    time: "1:22",
    text: "got more creative. One model call often",
  },
  {
    time: "1:24",
    text: "wasn't enough. So we started",
  },
  {
    time: "1:26",
    text: "orchestrating multiple model calls in",
  },
  {
    time: "1:28",
    text: "predefined control flows. This basically",
  },
  {
    time: "1:32",
    text: "gave us a way to trade off cause and",
  },
  {
    time: "1:33",
    text: "latency for better performance and we",
  },
  {
    time: "1:36",
    text: "call these",
  },
  {
    time: "1:37",
    text: "workflows. We believe this is the",
  },
  {
    time: "1:39",
    text: "beginning of agentic",
  },
  {
    time: "1:42",
    text: "systems. Now models are even more",
  },
  {
    time: "1:44",
    text: "capable and we are seeing more and more",
  },
  {
    time: "1:47",
    text: "domain domain specific agents start to",
  },
  {
    time: "1:49",
    text: "pop up in production. Unlike workflows,",
  },
  {
    time: "1:52",
    text: "agents can decide their own trajectory",
  },
  {
    time: "1:54",
    text: "and operate almost independently based",
  },
  {
    time: "1:57",
    text: "on environment feedback. This is going",
  },
  {
    time: "1:59",
    text: "to be our focus",
  },
  {
    time: "2:01",
    text: "today. It's probably a little bit too",
  },
  {
    time: "2:04",
    text: "early to name what the next phase of",
  },
  {
    time: "2:05",
    text: "agentic system is going to look like,",
  },
  {
    time: "2:07",
    text: "especially in production. Single agents",
  },
  {
    time: "2:09",
    text: "could become a lot more general purpose",
  },
  {
    time: "2:11",
    text: "and more capable or we can start to see",
  },
  {
    time: "2:13",
    text: "collaboration and delegation in multi-",
  },
  {
    time: "2:14",
    text: "aent settings. Regardless, I think the",
  },
  {
    time: "2:17",
    text: "broad trend here is that as we give",
  },
  {
    time: "2:20",
    text: "these systems a lot more agency, they",
  },
  {
    time: "2:22",
    text: "become more useful and more capable. But",
  },
  {
    time: "2:24",
    text: "as a result, the cost, the latency, the",
  },
  {
    time: "2:27",
    text: "consequences of errors also go",
  },
  {
    time: "2:29",
    text: "up. And that brings us to the first",
  },
  {
    time: "2:31",
    text: "point. Don't build agents for",
  },
  {
    time: "2:34",
    text: "everything. Well, why not? We think of",
  },
  {
    time: "2:38",
    text: "agents as a way to scale complex and",
  },
  {
    time: "2:40",
    text: "valuable tasks. They shouldn't be a drop",
  },
  {
    time: "2:42",
    text: "in upgrade for every use case. If uh if",
  },
  {
    time: "2:46",
    text: "you have read the blog post, you'll know",
  },
  {
    time: "2:47",
    text: "that we talked a lot about workflows and",
  },
  {
    time: "2:49",
    text: "that's because we really like them and",
  },
  {
    time: "2:51",
    text: "they're a great concrete way to deliver",
  },
  {
    time: "2:53",
    text: "values",
  },
  {
    time: "2:54",
    text: "today. Well, so when should you build an",
  },
  {
    time: "2:57",
    text: "agent? Here's our",
  },
  {
    time: "2:59",
    text: "checklist. The first thing to consider",
  },
  {
    time: "3:01",
    text: "is the complexity of your task. Agents",
  },
  {
    time: "3:04",
    text: "really thrive in ambiguous problem",
  },
  {
    time: "3:06",
    text: "spaces. And if you can map out the",
  },
  {
    time: "3:08",
    text: "entire decision tree pretty easily, just",
  },
  {
    time: "3:11",
    text: "build that explicitly and then optimize",
  },
  {
    time: "3:13",
    text: "every node of that decision tree, it's a",
  },
  {
    time: "3:16",
    text: "lot more cost- effective and it's going",
  },
  {
    time: "3:17",
    text: "to give you a lot more",
  },
  {
    time: "3:19",
    text: "control. Next thing to consider is the",
  },
  {
    time: "3:21",
    text: "value of your task. That exploration I",
  },
  {
    time: "3:23",
    text: "just mentioned is going to cost you a",
  },
  {
    time: "3:25",
    text: "lot of tokens. So the task really needs",
  },
  {
    time: "3:27",
    text: "to justify the cost. If your budget per",
  },
  {
    time: "3:31",
    text: "task is around 10 cents, for example,",
  },
  {
    time: "3:33",
    text: "you're building a u high volume customer",
  },
  {
    time: "3:35",
    text: "support system, that only affords you 30",
  },
  {
    time: "3:38",
    text: "to 50,000 tokens. In that case, just use",
  },
  {
    time: "3:41",
    text: "a workflow to solve the most common",
  },
  {
    time: "3:43",
    text: "scenarios and you're able to capture the",
  },
  {
    time: "3:44",
    text: "majority of the values from there. On",
  },
  {
    time: "3:48",
    text: "the other hand, though, if you look at",
  },
  {
    time: "3:49",
    text: "this question and your first thought is,",
  },
  {
    time: "3:51",
    text: "I don't care how many tokens I spend. I",
  },
  {
    time: "3:53",
    text: "just want to get the task done. Please",
  },
  {
    time: "3:55",
    text: "see me after the talk. Our go to market",
  },
  {
    time: "3:56",
    text: "team would love to speak with you.",
  },
  {
    time: "4:00",
    text: "From there, we want to derisk the",
  },
  {
    time: "4:02",
    text: "critical capabilities. This is to make",
  },
  {
    time: "4:04",
    text: "sure that there aren't any significant",
  },
  {
    time: "4:06",
    text: "bottlenecks in the agent's trajectory.",
  },
  {
    time: "4:09",
    text: "If you're doing a coding agent, you want",
  },
  {
    time: "4:10",
    text: "to make sure it's able to write good",
  },
  {
    time: "4:11",
    text: "code, it's able to debug, and it's able",
  },
  {
    time: "4:13",
    text: "to recover from its",
  },
  {
    time: "4:15",
    text: "errors. If you do have bottlenecks,",
  },
  {
    time: "4:18",
    text: "that's probably not going to be fatal,",
  },
  {
    time: "4:20",
    text: "but they will multiply your cost and",
  },
  {
    time: "4:21",
    text: "latency. So, in that case, we normally",
  },
  {
    time: "4:24",
    text: "just reduce the scope, simplify the",
  },
  {
    time: "4:26",
    text: "task, and try again.",
  },
  {
    time: "4:29",
    text: "Finally, the the the last important",
  },
  {
    time: "4:32",
    text: "thing to consider is the cost of error",
  },
  {
    time: "4:34",
    text: "and error discovery. If your errors are",
  },
  {
    time: "4:37",
    text: "going to be high stake and very hard to",
  },
  {
    time: "4:39",
    text: "discover, it's going to be very",
  },
  {
    time: "4:40",
    text: "difficult for you to trust the agent to",
  },
  {
    time: "4:42",
    text: "take actions on your behalf and to have",
  },
  {
    time: "4:44",
    text: "more autonomy. You can always mitigate",
  },
  {
    time: "4:46",
    text: "this by limiting the scope, right? You",
  },
  {
    time: "4:48",
    text: "can have read only access. You can have",
  },
  {
    time: "4:50",
    text: "more human in the loop, but this will",
  },
  {
    time: "4:53",
    text: "also limit how well you're able to scale",
  },
  {
    time: "4:55",
    text: "your agent in your use case.",
  },
  {
    time: "4:58",
    text: "Let's see this checklist in in action.",
  },
  {
    time: "5:00",
    text: "Why is coding a great agent use case?",
  },
  {
    time: "5:03",
    text: "First, to go from design doc to a PR is",
  },
  {
    time: "5:06",
    text: "obviously a very ambiguous and very",
  },
  {
    time: "5:08",
    text: "complex task. And second, um we're a lot",
  },
  {
    time: "5:11",
    text: "of us are developers here, so we know",
  },
  {
    time: "5:13",
    text: "that good code has a lot of value. And",
  },
  {
    time: "5:16",
    text: "third, many of us already use cloud for",
  },
  {
    time: "5:18",
    text: "coding. So we know that it's great at",
  },
  {
    time: "5:20",
    text: "many parts of the coding workflow. And",
  },
  {
    time: "5:23",
    text: "last, coding has this really nice",
  },
  {
    time: "5:25",
    text: "property where the output is easily",
  },
  {
    time: "5:28",
    text: "verifiable through unit test and CI. And",
  },
  {
    time: "5:31",
    text: "that's probably why we're seeing so many",
  },
  {
    time: "5:33",
    text: "creative and successful coding agents.",
  },
  {
    time: "5:35",
    text: "Right",
  },
  {
    time: "5:38",
    text: "now, once you find a good use case for",
  },
  {
    time: "5:41",
    text: "agents, this is the second core idea,",
  },
  {
    time: "5:44",
    text: "which is to keep it as simple as",
  },
  {
    time: "5:46",
    text: "possible. Let me show you what I",
  },
  {
    time: "5:49",
    text: "mean. This is what agents look like to",
  },
  {
    time: "5:51",
    text: "us. They're models using tools in a",
  },
  {
    time: "5:54",
    text: "loop. And in this frame, three",
  },
  {
    time: "5:57",
    text: "components define what an agent really",
  },
  {
    time: "5:59",
    text: "looks like. First is the environment.",
  },
  {
    time: "6:02",
    text: "This is a system that the agent is",
  },
  {
    time: "6:03",
    text: "operating",
  },
  {
    time: "6:04",
    text: "in. Then we have a set of tools which",
  },
  {
    time: "6:07",
    text: "offer an interface for the agent to take",
  },
  {
    time: "6:09",
    text: "action and get",
  },
  {
    time: "6:11",
    text: "feedback. Then we have the system prompt",
  },
  {
    time: "6:13",
    text: "which defines the goals, the constraints",
  },
  {
    time: "6:15",
    text: "and the ideal behavior for the agent to",
  },
  {
    time: "6:18",
    text: "actually work in this environment.",
  },
  {
    time: "6:20",
    text: "Then the model gets called in a loop and",
  },
  {
    time: "6:24",
    text: "that's",
  },
  {
    time: "6:25",
    text: "agents. We have learned the hard way to",
  },
  {
    time: "6:27",
    text: "keep this simple because any complexity",
  },
  {
    time: "6:29",
    text: "up front is really going to kill",
  },
  {
    time: "6:31",
    text: "iteration speed. Iterating on just these",
  },
  {
    time: "6:34",
    text: "three basic components is going to give",
  },
  {
    time: "6:35",
    text: "you by far the highest ROI and",
  },
  {
    time: "6:37",
    text: "optimizations can come",
  },
  {
    time: "6:41",
    text: "later. Here are examples of three agent",
  },
  {
    time: "6:44",
    text: "use cases that we have built for",
  },
  {
    time: "6:45",
    text: "ourselves or or our customers just to",
  },
  {
    time: "6:47",
    text: "make it more concrete. They're going to",
  },
  {
    time: "6:49",
    text: "look very different on the product",
  },
  {
    time: "6:51",
    text: "surface. They're going to look very",
  },
  {
    time: "6:52",
    text: "different in their scope. They're going",
  },
  {
    time: "6:53",
    text: "to look different in the capability, but",
  },
  {
    time: "6:55",
    text: "they share almost exactly the same",
  },
  {
    time: "6:57",
    text: "backbone. They they actually share",
  },
  {
    time: "7:00",
    text: "almost the exact same",
  },
  {
    time: "7:01",
    text: "code. The environment largely depends on",
  },
  {
    time: "7:04",
    text: "your use case. So really the only two",
  },
  {
    time: "7:06",
    text: "design decisions is what are the set of",
  },
  {
    time: "7:08",
    text: "tools you want to offer to the agent and",
  },
  {
    time: "7:10",
    text: "what is the prompt that you want to",
  },
  {
    time: "7:12",
    text: "instruct your agent to follow.",
  },
  {
    time: "7:16",
    text: "Um, on this note, if you want to learn",
  },
  {
    time: "7:17",
    text: "more about tools, my friend Mahes is",
  },
  {
    time: "7:19",
    text: "going to be giving a workshop on model",
  },
  {
    time: "7:21",
    text: "context protocol MCP tomorrow morning.",
  },
  {
    time: "7:23",
    text: "Um, I've seen that workshop. It's going",
  },
  {
    time: "7:25",
    text: "to be really fun. So, I highly encourage",
  },
  {
    time: "7:26",
    text: "you guys to to check that out. Um, but",
  },
  {
    time: "7:29",
    text: "back to our talk. Once you have figured",
  },
  {
    time: "7:31",
    text: "out these three basic components, you",
  },
  {
    time: "7:33",
    text: "have a lot of optimizations to do from",
  },
  {
    time: "7:34",
    text: "there. Uh, for coding and computer use,",
  },
  {
    time: "7:37",
    text: "uh, you might want to, uh, catch the",
  },
  {
    time: "7:39",
    text: "trajectory to reduce cost. For search",
  },
  {
    time: "7:41",
    text: "where you have a lot of tool calls, you",
  },
  {
    time: "7:43",
    text: "can parallelize a lot of those to reduce",
  },
  {
    time: "7:45",
    text: "latency. And for almost all of these, we",
  },
  {
    time: "7:47",
    text: "want to make sure to present the agents",
  },
  {
    time: "7:49",
    text: "progress in such a way that gain user",
  },
  {
    time: "7:51",
    text: "trust. But that's it. Keep it as simple",
  },
  {
    time: "7:54",
    text: "as possible as you're iterating. Build",
  },
  {
    time: "7:56",
    text: "these three components first and then",
  },
  {
    time: "7:58",
    text: "optimize once you have the behaviors",
  },
  {
    time: "8:03",
    text: "down. All right, this is the last idea.",
  },
  {
    time: "8:06",
    text: "Um, is to think like your agents. I've",
  },
  {
    time: "8:09",
    text: "seen a lot of builders and myself",
  },
  {
    time: "8:11",
    text: "included who develop agents from our own",
  },
  {
    time: "8:13",
    text: "perspectives and get confused when",
  },
  {
    time: "8:16",
    text: "agents make a mistake. It seems",
  },
  {
    time: "8:17",
    text: "counterintuitive to us. And that's why",
  },
  {
    time: "8:20",
    text: "we always recommend to put yourself in",
  },
  {
    time: "8:22",
    text: "the agents context",
  },
  {
    time: "8:24",
    text: "window. Agents can exhibit some really",
  },
  {
    time: "8:27",
    text: "sophisticated behavior. It could look",
  },
  {
    time: "8:28",
    text: "incredibly complex, but at each step,",
  },
  {
    time: "8:32",
    text: "what the model is doing is still just",
  },
  {
    time: "8:33",
    text: "running inference on a very limited set",
  },
  {
    time: "8:35",
    text: "of contexts.",
  },
  {
    time: "8:37",
    text: "Everything that the model knows about",
  },
  {
    time: "8:39",
    text: "the current state of the world is going",
  },
  {
    time: "8:41",
    text: "to be explained in that 10 to 20k",
  },
  {
    time: "8:43",
    text: "tokens. And it's really helpful to limit",
  },
  {
    time: "8:46",
    text: "ourselves in that context and see if",
  },
  {
    time: "8:48",
    text: "it's actually sufficient and coherent.",
  },
  {
    time: "8:51",
    text: "This will give you a much better",
  },
  {
    time: "8:52",
    text: "understanding of how agents see the",
  },
  {
    time: "8:54",
    text: "world and then kind of bridge the gap",
  },
  {
    time: "8:56",
    text: "between our understanding and",
  },
  {
    time: "9:00",
    text: "theirs. Let's imagine for a second that",
  },
  {
    time: "9:02",
    text: "we're computer use agents now and then",
  },
  {
    time: "9:04",
    text: "see what that feels like. All we're",
  },
  {
    time: "9:06",
    text: "going to get is a static screenshot and",
  },
  {
    time: "9:09",
    text: "a very poorly written description. This",
  },
  {
    time: "9:11",
    text: "is by yours truly. Let's read through",
  },
  {
    time: "9:12",
    text: "it. You know, you're a computer use",
  },
  {
    time: "9:14",
    text: "agent. You have a set of tools and you",
  },
  {
    time: "9:16",
    text: "have a task. Terrible. Uh we can think",
  },
  {
    time: "9:19",
    text: "and talk and reason all we want, but the",
  },
  {
    time: "9:22",
    text: "only thing that's going to take effect",
  },
  {
    time: "9:23",
    text: "in the environment are our",
  },
  {
    time: "9:25",
    text: "tools. So, we attempt a click without",
  },
  {
    time: "9:28",
    text: "really seeing what's happening. And",
  },
  {
    time: "9:30",
    text: "while the inference is happening, while",
  },
  {
    time: "9:32",
    text: "the two execution is happening, this is",
  },
  {
    time: "9:34",
    text: "basically equivalent to us closing our",
  },
  {
    time: "9:36",
    text: "eyes for three to five seconds and using",
  },
  {
    time: "9:38",
    text: "the computer in the dark. Then you open",
  },
  {
    time: "9:41",
    text: "up your eyes and you see another",
  },
  {
    time: "9:42",
    text: "screenshot. Whatever you did could have",
  },
  {
    time: "9:44",
    text: "worked or you could have shut down the",
  },
  {
    time: "9:46",
    text: "computer. You just don't know. This is a",
  },
  {
    time: "9:48",
    text: "huge lethal phase and the cycle kind of",
  },
  {
    time: "9:50",
    text: "starts again. I highly recommend just",
  },
  {
    time: "9:53",
    text: "trying doing a full task from the",
  },
  {
    time: "9:56",
    text: "agent's perspective like this. I promise",
  },
  {
    time: "9:58",
    text: "you it's a fascinating and only mildly",
  },
  {
    time: "10:00",
    text: "uncomfortable",
  },
  {
    time: "10:04",
    text: "experience. However, once you go through",
  },
  {
    time: "10:06",
    text: "that mildly uncomfortable experience, uh",
  },
  {
    time: "10:08",
    text: "I think it becomes very clear what the",
  },
  {
    time: "10:10",
    text: "agents would have actually needed. It's",
  },
  {
    time: "10:12",
    text: "clearly very crucial to know uh what the",
  },
  {
    time: "10:14",
    text: "screen resolution is so I know how to",
  },
  {
    time: "10:16",
    text: "click. Um it's also good to have",
  },
  {
    time: "10:19",
    text: "recommended actions and limitations just",
  },
  {
    time: "10:21",
    text: "so that you know uh we can uh put some",
  },
  {
    time: "10:23",
    text: "guardrails around uh what we should be",
  },
  {
    time: "10:25",
    text: "exploring and we can avoid unnecessary",
  },
  {
    time: "10:28",
    text: "exploration. These are just some",
  },
  {
    time: "10:29",
    text: "examples and you know do this exercise",
  },
  {
    time: "10:31",
    text: "for your own own agent use case and",
  },
  {
    time: "10:34",
    text: "figure out what kind of context do you",
  },
  {
    time: "10:35",
    text: "actually want to provide for the",
  },
  {
    time: "10:38",
    text: "agent. Fortunately though um we are",
  },
  {
    time: "10:41",
    text: "building systems that speak our",
  },
  {
    time: "10:42",
    text: "language. So we could just ask cloud to",
  },
  {
    time: "10:44",
    text: "understand cloud. You can throw in your",
  },
  {
    time: "10:47",
    text: "your system prompt and ask well is any",
  },
  {
    time: "10:49",
    text: "of this instruction ambiguous? Does it",
  },
  {
    time: "10:51",
    text: "make sense to you? Are you able to",
  },
  {
    time: "10:52",
    text: "follow this? You can throw in a two",
  },
  {
    time: "10:54",
    text: "description and see whether the agent",
  },
  {
    time: "10:56",
    text: "knows how to use the tool. You can see",
  },
  {
    time: "10:58",
    text: "if it wants more parameter, fewer",
  },
  {
    time: "11:00",
    text: "parameter. And one thing that we do",
  },
  {
    time: "11:02",
    text: "quite frequently is we throw the entire",
  },
  {
    time: "11:04",
    text: "agent's trajectory into cloud and just",
  },
  {
    time: "11:06",
    text: "ask it, hey, why do you think we made",
  },
  {
    time: "11:08",
    text: "this decision right here? And is there",
  },
  {
    time: "11:10",
    text: "anything that we can do to help you make",
  },
  {
    time: "11:12",
    text: "better decisions?",
  },
  {
    time: "11:14",
    text: "This shouldn't replace your own",
  },
  {
    time: "11:16",
    text: "understanding of the context, but you'll",
  },
  {
    time: "11:17",
    text: "help you gain a much closer perspective",
  },
  {
    time: "11:19",
    text: "on how the agent is seeing the world. So",
  },
  {
    time: "11:22",
    text: "once again, think like your agent as",
  },
  {
    time: "11:24",
    text: "you're",
  },
  {
    time: "11:26",
    text: "iterating. All right. Uh I've I've spent",
  },
  {
    time: "11:29",
    text: "most of the talk about very practical",
  },
  {
    time: "11:31",
    text: "stuff. Uh I'm going to indulge myself",
  },
  {
    time: "11:32",
    text: "and spend one slide on personal musings.",
  },
  {
    time: "11:35",
    text: "This is going to be my view on how this",
  },
  {
    time: "11:37",
    text: "might evolve and some open questions I",
  },
  {
    time: "11:39",
    text: "think we need to answer together as AI",
  },
  {
    time: "11:41",
    text: "engineers.",
  },
  {
    time: "11:43",
    text: "These are the top three things that are",
  },
  {
    time: "11:44",
    text: "always on my mind. First, I think we",
  },
  {
    time: "11:47",
    text: "need to make agents a lot more budget",
  },
  {
    time: "11:49",
    text: "aare. Unlike workflows, we don't really",
  },
  {
    time: "11:52",
    text: "have a great sense of control for the",
  },
  {
    time: "11:53",
    text: "cost and latency for agents. I think",
  },
  {
    time: "11:56",
    text: "figuring this out will enable a lot more",
  },
  {
    time: "11:58",
    text: "use cases as it gives us the necessary",
  },
  {
    time: "12:00",
    text: "control to deploy them in production.",
  },
  {
    time: "12:02",
    text: "The open question is just what's the",
  },
  {
    time: "12:04",
    text: "best way to define and enforce budgets",
  },
  {
    time: "12:06",
    text: "in terms of time, in terms of money, in",
  },
  {
    time: "12:08",
    text: "terms of tokens, the things that we care",
  },
  {
    time: "12:10",
    text: "about.",
  },
  {
    time: "12:12",
    text: "Next up is this concept of self-evolving",
  },
  {
    time: "12:14",
    text: "tools. I've I've already hinted at this",
  },
  {
    time: "12:16",
    text: "two slides ago, but uh we are already",
  },
  {
    time: "12:18",
    text: "using models to help iterate on the two",
  },
  {
    time: "12:21",
    text: "description, but this should generalize",
  },
  {
    time: "12:23",
    text: "pretty well into a meta tool where",
  },
  {
    time: "12:25",
    text: "agents can design and improve their own",
  },
  {
    time: "12:27",
    text: "tool",
  },
  {
    time: "12:28",
    text: "ergonomics. This will make agents a lot",
  },
  {
    time: "12:30",
    text: "more general purpose as they can adopt",
  },
  {
    time: "12:32",
    text: "the tools that they need for each use",
  },
  {
    time: "12:36",
    text: "case. Finally, um I don't even think",
  },
  {
    time: "12:38",
    text: "this is a hot take anymore. I have a",
  },
  {
    time: "12:40",
    text: "personal conviction that we will see a",
  },
  {
    time: "12:42",
    text: "lot more multi- aent uh collaborations",
  },
  {
    time: "12:44",
    text: "in production by the end of this year.",
  },
  {
    time: "12:46",
    text: "They're well parallelized. They have",
  },
  {
    time: "12:48",
    text: "very nice separation of concerns and",
  },
  {
    time: "12:50",
    text: "having sub agent for example will really",
  },
  {
    time: "12:53",
    text: "protect the main agents context",
  },
  {
    time: "12:55",
    text: "window. Um but I think a big open",
  },
  {
    time: "12:59",
    text: "question here is um how how do these",
  },
  {
    time: "13:02",
    text: "agents actually communicate with each",
  },
  {
    time: "13:03",
    text: "other? We're currently in this very",
  },
  {
    time: "13:05",
    text: "rigid frame of having mostly synchronous",
  },
  {
    time: "13:08",
    text: "user assistant terms and I think most of",
  },
  {
    time: "13:11",
    text: "our systems are built around that. So",
  },
  {
    time: "13:13",
    text: "how do we expand from there and build in",
  },
  {
    time: "13:14",
    text: "asynchronous communication and and",
  },
  {
    time: "13:16",
    text: "enable more roles that that afford",
  },
  {
    time: "13:18",
    text: "agents to communicate with each other",
  },
  {
    time: "13:20",
    text: "and recognize each other? I think that's",
  },
  {
    time: "13:22",
    text: "going to be a big open question as we",
  },
  {
    time: "13:23",
    text: "explore this more multi- aent",
  },
  {
    time: "13:26",
    text: "future. These are the areas that take up",
  },
  {
    time: "13:28",
    text: "a lot of my mind space. If you're also",
  },
  {
    time: "13:30",
    text: "thinking about this uh please shoot me a",
  },
  {
    time: "13:33",
    text: "text. I would love to",
  },
  {
    time: "13:35",
    text: "chat. Okay, let's uh bring it all",
  },
  {
    time: "13:38",
    text: "together. If you forget everything I",
  },
  {
    time: "13:40",
    text: "said today, these are the three",
  },
  {
    time: "13:41",
    text: "takeaways. First, don't build agents for",
  },
  {
    time: "13:44",
    text: "everything. If you do find a good use",
  },
  {
    time: "13:46",
    text: "case and want to build an agent, keep it",
  },
  {
    time: "13:48",
    text: "as simple for as long as possible. And",
  },
  {
    time: "13:51",
    text: "finally, as you iterate, try to think",
  },
  {
    time: "13:54",
    text: "like your agent, gain their perspective,",
  },
  {
    time: "13:56",
    text: "and help them do their job.",
  },
  {
    time: "14:00",
    text: "I would love to keep in touch with",
  },
  {
    time: "14:01",
    text: "everyone of you. If you want to chat",
  },
  {
    time: "14:03",
    text: "about agents, especially those open",
  },
  {
    time: "14:04",
    text: "questions that I talked about, uh you'll",
  },
  {
    time: "14:06",
    text: "be incredibly lovely. You can just, you",
  },
  {
    time: "14:08",
    text: "know, uh jam on some of these ideas. Uh",
  },
  {
    time: "14:12",
    text: "these are my socials if you want to get",
  },
  {
    time: "14:14",
    text: "connected. And I'm going to end the",
  },
  {
    time: "14:15",
    text: "presentation on a personal anecdote. So",
  },
  {
    time: "14:18",
    text: "back in 2023, I was building AI product",
  },
  {
    time: "14:20",
    text: "at Meta and we had this funny thing",
  },
  {
    time: "14:22",
    text: "where we could change our job",
  },
  {
    time: "14:24",
    text: "description to anything we want. Um,",
  },
  {
    time: "14:26",
    text: "after reading that blog post from Swix,",
  },
  {
    time: "14:28",
    text: "I decided I was going to be the first AI",
  },
  {
    time: "14:30",
    text: "engineer. Uh, I I really love the focus",
  },
  {
    time: "14:33",
    text: "on practicality and just making AI",
  },
  {
    time: "14:35",
    text: "actually useful to the world. And I",
  },
  {
    time: "14:38",
    text: "think that aspiration brought me here",
  },
  {
    time: "14:39",
    text: "today. So, I hope you enjoy the rest of",
  },
  {
    time: "14:42",
    text: "the AI engineer summit. And in the",
  },
  {
    time: "14:44",
    text: "meantime, let's keep building. Thank",
  },
  {
    time: "14:46",
    text: "you.",
  },
  {
    time: "14:51",
    text: "[Music]",
  },
];

export default video4Transcripts;

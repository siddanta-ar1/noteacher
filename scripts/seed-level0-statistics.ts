/**
 * Seed Script: Level 0 - Statistical Thinking
 * 
 * Premium, polished content for the demo course.
 * Clears all existing courses and creates the Statistics 101 course.
 * 
 * Run with: npx tsx scripts/seed-level0-statistics.ts
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Fixed UUID for consistent demo
const COURSE_ID = "11111111-1111-1111-1111-111111111111";

// ============================================================
// HELPER: Generate unique block IDs
// ============================================================
let blockCounter = 0;
function blockId(prefix: string): string {
    return `${prefix}-${++blockCounter}`;
}

// ============================================================
// TOPIC 1: Why Statistics Exists
// ============================================================
const TOPIC_1_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 25,
        difficulty: "beginner",
        objectives: [
            "Understand why statistics is essential for handling large data",
            "Learn how statistics reveals the 'big picture'",
            "Recognize the limitations of personal experience"
        ],
        teacherContext: "This topic establishes the foundational 'why' of statistics. Focus on relatable examples and the contrast between individual perception and collective truth."
    },
    blocks: [
        // INTRO
        {
            id: blockId("text"),
            type: "text",
            content: "# Why Statistics Exists",
            style: "heading",
            animation: { type: "fade", duration: 0.6 }
        },
        {
            id: blockId("text"),
            type: "text",
            content: "The human mind has a fundamental limitation: **we can only see what's in front of us.** When data grows beyond a handful of examples, our natural ability to observe, compare, and conclude... simply breaks down.",
            style: "default",
            animation: { type: "slide", direction: "up" }
        },

        // Subtopic 1: Conclusion of Data Cluster
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 1: The Data Cluster Problem",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Imagine a school principal who wants to understand student performance after exams. There are **1,000 students** across **30 classes**. Can she review every single result? Impossible.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Insight:** Statistics allows us to represent the performance of an entire class with a **single number**—the average. Now, instead of drowning in 1,000 data points, the principal observes just 30 numbers and instantly sees the story.",
            style: "callout"
        },
        {
            id: blockId("simulation"),
            type: "simulation",
            simulationId: "DataFog",
            instructions: "Watch as raw student data transforms into clear, digestible statistics. Click 'Reveal Pattern' to see how statistics cuts through the fog."
        },

        // Subtopic 2: Understanding Collective Phenomena
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 2: Seeing the Big Picture",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "We are **locally minded**—we only truly understand what happens in our immediate surroundings. You might witness a birth or death in your neighborhood, but what's happening across your *entire country*? You have no idea... unless statistics tells you.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Consider this: If the death rate in one state suddenly spikes by **40%**, the government needs to act immediately. But how would they even *know* without statistical data collection?",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **Key Point:** Statistics is the telescope that lets individuals—and governments—see beyond the horizon of personal experience.",
            style: "callout"
        },

        // Subtopic 3: The Small Sample Trap
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 3: The 'Small Sample' Trap",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Our brains are wired to trust our **own experiences** more than data from thousands of others. This is a cognitive trap.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example:* You eat a burger from a restaurant and get sick. Your brain screams: **\"That restaurant is dangerous!\"** But wait—thousands of others ate the same burger and felt fine. Was it really the burger, or something else entirely?",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Statistics moves us from **\"I feel\"** to **\"We know\"** by analyzing the whole group, not just the individual. Your single experience is *statistically insignificant*.",
            style: "default"
        },

        // Subtopic 4: Individual Cases Mislead
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 4: Why Individual Cases Mislead",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "One person's experience is **not the whole truth**. Individual opinions carry inherent bias—we need a way to see the *overall* picture.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example:* Ask one student: \"How hard was the exam?\" One says *\"Brutal!\"* Another says *\"Easy!\"* Who's right? Neither—and both. The **truth** lies in the aggregate.",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "The same applies to medicine. A new drug might work wonders for Patient A but fail for Patient B. Doctors can't prescribe based on one success story. They need **statistical evidence** of effectiveness across thousands of patients.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Bottom Line:** Statistics is the bridge from subjective experience to objective reality. It gets us *closer to the truth*.",
            style: "callout"
        },

        // QUIZ SECTION
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## 🧠 Knowledge Check",
            style: "heading"
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Why does having a lot of data become a problem?",
            options: [
                "Data becomes expensive",
                "Data becomes outdated",
                "The human brain cannot understand everything at once",
                "Data disappears"
            ],
            correctIndex: 2,
            explanation: "Our cognitive capacity is limited. When data scales beyond a few examples, we lose the ability to observe and conclude effectively."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "What is the main reason statistics exists?",
            options: [
                "To make exams harder",
                "To confuse people with numbers",
                "To help understand large amounts of information",
                "To replace human thinking"
            ],
            correctIndex: 2,
            explanation: "Statistics exists to transform overwhelming data into understandable insights."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Which situation best shows the need for statistics?",
            options: [
                "Reading one book",
                "Choosing one apple",
                "Selecting best photos from 10,000 pictures",
                "Drinking one glass of water"
            ],
            correctIndex: 2,
            explanation: "When dealing with thousands of items, manual review becomes impossible. Statistics helps identify patterns and make selections."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Why are individual cases not enough to understand reality?",
            options: [
                "They are boring",
                "They may not represent the whole picture",
                "They are always wrong",
                "They change every day"
            ],
            correctIndex: 1,
            explanation: "A single case is just one data point—it may be an outlier or exception. Only aggregate data reveals the true pattern."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "What does statistics mainly help us do?",
            options: [
                "Memorize numbers",
                "Avoid thinking",
                "Turn confusion into clarity",
                "Predict everything perfectly"
            ],
            correctIndex: 2,
            explanation: "Statistics transforms chaotic data into clear, actionable insights—turning confusion into clarity.",
            unlocks: true
        }
    ]
};

// ============================================================
// TOPIC 2: Statistics vs Intuition and Guesswork
// ============================================================
const TOPIC_2_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 30,
        difficulty: "beginner",
        objectives: [
            "Understand why gut feelings often fail",
            "Recognize the gambler's fallacy",
            "Learn why evidence trumps intuition"
        ],
        teacherContext: "This topic challenges common cognitive biases. The dice simulation is key—let students experience loss before explaining the math."
    },
    blocks: [
        // INTRO
        {
            id: blockId("text"),
            type: "text",
            content: "# Statistics vs Intuition & Guesswork",
            style: "heading",
            animation: { type: "fade", duration: 0.6 }
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Your gut feeling is **powerful**—but it's also **dangerously unreliable**. In this topic, you'll discover why intuition fails and how statistics provides a better path to truth.",
            style: "default",
            animation: { type: "slide", direction: "up" }
        },

        // Subtopic 1: The Gambler's Mindset
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 1: The Gambler's Mindset",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Statistics replaces gut feelings with **evidence**. It helps us make decisions without being swept away by emotion.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*The Scene:* A gambler watches a coin land on heads **three times in a row**. His gut screams: *\"It HAS to be tails now!\"* He bets everything on tails... and loses. The coin doesn't care about history.",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "This is the **Gambler's Fallacy**—the belief that past random events influence future ones. Statistics teaches us the truth: each flip is *independent*. The coin has no memory.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Shocking Statistical Truth:** The mathematically correct decision in most gambling scenarios is... **not to play at all**. The best outcome over time is merely breaking even.",
            style: "callout"
        },
        {
            id: blockId("simulation"),
            type: "simulation",
            simulationId: "DiceBettingSim",
            instructions: "Try your luck! Bet on Over 7, Under 7, or Equal to 7. Watch your balance over time—can you beat the house? (Spoiler: Statistics says no.)"
        },

        // Subtopic 2: Intuition Fails at Scale
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 2: Intuition Fails at Scale",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Intuition works for **small** situations. It breaks down completely when data becomes large or complex.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example:* You can eyeball the average height of people in a small room. But put **50,000 people** in a stadium and ask the same question—suddenly, your intuition is useless.",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Statistics isn't limited by human perception. It can process millions of data points and extract meaning that would take a human lifetime to observe.",
            style: "default"
        },

        // Subtopic 3: Guesswork Succeeds... By Accident
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 3: Guesswork Succeeds... By Accident",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Sometimes guesswork works. But occasional success doesn't make it **reliable**.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Think about students guessing on multiple-choice exams. Occasionally they get it right—but would you trust your grades to pure luck? Of course not.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Investment Trap:** Studies show that the **majority of stock market investors lose money** because they invest based on gut feelings rather than data. The winners? They use statistics.",
            style: "callout"
        },

        // Subtopic 4: Why Statistics Wins
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 4: Why Statistics Always Wins",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Guesswork relies on **luck**—and luck eventually runs out. Statistics relies on **probability**—which is mathematically guaranteed to work over time.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*The Contrast:*\n- A **guesser** might pick one winning stock by accident.\n- A **statistician** builds a diverse portfolio that grows steadily, even when some stocks fail.",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "This is why banks, insurance companies, and tech giants all use statistical models. If they relied on intuition, they'd be bankrupt within weeks.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Philosophy:** Statistics doesn't try to be *perfect* once—it tries to be *mostly right* forever.",
            style: "callout"
        },

        // QUIZ SECTION
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## 🧠 Knowledge Check",
            style: "heading"
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "What does intuition mainly depend on?",
            options: [
                "Data records",
                "Logical proof",
                "Feelings and experience",
                "Random chance"
            ],
            correctIndex: 2,
            explanation: "Intuition is based on feelings and personal experience—not systematic data analysis."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Why is guesswork unreliable?",
            options: [
                "It takes too much time",
                "It depends on luck",
                "It needs training",
                "It uses too much data"
            ],
            correctIndex: 1,
            explanation: "Guesswork depends on luck, which is inherently random and inconsistent."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Which is an example of guesswork?",
            options: [
                "Checking weather history before travel",
                "Choosing exam answers without studying",
                "Recording daily expenses",
                "Comparing prices before buying"
            ],
            correctIndex: 1,
            explanation: "Choosing answers without studying is pure guesswork—no data or analysis involved."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Why does intuition fail in big situations?",
            options: [
                "Intuition is slow",
                "Human brain can't handle large complexity well",
                "Intuition needs machines",
                "Intuition works only with numbers"
            ],
            correctIndex: 1,
            explanation: "Our cognitive capacity is limited. Large-scale complexity overwhelms intuition."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "How does statistics improve decisions?",
            options: [
                "By removing uncertainty completely",
                "By replacing humans",
                "By using evidence instead of feelings",
                "By guessing better"
            ],
            correctIndex: 2,
            explanation: "Statistics replaces subjective feelings with objective evidence, leading to better decisions.",
            unlocks: true
        }
    ]
};

// ============================================================
// TOPIC 3: Deterministic vs. Uncertain Worlds
// ============================================================
const TOPIC_3_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 28,
        difficulty: "beginner",
        objectives: [
            "Distinguish between deterministic and uncertain systems",
            "Understand why uncertainty exists",
            "Learn how statistics bridges both worlds"
        ],
        teacherContext: "This is a philosophical topic. Use concrete examples—calculators vs. farming—to ground abstract concepts."
    },
    blocks: [
        // INTRO
        {
            id: blockId("text"),
            type: "text",
            content: "# Deterministic vs. Uncertain Worlds",
            style: "heading",
            animation: { type: "fade", duration: 0.6 }
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Some things in life are **perfectly predictable**. Others are **fundamentally uncertain**. Understanding this distinction is the philosophical foundation of statistics.",
            style: "default",
            animation: { type: "slide", direction: "up" }
        },

        // Subtopic 1: The Deterministic Worldview
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 1: The Deterministic World",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "In a deterministic system, the future is **completely determined by the present**. If you know the current state and the governing rules, you can predict the outcome with **100% accuracy**.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example:* Enter `2 + 2` into a calculator. The answer is always `4`. It will never randomly be `5`. The rules of mathematics are rigid and deterministic.",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "If you repeat the same action under identical conditions, you get the **exact same result**—every single time. The system has no randomness.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Deterministic Dream:** If we had complete knowledge and infinite processing power, nothing would ever surprise us. \"Chance\" would simply be ignorance of hidden variables.",
            style: "callout"
        },

        // Subtopic 2: The Uncertain Worldview
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 2: The Uncertain World",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "In an uncertain system, the **same inputs can lead to different outputs**. Even if you do everything \"right,\" the result is not guaranteed.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example:* You plant a seed, water it perfectly, and provide optimal sunlight. Yet it might still fail due to random genetic defects or unseen pests. The outcome was **not guaranteed**.",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "In uncertain systems, we describe outcomes using **probability distributions**—ranges of likely values rather than single fixed numbers.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example:* A clothing store can't predict exactly who walks in next. But they *can* predict that roughly **60% of winter customers** will buy woolen clothes. Pattern, not precision.",
            style: "quote"
        },

        // Subtopic 3: The Source of Uncertainty
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 3: Why Uncertainty Exists",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**Reason 1: Lack of Infinite Knowledge**\n\nEven if perfect outcomes are theoretically possible, we lack the knowledge and resources to achieve them. We can't measure everything with infinite precision.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example:* To grow crops perfectly, you'd need the **exact** amount of water (1.0000 liters?), **exact** fertilizer (2.0000 kg?), and maintain **exact** temperature (15.00°C). How would you even determine these numbers?",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**Reason 2: Too Many Parameters**\n\nReal-world systems have countless interacting variables—genetics, weather, human behavior. Tracking and controlling all of them simultaneously is impossible.",
            style: "default"
        },

        // Subtopic 4: How Statistics Bridges Both Worlds
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 4: How Statistics Joins the Game",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**The Coexistence:** Our world contains both deterministic systems (mathematics, physics, programming) and uncertain systems (farming, business, weather).",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**The Role of Statistics:** Statistics helps us manage uncertain systems by making them behave *more like* deterministic ones. We can't reach 100% certainty—but we can get remarkably close.",
            style: "default"
        },
        {
            id: blockId("simulation"),
            type: "simulation",
            simulationId: "StochasticGrowthSim",
            instructions: "Watch how randomness affects growth over time. Statistical thinking helps us find patterns even in chaotic systems."
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **Real-World Application:** Today's top agricultural yields come from farmers who use statistics to optimize water, fertilizer, and seed selection. They maximize outcomes in an uncertain world.",
            style: "callout"
        },

        // QUIZ SECTION
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## 🧠 Knowledge Check",
            style: "heading"
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "What defines a deterministic world?",
            options: [
                "Outcomes change randomly",
                "Same action gives same result",
                "Nothing can be predicted",
                "Luck decides everything"
            ],
            correctIndex: 1,
            explanation: "In deterministic systems, identical inputs always produce identical outputs."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Which example best fits an uncertain world?",
            options: [
                "Dropping a ball",
                "Turning on a switch",
                "Flipping a coin",
                "Pressing calculator buttons"
            ],
            correctIndex: 2,
            explanation: "Coin flips are inherently random—the same action can produce different outcomes."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Why is real life mostly uncertain?",
            options: [
                "Rules don't exist",
                "Too many factors affect outcomes",
                "Humans are careless",
                "Data is missing"
            ],
            correctIndex: 1,
            explanation: "Real-world systems have countless interacting variables that create inherent uncertainty."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "What does statistics help us do in an uncertain world?",
            options: [
                "Predict exact outcomes",
                "Remove randomness",
                "Understand patterns and likelihoods",
                "Control the future"
            ],
            correctIndex: 2,
            explanation: "Statistics helps us identify patterns and estimate probabilities, even without certainty."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Why can't we use deterministic thinking everywhere?",
            options: [
                "It is outdated",
                "Real life doesn't always repeat exactly",
                "It needs machines",
                "It uses formulas"
            ],
            correctIndex: 1,
            explanation: "Real-world conditions vary—even slight differences lead to different outcomes.",
            unlocks: true
        }
    ]
};

// ============================================================
// TOPIC 4: Everyday Decisions & Hidden Statistics
// ============================================================
const TOPIC_4_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 22,
        difficulty: "beginner",
        objectives: [
            "Recognize cognitive biases in daily decisions",
            "Understand the availability heuristic and anchoring",
            "See the hidden statistics in everyday choices"
        ],
        teacherContext: "Focus on making students see that they already use informal statistics. The examples should feel personally relatable."
    },
    blocks: [
        // INTRO
        {
            id: blockId("text"),
            type: "text",
            content: "# Everyday Decisions & Hidden Statistics",
            style: "heading",
            animation: { type: "fade", duration: 0.6 }
        },
        {
            id: blockId("text"),
            type: "text",
            content: "You're already a statistician—you just don't know it yet. Every day, your brain collects data, spots patterns, and makes predictions. But it also falls into **predictable traps**.",
            style: "default",
            animation: { type: "slide", direction: "up" }
        },

        // Subtopic 1: The Availability Heuristic
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 1: The Availability Heuristic",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "We estimate the probability of events based on **how easily examples come to mind**—not actual data. Recent, dramatic events feel more common than they are.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*The Paradox:* Most people are terrified of flying but comfortable driving to the airport. Why? Plane crashes make dramatic headlines. Car accidents are \"boring.\"",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Statistical Truth:** Airplanes are the **safest mode of transportation**. The highest risk in air travel is actually the drive from home to the airport. Your fear is statistically backwards.",
            style: "callout"
        },

        // Subtopic 2: Anchoring
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 2: The Anchoring Trap",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "When estimating any value, we rely heavily on the **first piece of information offered** (the \"anchor\")—even if it's irrelevant. We adjust from there, but never enough.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example:* A job offer starts at ₹50,000. Even through negotiation, you might only reach ₹55,000-60,000. If they'd started at ₹70,000, the entire conversation would shift.",
            style: "quote"
        },
        {
            id: blockId("simulation"),
            type: "simulation",
            simulationId: "AnchoringSim",
            instructions: "Experience the anchoring effect firsthand. See how initial numbers influence your final estimates."
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Power Play:** In business negotiations, *whoever speaks the first number sets the statistical range for the entire discussion*. Statistics isn't just about numbers—it's about psychology.",
            style: "callout"
        },

        // Subtopic 3: Hidden Statistics in Daily Choices
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 3: Your Brain's Hidden Calculator",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Many everyday decisions are based on **informal data** you've unconsciously collected. You're already running basic statistical analysis—you just don't realize it.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Example 1:* You choose a specific route to college because you've noticed it usually has less traffic at this hour. Your brain has collected data points over weeks.\n\n*Example 2:* You grab an umbrella because the last few days have been rainy—and boom, it rains. You informally calculated probability.",
            style: "quote"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Insight:** Your brain uses a *limited* form of statistics through experience. Imagine what you could achieve with **formal statistical tools** amplifying your natural ability.",
            style: "callout"
        },

        // QUIZ SECTION
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## 🧠 Knowledge Check",
            style: "heading"
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Why do people choose crowded food stalls?",
            options: [
                "They like noise",
                "Food is cheaper",
                "They assume it's better based on observation",
                "They know the owner"
            ],
            correctIndex: 2,
            explanation: "We use crowd behavior as informal data—assuming popularity indicates quality."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "What role does past experience play in decisions?",
            options: [
                "No role",
                "It confuses us",
                "It acts like informal data",
                "It replaces thinking"
            ],
            correctIndex: 2,
            explanation: "Our past experiences serve as data points our brain uses for pattern recognition."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Which is an example of hidden statistics?",
            options: [
                "Solving equations",
                "Memorizing formulas",
                "Carrying an umbrella after past rain experience",
                "Reading a textbook"
            ],
            correctIndex: 2,
            explanation: "Using recent weather patterns to predict today's weather is informal statistical reasoning."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "What does formal statistics do to everyday thinking?",
            options: [
                "Makes it complicated",
                "Removes common sense",
                "Organizes and improves it",
                "Replaces decisions"
            ],
            correctIndex: 2,
            explanation: "Formal statistics enhances and systematizes our natural decision-making abilities.",
            unlocks: true
        }
    ]
};

// ============================================================
// TOPIC 5: Correlation ≠ Causation
// ============================================================
const TOPIC_5_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 20,
        difficulty: "beginner",
        objectives: [
            "Understand what correlation really means",
            "Distinguish correlation from causation",
            "Recognize the danger of confusing them"
        ],
        teacherContext: "This is one of the most important early warnings in statistics. The ice cream/drowning example is classic—use it to create an 'aha!' moment."
    },
    blocks: [
        // INTRO
        {
            id: blockId("text"),
            type: "text",
            content: "# Correlation ≠ Causation",
            style: "heading",
            animation: { type: "fade", duration: 0.6 }
        },
        {
            id: blockId("text"),
            type: "text",
            content: "This is perhaps the most important lesson in all of statistics: **just because two things happen together doesn't mean one causes the other.** Confusing correlation with causation leads to catastrophically wrong conclusions.",
            style: "default",
            animation: { type: "slide", direction: "up" }
        },

        // Subtopic 1: What Correlation Means
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 1: What Correlation Really Means",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "Correlation describes a **relationship** where two variables tend to change together:\n- **Positive correlation:** As one increases, so does the other\n- **Negative correlation:** As one increases, the other decreases\n- **Zero correlation:** No linear relationship",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*Examples:*\n- 🔼 Temperature rises → 🔼 Ice cream sales rise (Positive)\n- 🔼 Altitude increases → 🔽 Temperature drops (Negative)\n- IQ and birthdate → No relationship (Zero)",
            style: "quote"
        },
        {
            id: blockId("simulation"),
            type: "simulation",
            simulationId: "PatternDetector",
            instructions: "Add data points to the scatter plot and watch the correlation emerge. Try creating positive, negative, and random patterns!"
        },

        // Subtopic 2: Why Correlation ≠ Causation
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## Subtopic 2: The Critical Difference",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**Causation** means one event *directly causes* another. If there's causation, there will be correlation. But correlation **does not** imply causation.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "*The Classic Example:*\n\n🍦 Ice cream sales increase → 🏊 Drowning incidents increase\n\nThese are strongly correlated. But does eating ice cream *cause* people to drown?\n\n**Of course not!** Both increase in summer because of a third variable: **hot weather**.",
            style: "callout"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "This hidden third factor is called a **confounding variable** or **lurking variable**. It explains the correlation without implying causation.",
            style: "default"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **The Takeaway:** Whenever you see a strong correlation, always ask: *\"Is there a third factor that could explain this?\"* This question separates statistical thinkers from the rest.",
            style: "callout"
        },

        // QUIZ SECTION
        { id: blockId("divider"), type: "divider", style: "section-break" },
        {
            id: blockId("text"),
            type: "text",
            content: "## 🧠 Knowledge Check",
            style: "heading"
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Two things increase at the same time. What does this tell us for sure?",
            options: [
                "One causes the other",
                "They are always related",
                "They move together in observation",
                "One is more important"
            ],
            correctIndex: 2,
            explanation: "Co-occurrence only tells us they move together—not why or if one causes the other."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Which statement best explains correlation?",
            options: [
                "One event directly causes another",
                "Two things happen together but reason may be unknown",
                "One thing controls the other",
                "Both are planned"
            ],
            correctIndex: 1,
            explanation: "Correlation only means co-occurrence—the underlying reason may be completely unknown."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Ice-cream sales and beach crowds both increase in summer. What is the correct conclusion?",
            options: [
                "Ice-cream makes people go to the beach",
                "Beach visits increase ice-cream taste",
                "Both are affected by summer",
                "Ice-cream causes heat"
            ],
            correctIndex: 2,
            explanation: "Summer (the confounding variable) causes both—neither causes the other."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Why is confusing correlation with causation dangerous?",
            options: [
                "It makes data boring",
                "It increases calculations",
                "It can lead to wrong decisions",
                "It reduces data size"
            ],
            correctIndex: 2,
            explanation: "Acting on false causal beliefs leads to ineffective or harmful decisions."
        },
        {
            id: blockId("quiz"),
            type: "quiz",
            question: "Which question should be asked after seeing a strong correlation?",
            options: [
                "How fast are the numbers?",
                "What formula is used?",
                "Is there a third factor involved?",
                "Can we ignore this?"
            ],
            correctIndex: 2,
            explanation: "Always look for lurking variables that might explain the correlation.",
            unlocks: true
        }
    ]
};

// ============================================================
// ASSIGNMENTS (4 Total)
// ============================================================
const ASSIGNMENT_1_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 45,
        difficulty: "beginner"
    },
    blocks: [
        {
            id: blockId("text"),
            type: "text",
            content: "# Assignment 1: Spot the Statistics in Daily Life",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**Goal:** Discover that you already use statistics unconsciously every day.",
            style: "default"
        },
        {
            id: blockId("assignment"),
            type: "assignment",
            title: "Daily Statistics Journal",
            description: "For one full day, observe your own decision-making process. Write down FIVE decisions where you compared options, used past experience, or looked for patterns.",
            instructions: "For each decision, answer:\n1. What decision did you make?\n2. What information did you use?\n3. Was it based on gut feeling, guesswork, or past data?\n\n**Example:**\nDecision: Choosing whether to board a crowded bus or wait for the next one.\nInformation: Number of people waiting vs. typical bus frequency at this hour.\nType: Hidden Statistics (Probability and Sampling)",
            submissionTypes: ["text"],
            isBlocking: true
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **What You'll Learn:**\n> - Everyday decisions are data-driven\n> - You're already a \"natural statistician\"\n> - Formal statistics enhances what you already do",
            style: "callout"
        }
    ]
};

const ASSIGNMENT_2_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 60,
        difficulty: "beginner"
    },
    blocks: [
        {
            id: blockId("text"),
            type: "text",
            content: "# Assignment 2: Intuition vs. Reality Check",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**Goal:** Demonstrate the limitations of intuition compared to objective data.",
            style: "default"
        },
        {
            id: blockId("assignment"),
            type: "assignment",
            title: "Prediction Test",
            description: "Pick ONE situation: Weather prediction, Exam difficulty, or Travel time. Before the event, write your gut feeling prediction. After, record the actual outcome.",
            instructions: "**Part 1 (Before):** Write your intuition-based prediction.\n\n**Part 2 (After):** Record what actually happened.\n\n**Part 3 (Analysis):** Answer:\n- Was your intuition correct?\n- If wrong, why do you think it failed?\n- What specific data could have helped?\n\n**Example:**\nFeeling: \"The bus will arrive in 5 minutes.\"\nReality: It arrived after 15 minutes.\nData needed: Live GPS tracking or historical arrival times during rush hour.",
            submissionTypes: ["text"],
            isBlocking: true
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **Key Insight:** Intuition feels strong but isn't always reliable. Small sample sizes lead to inaccurate conclusions. Data improves accuracy.",
            style: "callout"
        }
    ]
};

const ASSIGNMENT_3_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 30,
        difficulty: "beginner"
    },
    blocks: [
        {
            id: blockId("text"),
            type: "text",
            content: "# Assignment 3: Deterministic or Uncertain?",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**Goal:** Clearly distinguish between deterministic and uncertain thinking.",
            style: "default"
        },
        {
            id: blockId("assignment"),
            type: "assignment",
            title: "World Classification",
            description: "Classify each situation into: Deterministic, Uncertain, or Needs Statistics (uncertain but manageable with data).",
            instructions: "**Situations:**\n1. Dropping a stone from a height\n2. Predicting tomorrow's temperature\n3. Flipping a coin\n4. Estimating daily shop sales\n5. Turning on a light switch\n\nFor each situation, write ONE sentence explaining your reasoning.\n\n**Example:** Flipping a coin is UNCERTAIN because the same action can result in different outcomes (Heads or Tails).",
            submissionTypes: ["text"],
            isBlocking: true
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **What You're Building:**\n> - A mental framework separating \"fixed\" laws from \"probabilistic\" events\n> - Understanding that statistics is the essential tool for managing uncertainty",
            style: "callout"
        }
    ]
};

const ASSIGNMENT_4_CONTENT = {
    version: "1.0",
    metadata: {
        level: 0,
        estimatedMinutes: 35,
        difficulty: "beginner"
    },
    blocks: [
        {
            id: blockId("text"),
            type: "text",
            content: "# Assignment 4: Correlation vs. Causation",
            style: "heading"
        },
        {
            id: blockId("text"),
            type: "text",
            content: "**Goal:** Train yourself to pause and question patterns rather than blindly accepting them.",
            style: "default"
        },
        {
            id: blockId("assignment"),
            type: "assignment",
            title: "Pattern Analysis",
            description: "For each situation, answer: (1) Do these things move together? (2) Does one clearly cause the other, or could there be another reason?",
            instructions: "**Situations:**\n1. More umbrellas are seen when roads are wet.\n2. Students who study more often get higher marks.\n3. More mobile phone usage is seen in cities with higher populations.\n\n**Example Answer:**\n*Umbrellas & Wet Roads:*\n- Move together? Yes.\n- Causation? No. Rain is the \"Third Variable\" that causes both wet roads and umbrella use.",
            submissionTypes: ["text"],
            isBlocking: true
        },
        {
            id: blockId("text"),
            type: "text",
            content: "> **Critical Thinking Skill:**\n> Not every relationship is cause-and-effect. Always ask: *\"What else could be responsible?\"* This mindset prevents the misuse of statistics.",
            style: "callout"
        }
    ]
};

// ============================================================
// MAIN SEEDING FUNCTION
// ============================================================
async function seedLevel0Statistics() {
    console.log("🌱 Seeding Level 0: Statistical Thinking Course...\n");

    // 1. CLEANUP - Delete ALL existing courses
    console.log("🧹 Step 1: Cleaning up all existing data...");

    const { error: progressError } = await supabase.from("user_progress").delete().neq("user_id", "00000000-0000-0000-0000-000000000000");
    if (progressError) console.log("  ⚠️ user_progress cleanup:", progressError.message);

    const { error: nodesError } = await supabase.from("nodes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (nodesError) console.log("  ⚠️ nodes cleanup:", nodesError.message);

    const { error: coursesError } = await supabase.from("courses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (coursesError) console.log("  ⚠️ courses cleanup:", coursesError.message);

    console.log("  ✅ Cleanup complete\n");

    // 2. CREATE COURSE
    console.log("📚 Step 2: Creating Statistics 101 course...");
    const { error: courseError } = await supabase.from("courses").insert({
        id: COURSE_ID,
        title: "Statistics 101: Statistical Thinking",
        description: "Master the foundations of statistical thinking. Learn why statistics exists, how it defeats intuition, and the critical difference between correlation and causation. This is where your data literacy journey begins.",
        thumbnail_url: null
    });

    if (courseError) {
        console.error("❌ Error creating course:", courseError);
        return;
    }
    console.log("  ✅ Course created\n");

    // 3. CREATE NODES (Topics + Assignments)
    console.log("📝 Step 3: Creating lesson nodes...");

    const nodes = [
        // Topic 1
        {
            course_id: COURSE_ID,
            title: "Why Statistics Exists",
            type: "lesson",
            position_index: 0,
            content: TOPIC_1_CONTENT,
            is_mandatory: true
        },
        // Topic 2
        {
            course_id: COURSE_ID,
            title: "Statistics vs Intuition & Guesswork",
            type: "lesson",
            position_index: 1,
            content: TOPIC_2_CONTENT,
            is_mandatory: true
        },
        // Topic 3
        {
            course_id: COURSE_ID,
            title: "Deterministic vs Uncertain Worlds",
            type: "lesson",
            position_index: 2,
            content: TOPIC_3_CONTENT,
            is_mandatory: true
        },
        // Topic 4
        {
            course_id: COURSE_ID,
            title: "Everyday Decisions & Hidden Statistics",
            type: "lesson",
            position_index: 3,
            content: TOPIC_4_CONTENT,
            is_mandatory: true
        },
        // Topic 5
        {
            course_id: COURSE_ID,
            title: "Correlation ≠ Causation",
            type: "lesson",
            position_index: 4,
            content: TOPIC_5_CONTENT,
            is_mandatory: true
        },
        // Assignment 1
        {
            course_id: COURSE_ID,
            title: "Assignment: Spot the Statistics",
            type: "assignment",
            position_index: 5,
            content: ASSIGNMENT_1_CONTENT,
            is_mandatory: true
        },
        // Assignment 2
        {
            course_id: COURSE_ID,
            title: "Assignment: Intuition vs Reality",
            type: "assignment",
            position_index: 6,
            content: ASSIGNMENT_2_CONTENT,
            is_mandatory: true
        },
        // Assignment 3
        {
            course_id: COURSE_ID,
            title: "Assignment: World Classification",
            type: "assignment",
            position_index: 7,
            content: ASSIGNMENT_3_CONTENT,
            is_mandatory: true
        },
        // Assignment 4
        {
            course_id: COURSE_ID,
            title: "Assignment: Correlation vs Causation",
            type: "assignment",
            position_index: 8,
            content: ASSIGNMENT_4_CONTENT,
            is_mandatory: true
        }
    ];

    const { error: insertError } = await supabase.from("nodes").insert(nodes);

    if (insertError) {
        console.error("❌ Error inserting nodes:", insertError);
        return;
    }

    console.log(`  ✅ Created ${nodes.length} nodes (5 topics + 4 assignments)\n`);

    // 4. SUMMARY
    console.log("════════════════════════════════════════════");
    console.log("✨ SEEDING COMPLETE!");
    console.log("════════════════════════════════════════════");
    console.log("");
    console.log("📊 Course: Statistics 101: Statistical Thinking");
    console.log("");
    console.log("📖 Topics Created:");
    console.log("   1. Why Statistics Exists");
    console.log("   2. Statistics vs Intuition & Guesswork");
    console.log("   3. Deterministic vs Uncertain Worlds");
    console.log("   4. Everyday Decisions & Hidden Statistics");
    console.log("   5. Correlation ≠ Causation");
    console.log("");
    console.log("📝 Assignments Created:");
    console.log("   1. Spot the Statistics");
    console.log("   2. Intuition vs Reality");
    console.log("   3. World Classification");
    console.log("   4. Correlation vs Causation");
    console.log("");
    console.log("🎮 Simulations Used:");
    console.log("   • DataFog (Topic 1)");
    console.log("   • DiceBettingSim (Topic 2)");
    console.log("   • StochasticGrowthSim (Topic 3)");
    console.log("   • AnchoringSim (Topic 4)");
    console.log("   • PatternDetector (Topic 5)");
    console.log("");
}

seedLevel0Statistics().catch(console.error);

/**
 * Seed Script: Statistics Course
 * 
 * This script seeds the "Statistics: From Zero to Hero" course into the database
 * with proper Level → Mission → Node hierarchy.
 * 
 * Usage: npx tsx scripts/seed-statistics-course.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables. Please set:');
    console.error('  NEXT_PUBLIC_SUPABASE_URL');
    console.error('  SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
});

// ============================================================
// COURSE DATA STRUCTURE
// ============================================================

interface NodeContent {
    hook: string;
    animationUrl?: string;
    animationPrompt?: string;
    scrollyPoints: string[];
    simulation?: {
        title: string;
        interaction: string;
        lesson: string;
    };
    mcq?: {
        question: string;
        options: string[];
        correctAnswer: string;
    };
    assignment?: {
        type: string;
        task: string;
    };
    references?: string[];
}

interface NodeData {
    title: string;
    content: NodeContent;
}

interface MissionData {
    title: string;
    nodes: NodeData[];
}

interface LevelData {
    title: string;
    missions: MissionData[];
}

// ============================================================
// STATISTICS COURSE CONTENT
// ============================================================

const COURSE_TITLE = "Statistics: From Zero to Hero";
const COURSE_DESCRIPTION = "Master statistical thinking through interactive simulations and real-world applications. From foundational concepts to advanced inference.";

const LEVELS: LevelData[] = [
    {
        title: "Level 0: Statistical Thinking (Foundation)",
        missions: [
            {
                title: "Topic 0.1: Why statistics exists",
                nodes: [
                    {
                        title: "Sub-topic 0.1.1: Conclusion of data cluster",
                        content: {
                            hook: "Can you spot the failing student in this list?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Conclusion%20of%20data%20cluster.mp4",
                            scrollyPoints: [
                                "Imagine you are the Principal. You have the exam results for 1,000 students.",
                                "Look at the raw list. It's just noise.",
                                "Your brain has a 'Cognitive Limit.' You cannot process 1,000 numbers at once.",
                                "You need a tool to compress this noise into a signal.",
                                "Statistics turns a million blinding lights into a single, focused beam."
                            ],
                            simulation: {
                                title: "The 5-Second Count",
                                interaction: "Count scattered red/blue dots in 5 seconds. Apply Stats to sort them.",
                                lesson: "Structure beats chaos."
                            },
                            references: ["Miller, G. A. (1956). The Magical Number Seven..."]
                        }
                    },
                    {
                        title: "Sub-topic 0.1.2: Understanding collective phenomena",
                        content: {
                            hook: "Does your neighbor know what the whole country is doing?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Understanding%20collective%20phenomena.mp4",
                            scrollyPoints: [
                                "Humans are 'Locally Minded.' We trust what we see with our own eyes.",
                                "You see a birth in your family. You see a death on your street.",
                                "But you cannot see the birth rate of the entire nation from your window.",
                                "To see the 'Big Picture,' you need a medium. You need data.",
                                "Your eyes see the pixel. Statistics sees the image."
                            ],
                            simulation: {
                                title: "The Zoom Slider",
                                interaction: "Slider from Local (Road is smooth) to Global (60% roads broken).",
                                lesson: "Local perception != Global reality"
                            }
                        }
                    },
                    {
                        title: "Sub-topic 0.1.3: The 'Small Sample' Trap",
                        content: {
                            hook: "My grandpa smoked and lived to 90. So smoking is safe, right?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Small%20Sample%20Trap.mp4",
                            scrollyPoints: [
                                "This is the most dangerous trap in human thinking.",
                                "Your grandpa is an Outlier. He is the exception, not the rule.",
                                "Statistics moves us from 'I feel' to 'We know' by looking at the whole group.",
                                "A sample size of one (N=1) is meaningless."
                            ],
                            simulation: {
                                title: "The Review Roulette",
                                interaction: "1 Star Restaurant looks like 5 Stars if you only read one review.",
                                lesson: "The first review was an outlier."
                            },
                            references: ["Tversky, A., & Kahneman, D. (1971). Belief in the Law of Small Numbers."]
                        }
                    },
                    {
                        title: "Sub-topic 0.1.4: Individual Cases Can Mislead Us",
                        content: {
                            hook: "Is the player bad, or just having a bad day?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Individual%20Cases%20Can%20Mislead%20Us.mp4",
                            scrollyPoints: [
                                "Imagine a star cricket player scores Zero in one match.",
                                "Does that mean they are suddenly a bad player? No.",
                                "That is called Natural Variability.",
                                "Statistics helps us distinguish between 'Bad Luck' and 'Bad Skill'."
                            ],
                            mcq: {
                                question: "A medicine cures your headache but gives your friend a rash. Why can't a doctor ban it immediately?",
                                options: ["The doctor doesn't like your friend.", "Individual biology varies; we need average effect."],
                                correctAnswer: "Individual biology varies; we need average effect."
                            },
                            assignment: {
                                type: "Text",
                                task: "Rewrite a headline based on a single story to reflect statistical reality."
                            }
                        }
                    }
                ]
            },
            {
                title: "Topic 0.2: Statistics vs intuition",
                nodes: [
                    {
                        title: "Sub-topic 0.2.1: The Gambler's Mindset",
                        content: {
                            hook: "If a coin flips Heads 5 times in a row, is Tails 'due' next?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Gamblers%20Mindset.mp4",
                            scrollyPoints: [
                                "Your gut screams 'Tails!'",
                                "But the coin has no memory. It doesn't know what happened last time.",
                                "The odds are still exactly 50/50.",
                                "Intuition seeks patterns. Statistics accepts chaos."
                            ],
                            simulation: {
                                title: "The Streak Breaker",
                                interaction: "Force 5 Heads, ask user to bet. Show 50% probability regardless.",
                                lesson: "Independent events."
                            },
                            references: ["Tversky, A., & Kahneman, D. (1974). Judgment under Uncertainty."]
                        }
                    },
                    {
                        title: "Sub-topic 0.2.2: Intuition Fails When Scale Increases",
                        content: {
                            hook: "Guess the average height of 5 people. Easy. Now guess for 50,000.",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Intuition%20Fails%20When%20Scale%20Increases.mp4",
                            scrollyPoints: [
                                "Our brains evolved in small tribes.",
                                "50,000 people isn't a 'group' to your brain; it's just 'noise'.",
                                "You cannot 'feel' the average of a stadium.",
                                "Math is the telescope for large numbers."
                            ],
                            simulation: {
                                title: "The Jar Guess",
                                interaction: "Guess count for 20 marbles vs 2000 marbles. Error margin explodes.",
                                lesson: "Scale breaks intuition."
                            },
                            references: ["Stanislas Dehaene. (1997). The Number Sense."]
                        }
                    },
                    {
                        title: "Sub-topic 0.2.3: Guesswork Works Sometimes",
                        content: {
                            hook: "Was it skill, or just dumb luck?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Guesswork%20Works%20Sometimes-By%20Accident.mp4",
                            scrollyPoints: [
                                "Sometimes, you guess and get it right.",
                                "That doesn't mean you knew the answer. It means randomness favored you.",
                                "Don't confuse a lucky outcome with a smart process."
                            ],
                            mcq: {
                                question: "A CEO doubled the company's money on a risky bet. Is he a genius?",
                                options: ["Yes, results matter.", "Not necessarily; check if it repeats."],
                                correctAnswer: "Not necessarily; check if it repeats."
                            },
                            references: ["Taleb, N. N. (2001). Fooled by Randomness."]
                        }
                    },
                    {
                        title: "Sub-topic 0.2.4: Why do statistics win",
                        content: {
                            hook: "Why do casinos never go bankrupt?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Why%20do%20statistics%20win.mp4",
                            scrollyPoints: [
                                "In the short run, anything can happen.",
                                "In the long run, the math takes over.",
                                "This is the Law of Large Numbers.",
                                "Intuition plays the short game. Statistics plays the long game."
                            ],
                            simulation: {
                                title: "The Convergence",
                                interaction: "Flip 1 coin (chaos) vs Flip 1000 coins (perfect 50%).",
                                lesson: "More Data = Less Chaos."
                            },
                            references: ["Bernoulli, J. (1713). Ars Conjectandi."],
                            assignment: {
                                type: "Text",
                                task: "Describe a gut feeling decision and what data you could have used instead."
                            }
                        }
                    }
                ]
            },
            {
                title: "Topic 0.3: Deterministic vs uncertain",
                nodes: [
                    {
                        title: "Sub-topic 0.3.1: The Deterministic Worldview",
                        content: {
                            hook: "If you kick a ball the exact same way twice, will it land in the exact same spot?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Deterministic%20Worldview_.mp4",
                            scrollyPoints: [
                                "Imagine a world that works like a clock.",
                                "Input A = Output B. Always. No surprises.",
                                "For centuries, scientists thought the universe was just a giant machine."
                            ],
                            simulation: {
                                title: "The Perfect Cannon",
                                interaction: "Fire cannon twice. Hits exact same spot.",
                                lesson: "Determinism = Repetition."
                            },
                            references: ["Laplace, P. S. (1814). A Philosophical Essay on Probabilities."]
                        }
                    },
                    {
                        title: "Sub-topic 0.3.2: The Uncertain Worldview",
                        content: {
                            hook: "If you plant two identical seeds, why don't they grow to the exact same height?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Uncertain%20Worldview_.mp4",
                            scrollyPoints: [
                                "Real world is a garden, not a clock.",
                                "Same Input, different Outputs.",
                                "This is an Uncertain (Stochastic) system.",
                                "Variation is the rule."
                            ],
                            simulation: {
                                title: "The Windy Cannon",
                                interaction: "Fire cannon. Random wind pushes it off course.",
                                lesson: "Unknown variables break determinism."
                            }
                        }
                    },
                    {
                        title: "Sub-topic 0.3.3: The source of Uncertainty",
                        content: {
                            hook: "Why can't we predict the weather perfectly yet?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20source%20of%20Uncertainty_.mp4",
                            scrollyPoints: [
                                "It's not magic. It's just Hidden Variables.",
                                "The wind, temperature, friction.",
                                "Because we can't see them, we call it 'Randomness'."
                            ],
                            mcq: {
                                question: "Can a supercomputer predict everything?",
                                options: ["Yes (Laplace)", "No (Quantum Mechanics)"],
                                correctAnswer: "No (Quantum Mechanics)"
                            },
                            references: ["Lorenz, E. N. (1963). The Butterfly Effect."]
                        }
                    },
                    {
                        title: "Sub-topic 0.3.4: How statistics joins the game",
                        content: {
                            hook: "How do we win a game we can't predict?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/How%20statistics%20joins%20the%20game.mp4",
                            scrollyPoints: [
                                "Statistics doesn't predict exactly what will happen.",
                                "It predicts what is most likely to happen.",
                                "It turns chaos into a map."
                            ],
                            simulation: {
                                title: "The Probability Bet",
                                interaction: "Use a 'Net' to catch the ball. Optimize net size.",
                                lesson: "Confidence Intervals."
                            },
                            assignment: {
                                type: "Photo",
                                task: "Photo of a deterministic object and an uncertain object."
                            }
                        }
                    }
                ]
            },
            {
                title: "Topic 0.4: Everyday decisions",
                nodes: [
                    {
                        title: "Sub-topic 0.4.1: The Availability Heuristic",
                        content: {
                            hook: "Are you more afraid of Sharks or Cows?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Availability%20Heuristic.mp4",
                            scrollyPoints: [
                                "Your brain judges probability by Vividness, not data.",
                                "If it bleeds, it leads. If it's boring, you ignore it."
                            ],
                            simulation: {
                                title: "The Headline Game",
                                interaction: "Recall headlines. Users recall the scary one.",
                                lesson: "Drama over frequency."
                            },
                            references: ["Tversky, A., & Kahneman, D. (1973). Availability Heuristic."]
                        }
                    },
                    {
                        title: "Sub-topic 0.4.2: Anchoring",
                        content: {
                            hook: "How do you know if a T-shirt is a good price?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Anchoring%20(The%20Trap%20of%20the%20First%20Number)_.mp4",
                            scrollyPoints: [
                                "The first number you saw was the Anchor.",
                                "It pulled your perception upward.",
                                "You just paid less than the imaginary number."
                            ],
                            simulation: {
                                title: "The Discount Trap",
                                interaction: "Compare crossed-out price vs net price.",
                                lesson: "Crossed-out numbers hack your brain."
                            },
                            references: ["Ariely, D. (2008). Predictably Irrational."]
                        }
                    },
                    {
                        title: "Sub-topic 0.4.3: Hidden Statistics",
                        content: {
                            hook: "How did you know to bring an umbrella today?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Statistics%20Hidden%20in%20Daily%20Choices.mp4",
                            scrollyPoints: [
                                "You are taking samples and updating probabilities.",
                                "You are already a statistician.",
                                "We replace 'guesses' with 'math'."
                            ],
                            mcq: {
                                question: "Why look left and right crossing the road?",
                                options: ["Parents told me", "Calculating survival probability"],
                                correctAnswer: "Calculating survival probability"
                            },
                            assignment: {
                                type: "Photo",
                                task: "Find an Anchoring trick on a shopping site."
                            }
                        }
                    }
                ]
            },
            {
                title: "Topic 0.5: Correlation vs causation",
                nodes: [
                    {
                        title: "Sub-topic 0.5.1: What Correlation Really Means",
                        content: {
                            hook: "What does it mean when two things move together?",
                            animationUrl: "default",
                            animationPrompt: "Abstract data visualization... glowing neon lines dancing together...",
                            scrollyPoints: [
                                "Data points dance together.",
                                "Positive Correlation: When A goes up, B goes up.",
                                "Correlation is a relationship, not a force."
                            ],
                            simulation: {
                                title: "The Pattern Slider",
                                interaction: "Drag slider, exam score grows.",
                                lesson: "Identify the pattern."
                            },
                            references: ["Pearson, K. (1895). Note on Regression."]
                        }
                    },
                    {
                        title: "Sub-topic 0.5.2: Why correlation is not causation",
                        content: {
                            hook: "Does eating ice cream cause shark attacks?",
                            animationUrl: "default",
                            animationPrompt: "Split screen. Ice cream on beach vs Shark fin...",
                            scrollyPoints: [
                                "Ice Cream sales and Shark attacks rise together.",
                                "Does ice cream attract sharks? No.",
                                "Just because they move together, doesn't mean one pushed the other."
                            ],
                            simulation: {
                                title: "The Ban Button",
                                interaction: "Ban Ice Cream. Shark attacks stay high.",
                                lesson: "No causality found."
                            }
                        }
                    },
                    {
                        title: "Sub-topic 0.5.3: The Hidden Variable",
                        content: {
                            hook: "So, who is pulling the strings?",
                            animationUrl: "default",
                            animationPrompt: "Sun with a face holding strings for Ice Cream and Shark...",
                            scrollyPoints: [
                                "Look for the Hidden Third Factor.",
                                "It's the Summer Heat.",
                                "The Heat caused both."
                            ],
                            mcq: {
                                question: "Do horses make you live longer?",
                                options: ["Yes, healing energy", "No, Wealth is the variable"],
                                correctAnswer: "No, Wealth is the variable"
                            },
                            references: ["Fisher, R. A. (1958). The Nature of Probability"],
                            assignment: {
                                type: "Text/Photo",
                                task: "Find a 'X causes Y' headline and propose the Hidden Variable."
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        title: "Level 1: Data – The Raw Material",
        missions: []
    },
    {
        title: "Level 2: Descriptive Statistics",
        missions: []
    },
    {
        title: "Level 3: Visual & Exploratory Data Analysis",
        missions: []
    },
    {
        title: "Level 4: Probability & Uncertainty",
        missions: []
    },
    {
        title: "Level 5: Sampling & Distributions",
        missions: []
    },
    {
        title: "Level 6: Statistical Inference",
        missions: []
    },
    {
        title: "Level 7: Relationships & Modeling",
        missions: []
    },
    {
        title: "Level 8: Real World Applications",
        missions: []
    }
];

// ============================================================
// SEED FUNCTION
// ============================================================

async function seedStatisticsCourse() {
    console.log('🚀 Starting Statistics Course Seed...\n');

    try {
        // 1. Create Course
        console.log('📚 Creating course...');
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert({
                title: COURSE_TITLE,
                description: COURSE_DESCRIPTION,
            })
            .select('id')
            .single();

        if (courseError) throw courseError;
        console.log(`   ✓ Course created: ${course.id}\n`);

        const courseId = course.id;

        // 2. Create Levels, Missions, and Nodes
        for (let levelIdx = 0; levelIdx < LEVELS.length; levelIdx++) {
            const level = LEVELS[levelIdx];
            console.log(`📁 Creating Level ${levelIdx}: ${level.title}`);

            const { data: levelRecord, error: levelError } = await supabase
                .from('levels')
                .insert({
                    course_id: courseId,
                    title: level.title,
                    position_index: levelIdx,
                })
                .select('id')
                .single();

            if (levelError) throw levelError;
            const levelId = levelRecord.id;

            for (let missionIdx = 0; missionIdx < level.missions.length; missionIdx++) {
                const mission = level.missions[missionIdx];
                console.log(`   📂 Creating Mission ${missionIdx}: ${mission.title}`);

                const { data: missionRecord, error: missionError } = await supabase
                    .from('missions')
                    .insert({
                        level_id: levelId,
                        title: mission.title,
                        position_index: missionIdx,
                    })
                    .select('id')
                    .single();

                if (missionError) throw missionError;
                const missionId = missionRecord.id;

                for (let nodeIdx = 0; nodeIdx < mission.nodes.length; nodeIdx++) {
                    const node = mission.nodes[nodeIdx];
                    console.log(`      📄 Creating Node ${nodeIdx}: ${node.title}`);

                    const { error: nodeError } = await supabase
                        .from('nodes')
                        .insert({
                            course_id: courseId,
                            mission_id: missionId,
                            title: node.title,
                            type: 'lesson',
                            position_index: nodeIdx,
                            is_mandatory: true,
                            content_json: node.content,
                            content: node.content,
                        });

                    if (nodeError) throw nodeError;
                }
            }
        }

        console.log('\n✅ Statistics Course seeded successfully!');
        console.log(`   Course ID: ${courseId}`);
        console.log(`   Levels: ${LEVELS.length}`);
        console.log(`   Missions: ${LEVELS.reduce((sum, l) => sum + l.missions.length, 0)}`);
        console.log(`   Nodes: ${LEVELS.reduce((sum, l) => sum + l.missions.reduce((s, m) => s + m.nodes.length, 0), 0)}`);

    } catch (error) {
        console.error('\n❌ Seed failed:', error);
        process.exit(1);
    }
}

// Run the seed
seedStatisticsCourse();

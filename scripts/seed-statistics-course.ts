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
                title: "Topic 0.1: Why Statistics exists?",
                nodes: [
                    {
                        title: "Sub-topic 0.1.1 Conclusion of data cluster",
                        content: {
                            hook: "Can you spot the truth in a cluster of data?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Conclusion%20of%20data%20cluster.mp4",
                            animationPrompt: "To show that from the cluster of data its impossible to observe the fact and draw the conclusion with the limitation of human ability",
                            scrollyPoints: [
                                "Human mind is limited to the data that can be observed so its impossible to extract or view the data from data cluster.",
                                "For example, after an examination, the principal wants to get sight on the performance of the students.",
                                "However it's not possible to see the result of thousands of students one by one and review the student of each classes.",
                                "With the help of statistics, the performance of each class can be represented by a single number.",
                                "So, the head teacher can only observe few numbers to get idea of the performance of overall school."
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
                        title: "Sub-topic 0.1.2 Understanding collective phenomena",
                        content: {
                            hook: "Does your neighbor know what the whole country is doing?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Understanding%20collective%20phenomena.mp4",
                            scrollyPoints: [
                                "Humans are “locally minded” - we only truly understand what we can see with our own eyes.",
                                "We see events happening in our locality however its impossible to know that going in the bigger picture (state/nation) without any medium.",
                                "For eg. One can know or observe the people taking birth or the people dying in his locality but having no idea about his country.",
                                "So by the help of statistics, by a single number he can get the idea about the people taking birth or dying in his country.",
                                "One can argue, why an individual could care about the bigger picture?",
                                "However it’s not only about the individual but in the government level suppose the death rate can increased rapidly of a state then policy should be made accordingly.",
                                "The information that death rate has increased can only be known using statistics."
                            ],
                            simulation: {
                                title: "The Zoom Slider",
                                interaction: "Slider from Local (Road is smooth) to Global (60% roads broken).",
                                lesson: "Local perception != Global reality"
                            }
                        }
                    },
                    {
                        title: "Sub-topic 0.1.3 The “Small Sample” Trap",
                        content: {
                            hook: "My grandpa smoked and lived to 90. Is smoking safe?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Small%20Sample%20Trap.mp4",
                            scrollyPoints: [
                                "Our brains weigh our own experiences more heavily than the truth of the “many.”",
                                "Just because something happened to you that doesn’t mean it’s the truth.",
                                "For e.g. after eating burger from a restaurant you fell ill as a result you may think it’s all because of burger you ate.",
                                "However the problem may not be the burger itself but another factor because thousands of other people are eating same burger and nothing happening to them.",
                                "So we use statistics to know whether its really the problem of burger or not.",
                                "Statistics moves us from “I feel” to “We know” by looking at the whole group, not just the individual."
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
                        title: "Sub-topic 0.1.4 Individual Cases Can Mislead Us",
                        content: {
                            hook: "Is the player bad, or just having a bad day?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Individual%20Cases%20Can%20Mislead%20Us.mp4",
                            scrollyPoints: [
                                "One person’s experience is not the whole truth as Individual opinions can be biased therefore we need a way to see the overall picture.",
                                "For e.g.  asking one student about an exam doesn’t tell how hard the exam really was as one can say it was hard and easy for another.",
                                "Similar a newly launched medicine may work out for one and not for another therefore doctor can’t prescribe these kind of medicine.",
                                "We need to find the medium or measure to really now how hard was the exam really and will the medicine work of maximum no of patients.",
                                "Of course statistics is the medium to get the things most closer toward the truth whether its about how hard is the exam or about the medicine."
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
                title: "Topic 0.2: Statistics vs intuition and guesswork",
                nodes: [
                    {
                        title: "Sub-topic 0.2.1 The Gambler’s Mindset",
                        content: {
                            hook: "If a coin flips Heads 5 times in a row, is Tails 'due' next?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Gamblers%20Mindset.mp4",
                            scrollyPoints: [
                                "Statistics replace gut feelings with evidence and help to make the decision without being carried out by our emotions.",
                                "For e.g. a gambler is trying his luck in a game of coin.",
                                "He observes that it was head 3 times in a row so fourth time he bet for tail as his intuition made him feel that it should be tail now.",
                                "However, it was head once again and he lost as he was just guessing carried by his emotion.",
                                "Statistics helps us to not make the decision done by that gambler as his decision was statistically incorrect.",
                                "You might be thinking what would be the right decision.",
                                "Shockingly the evidence of statistics has told us the right decision is actually not playing the game as the best in the long run we can do is staying break even."
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
                        title: "Sub-topic 0.2.2 Intuition Fails When Scale Increases",
                        content: {
                            hook: "Guess the average height of 5 people. Easy. Now guess for 50,000.",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Intuition%20Fails%20When%20Scale%20Increases.mp4",
                            animationPrompt: "To show that intuition breaks down when data becomes large or complex.",
                            scrollyPoints: [
                                "Intuition works only for small situations as large numbers confuse human judgment.",
                                "For e.g. a person tries to estimate the average height of people in a small room as we can do this by just observing through the intuition.",
                                "However, if there is a whole stadium with thousands of people and it's impossible to do so, therefore intuition is limited as well as not necessarily correct.",
                                "Statistics not only works with limited data but also with large scale so with the help of the it one can get the required info even in the stadium using statistical tools as its not limited to human intuition."
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
                        title: "Sub-topic 0.2.3 Guesswork Works Sometimes-By Accident",
                        content: {
                            hook: "Was it skill, or just dumb luck?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Guesswork%20Works%20Sometimes-By%20Accident.mp4",
                            animationPrompt: "To explain why occasional success of guesswork doesn't make it reliable.",
                            scrollyPoints: [
                                "In daily life guesswork might work sometimes but it doesn’t mean that it does so all the time or this is the reliable way to do the task.",
                                "For e.g. sometimes when students don’t know the answer of MCQ then they guessed it which may turn out right, but this doesn’t mean that they can only rely on that.",
                                "Another one can take the investment done in the share market.",
                                "Report has shown us that the majority of investors lose their money because they invest the wealth based on their guess and gut feeling, not actual data.",
                                "Because statistics shows the fact which conclude that is really the company worthy or is consistent in their work.",
                                "Guesswork might give the occasional success, but statistics is the actual tool which gives consistence rate of success."
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
                        title: "Sub-topic 0.2.4 Why do statistics win",
                        content: {
                            hook: "Why do casinos never go bankrupt?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Why%20do%20statistics%20win.mp4",
                            animationPrompt: "To show why statistics always outstands intuition and guesswork.",
                            scrollyPoints: [
                                "Guesswork relies on \"Luck,\" and luck eventually runs out; however, statistics rely on \"Probability,\" which is mathematically guaranteed to work overtime.",
                                "For e.g. A \"Guesser\" might pick one winning stock by accident.",
                                "But a \"Statistician\" builds a diverse portfolio that grows steadily, even when some stocks fail.",
                                "Therefore in the professional field like (banking sector, Insurance or Tech) all of them use statistics measures which give them consistency and winning edge.",
                                "If these companies rely on luck, i.e. guesswork or intuition, then the very second would be the last moment of that company.",
                                "Statistics doesn't try to be \"perfect\" once; it tries to be \"mostly right\" forever."
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
                title: "Topic 0.3: Deterministic vs. Uncertain Worlds",
                nodes: [
                    {
                        title: "Sub-topic 0.3.1 The Deterministic Worldview",
                        content: {
                            hook: "If you kick a ball the exact same way twice, will it land in the exact same spot?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Deterministic%20Worldview_.mp4",
                            animationPrompt: "To show the overview of the deterministic world.",
                            scrollyPoints: [
                                "In a deterministic world, the future is completely determined by the present.",
                                "If you know the current state of an object and the laws of physics, nature, mathematics, etc, then you can predict the outcome with 100% accuracy.",
                                "For eg : When you enter \"2 + 2\" into a calculator, the answer is always \"4.\" It will never randomly be \"5.\"",
                                "Therefore if you repeat an action under the exact same conditions in a deterministic system, you will get the exact same result every single time.",
                                "Variation only happens if you change an input; the system itself does not fluctuate.",
                                "Hence, determinism assumes that if we had enough data and processing power, nothing would be a surprise.",
                                "\"Chance\" or \"luck\" is viewed simply as a lack of knowledge about the hidden variables.",
                                "For eg: if we can know the speed of ball, force and angle, then every ball we can hit a \"six\" in cricket."
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
                        title: "Sub-topic 0.3.2 The Uncertain Worldview",
                        content: {
                            hook: "If you plant two identical seeds, why don't they grow to the exact same height?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Uncertain%20Worldview_.mp4",
                            animationPrompt: "To show the overview of the uncertain world.",
                            scrollyPoints: [
                                "In an uncertain world, the same inputs can lead to different outputs due to random chance.",
                                "Even if you do everything \"right,\" the result is not guaranteed, meaning we must think in terms of possibilities rather than certainties.",
                                "For example: You can plant a seed, water it perfectly, and provide the right sunlight, but it might still fail to grow due to random random factors.",
                                "In an uncertain world we have probability distributions which means instead of a single fixed number, outcomes are described by a range.",
                                "We cannot predict the specific outcome of one event, but we can predict the pattern of many events.",
                                "For eg: A clothing store cannot predict exactly which customer will walk in next and which cloth will he buy, however they can predict that roughly 60% of their customers on a winter season will buy woolen clothes."
                            ],
                            simulation: {
                                title: "The Windy Cannon",
                                interaction: "Fire cannon. Random wind pushes it off course.",
                                lesson: "Unknown variables break determinism."
                            }
                        }
                    },
                    {
                        title: "Sub-topic 0.3.3 The source of Uncertainty",
                        content: {
                            hook: "Why can't we predict the weather perfectly yet?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20source%20of%20Uncertainty_.mp4",
                            animationPrompt: "To show why we have uncertainties",
                            scrollyPoints: [
                                "Lack of infinite knowledge: According to a deterministic world, if we had all knowledge and a fixed algorithm, then we could accurately predict the result.",
                                "However, in an uncertain world, we lack this knowledge as well as the resources, and it is impossible to reduce the error by 100%.",
                                "For example: While growing crops, it is impossible to supply the exact amount of water and fertilizer, or to maintain the exact temperature.",
                                "Lack of parameters: In an uncertain world, there are many parameters involved in producing a result; therefore, it is impossible to trace all of them.",
                                "For example, even if we provide the exact amount of water and fertilizer, there are even more factors involved, such as heredity, genes, and DNA.",
                                "Tracing every parameter and aligning all of them to our favor at the same time to achieve a 100% yield is impossible."
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
                        title: "Sub-topic 0.3.4 How statistics joins the game",
                        content: {
                            hook: "How do we win a game we can't predict?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/How%20statistics%20joins%20the%20game.mp4",
                            animationPrompt: "To show the role of statistics in an uncertain world.",
                            scrollyPoints: [
                                "The Coexistence of Systems: In our real world, both deterministic and uncertain systems exist simultaneously.",
                                "For example, things that depend solely on mathematics or the laws of physics are deterministic. Conversely, activities like crop farming and business are examples of an uncertain world.",
                                "The Role of Statistics: Statistical measures help us manage the \"stuff\" of the uncertain world to make it function more like a deterministic one.",
                                "Although it is impossible to reach 100% efficiency in an uncertain world, getting closer to it is a significant achievement.",
                                "For example, in farming, the exact amount of water needed to achieve a 100% yield is impossible to know for certain.",
                                "However, with the help of statistical measures, we can determine the ideal numbers and manage other parameters to achieve the maximum possible yield.",
                                "In today's world, those who achieve the highest yields all use statistics to determine the correct amount of water and fertilizer."
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
                title: "Topic 0.4: Everyday decisions & hidden statistics",
                nodes: [
                    {
                        title: "Sub-topic 0.4.1 The Availability Heuristic",
                        content: {
                            hook: "Are you more afraid of Sharks or Cows?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Availability%20Heuristic.mp4",
                            animationPrompt: "The biases of what i recall often lead to the thinking that is statistically incorrect",
                            scrollyPoints: [
                                "We often estimate the probability or frequency of an event not by counting actual data, but by how easily examples come to mind.",
                                "Therefore, we become biased toward recent events or what we have heard.",
                                "For example: Most people are terrified of flying in a plane but comfortable driving to the airport.",
                                "This is because news reports of plane crashes are dramatic and easy to recall, whereas car accident statistics are \"boring\" and often ignored.",
                                "However, statistics suggest that airplanes are the safest mode of transportation.",
                                "Consequently, we often become biased by what we have heard recently and how news channels interpret events."
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
                        title: "Sub-topic 0.4.2 Anchoring",
                        content: {
                            hook: "How do you know if a T-shirt is a good price?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Anchoring%20(The%20Trap%20of%20the%20First%20Number)_.mp4",
                            animationPrompt: "To understand the \"Anchoring Effect,\" a psychological and statistical trap.",
                            scrollyPoints: [
                                "The Anchoring Effect: When estimating any value, we rely heavily on the first piece of information offered, even if it is irrelevant.",
                                "We tend to adjust away from the anchor, but we usually do not adjust enough.",
                                "For example: You go for a job interview and the manager offers you a salary of 50k. Even through negotiation, you might only reach 55k or 60k maximum.",
                                "If 70k had been offered at first, the story would have been different.",
                                "This statistical concept is used by industries, companies, and businesses.",
                                "In most cases, the person who speaks the first number sets the statistical range for the entire discussion."
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
                        title: "Sub-topic 0.4.3 Statistics Hidden in Daily Choices",
                        content: {
                            hook: "How did you know to bring an umbrella today?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Statistics%20Hidden%20in%20Daily%20Choices.mp4",
                            animationPrompt: "To reveal the hidden statistics behind our daily choices.",
                            scrollyPoints: [
                                "Many everyday decisions we make are based on informal data we observe.",
                                "Even if we don’t consciously calculate numbers, we use basic statistical measures from our intuition to make decisions.",
                                "For example: While going to college, you may choose one specific route among many because you have noticed it usually has less traffic at that time.",
                                "Another example is carrying an umbrella because the last few days have been rainy.",
                                "Unknowingly, you are using statistical measures to make your life easier.",
                                "From this, you can imagine the immense benefits of using formal statistical tools and measures to their full potential."
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
                title: "Topic 0.5 Correlation ≠ Causation",
                nodes: [
                    {
                        title: "Sub-topic 0.5.1 What Correlation Really Means",
                        content: {
                            hook: "What does it mean when two things move together?",
                            animationUrl: "default",
                            animationPrompt: "Abstract data visualization... glowing neon lines dancing together...",
                            scrollyPoints: [
                                "Correlation describes a relationship where two variables tend to change together.",
                                "If one goes up, the other might also go up (positive correlation); conversely, if one goes up, the other might go down (negative correlation).",
                                "It simply means that they are associated with each other.",
                                "For example: When the temperature increases, ice cream sales also increase, which is a positive correlation.",
                                "On the other hand, as height above sea level increases, the temperature tends to decrease, which is a negative correlation.",
                                "We also have zero correlation, where variables have no mathematical linear relationship to each other. For example, there is no correlation between a person’s IQ and their birthdate."
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
                        title: "Sub-topic 0.5.2 Why correlation itself is not causation",
                        content: {
                            hook: "Does eating ice cream cause shark attacks?",
                            animationUrl: "default",
                            animationPrompt: "To show that correlation is not the same as causation.",
                            scrollyPoints: [
                                "Causation means that one event is the direct result of another; specifically, because one thing happened, the other followed.",
                                "For example, when you move upward (increase your altitude), it causes a decrease in temperature.",
                                "From this example, you might think the concept is the same as correlation, but they are different.",
                                "For instance, when ice cream sales increase, drowning incidents also increase because both occur during the summer season.",
                                "However, does this mean that ice cream causes people to drown? No.",
                                "Causation and correlation can coexist. If there is a causal relationship, there will obviously be a correlation.",
                                "However, correlation does not automatically imply causation. There may or may not be a causal link."
                            ],
                            simulation: {
                                title: "The Ban Button",
                                interaction: "Ban Ice Cream. Shark attacks stay high.",
                                lesson: "No causality found."
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

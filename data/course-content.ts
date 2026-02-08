export type NodeType = 'animation' | 'simulation' | 'text' | 'mcq' | 'assignment';

export interface CourseNode {
    id: string;
    title: string;
    type: 'file';
    content: {
        hook: string;
        animationUrl?: string; // If 'default', use a placeholder
        animationPrompt?: string; // For uncreated animations
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
            title?: string;
            task: string;
        };
        references?: string[];
        aiSummary?: string;
    };
}

export interface CourseMission {
    id: string;
    title: string;
    type: 'folder';
    children: CourseNode[];
}

export interface CourseLevel {
    id: string;
    title: string;
    type: 'root';
    children: CourseMission[];
}

export const COURSE_DATA: CourseLevel[] = [
    {
        id: "level-0",
        title: "Level 0: Statistical Thinking (Foundation)",
        type: "root",
        children: [
            {
                id: "mission-0.1",
                title: "Topic 0.1: Why statistics exists",
                type: "folder",
                children: [
                    {
                        id: "node-0.1.1",
                        title: "Sub-topic 0.1.1: Conclusion of data cluster",
                        type: "file",
                        content: {
                            hook: "Can you spot the failing student in this list?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Conclusion%20of%20data%20cluster.mp4",
                            scrollyPoints: [
                                "The human mind has a \"cognitive limit.\" We cannot extract a clear picture from a raw, chaotic cluster of data.",
                                "Imagine a Principal with exam results for 1,000 students. It is impossible to review every single student's paper one by one to judge the school's performance.",
                                "The raw pile of papers is just noise.",
                                "Statistics compresses that noise into a signal. By calculating a single number (like an average), the Principal can instantly understand the performance of the entire school."
                            ],
                            simulation: {
                                title: "The 5-Second Count",
                                interaction: "Count scattered red/blue dots in 5 seconds. Apply Stats to sort them.",
                                lesson: "Structure beats chaos."
                            },
                            references: ["Miller, G. A. (1956). The Magical Number Seven..."],
                            aiSummary: "The '5-Second Count' demonstrates cognitive limits. Raw data is noise; statistics organizes it into a signal we can process. This lesson emphasizes why we need statistical tools to make sense of large datasets."
                        }
                    },
                    {
                        id: "node-0.1.2",
                        title: "Sub-topic 0.1.2: Understanding collective phenomena",
                        type: "file",
                        content: {
                            hook: "Does your neighbor know what the whole country is doing?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Understanding%20collective%20phenomena.mp4",
                            scrollyPoints: [
                                "Humans are \"Locally Minded.\" We only truly understand what we can see with our own eyes—our street, our neighbors.",
                                "You might see a birth in your family or a death on your street. But you cannot see the birth rate of the entire nation from your window.",
                                "To see the \"Big Picture,\" you need a medium.",
                                "If the death rate in a state spikes, the government cannot rely on individual anecdotes to notice it. They need the data.",
                                "Your eyes see the pixel. Statistics sees the whole image."
                            ],
                            simulation: {
                                title: "The Zoom Slider",
                                interaction: "Slider from Local (Road is smooth) to Global (60% roads broken).",
                                lesson: "Local perception != Global reality"
                            }
                        }
                    },
                    {
                        id: "node-0.1.3",
                        title: "Sub-topic 0.1.3: The “Small Sample” Trap",
                        type: "file",
                        content: {
                            hook: "My grandpa smoked and lived to 90. So smoking is safe, right?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Small%20Sample%20Trap.mp4",
                            scrollyPoints: [
                                "Our brains weigh personal experiences more heavily than the truth of the \"many.\" But your experience is not always the universal truth.",
                                "For example: You eat a burger at a restaurant and get sick. You immediately blame the burger.",
                                "But thousands of other people ate that same burger and felt fine. Was it the burger, or just bad timing?",
                                "We use statistics to verify if the burger is truly the problem.",
                                "Statistics moves us from \"I feel\" to \"We know\" by looking at the whole group, not just the individual."
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
                        id: "node-0.1.4",
                        title: "Sub-topic 0.1.4: Individual Cases Can Mislead Us",
                        type: "file",
                        content: {
                            hook: "Is the player bad, or just having a bad day?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Individual%20Cases%20Can%20Mislead%20Us.mp4",
                            scrollyPoints: [
                                "One person’s experience is a data point, not the whole truth. Individual opinions are often biased.",
                                "If you ask one student, \"Was the exam hard?\", they might say yes. Another might say no. Who is right?",
                                "Similarly, a medicine might work for one patient but fail for another. A doctor cannot prescribe medication based on a single success story.",
                                "We need a measure that captures the majority truth.",
                                "Statistics allows us to find the pattern amidst individual variations—whether it's the difficulty of an exam or the efficacy of a cure."
                            ],
                            mcq: {
                                question: "A medicine cures your headache but gives your friend a rash. Why can't a doctor ban it immediately?",
                                options: ["The doctor doesn't like your friend.", "Individual biology varies; we need average effect."],
                                correctAnswer: "Individual biology varies; we need average effect."
                            },
                            assignment: {
                                type: "Text",
                                title: "Rewrite the Headline",
                                task: "Rewrite a headline based on a single story to reflect statistical reality."
                            }
                        }
                    }
                ]
            },
            {
                id: "mission-0.2",
                title: "Topic 0.2: Statistics vs intuition",
                type: "folder",
                children: [
                    {
                        id: "node-0.2.1",
                        title: "Sub-topic 0.2.1: The Gambler’s Mindset",
                        type: "file",
                        content: {
                            hook: "If a coin flips Heads 5 times in a row, is Tails 'due' next?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Gamblers%20Mindset.mp4",
                            scrollyPoints: [
                                "Statistics replaces \"gut feelings\" with cold, hard evidence.",
                                "Imagine a gambler. A coin flips Heads 3 times in a row. His gut screams, \"Tails is due next!\" because he feels a pattern.",
                                "But the coin has no memory. The odds remain exactly 50/50. He bets on Tails and loses.",
                                "He was tricked by his intuition.",
                                "Statistics protects you from this error. It reveals that the best decision is often not to play at all, rather than chasing a pattern that doesn't exist."
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
                        id: "node-0.2.2",
                        title: "Sub-topic 0.2.2: Intuition Fails When Scale Increases",
                        type: "file",
                        content: {
                            hook: "Guess the average height of 5 people. Easy. Now guess for 50,000.",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Intuition%20Fails%20When%20Scale%20Increases.mp4",
                            scrollyPoints: [
                                "Intuition works for small tribes, but it breaks down with large numbers.",
                                "You can easily estimate the average height of 5 people in a small room just by looking.",
                                "Now, try doing that for a stadium of 50,000 people. Your brain just sees a blur.",
                                "Intuition is limited by scale; Statistics is not.",
                                "Math acts as a telescope for large numbers, allowing us to measure the \"stadium\" as easily as the \"room.\""
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
                        id: "node-0.2.3",
                        title: "Sub-topic 0.2.3: Guesswork Works Sometimes",
                        type: "file",
                        content: {
                            hook: "Was it skill, or just dumb luck?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Guesswork%20Works%20Sometimes-By%20Accident.mp4",
                            scrollyPoints: [
                                "Sometimes, you guess and get it right. That doesn't mean you knew the answer.",
                                "A student might blindly guess 'C' on a multiple-choice question and get it right. That is luck, not knowledge.",
                                "Similarly, many investors lose money because they mistake a lucky bet for skill. They invest based on \"feel,\" not data.",
                                "Reports show that consistency requires facts, not hunches.",
                                "Guesswork gives you occasional wins. Statistics gives you consistent results."
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
                        id: "node-0.2.4",
                        title: "Sub-topic 0.2.4: Why do statistics win",
                        type: "file",
                        content: {
                            hook: "Why do casinos never go bankrupt?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Why%20do%20statistics%20win.mp4",
                            scrollyPoints: [
                                "Guesswork relies on \"Luck,\" and luck eventually runs out. Statistics relies on \"Probability,\" which is mathematically guaranteed over time.",
                                "A \"Guesser\" might pick one winning stock by accident. A \"Statistician\" builds a diverse portfolio that grows even if some stocks fail.",
                                "This is why banks and insurance companies run on data. If they relied on luck or intuition, they would be bankrupt in a day.",
                                "Intuition tries to be \"perfect\" once. Statistics tries to be \"mostly right\" forever."
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
                id: "mission-0.3",
                title: "Topic 0.3: Deterministic vs uncertain",
                type: "folder",
                children: [
                    {
                        id: "node-0.3.1",
                        title: "Sub-topic 0.3.1: The Deterministic Worldview",
                        type: "file",
                        content: {
                            hook: "If you kick a ball the exact same way twice, will it land in the exact same spot?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Deterministic%20Worldview_.mp4",
                            scrollyPoints: [
                                "The Clockwork Universe: In a deterministic world, the future is completely determined by the present.",
                                "If you know the current state of an object and the laws of physics, you can predict the outcome with 100% accuracy. There is no randomness here.",
                                "Input = Output: Think of a calculator. If you type \"2 + 2,\" the answer is always \"4.\" It will never randomly be \"5.\" The rules are rigid.",
                                "Repetition is Perfect: If you repeat an action under the exact same conditions, you get the exact same result. Variation only happens if you change an input.",
                                "\"Chance\" is an Illusion: Determinism argues that \"luck\" is just a lack of data.",
                                "If we knew the exact speed of the ball, the force of the bat, and the wind resistance, a cricketer could hit a \"Six\" every single time. \"Missing\" isn't bad luck; it’s just physics we failed to calculate."
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
                        id: "node-0.3.2",
                        title: "Sub-topic 0.3.2: The Uncertain Worldview",
                        type: "file",
                        content: {
                            hook: "If you plant two identical seeds, why don't they grow to the exact same height?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Uncertain%20Worldview_.mp4",
                            scrollyPoints: [
                                "The Garden Universe: In an uncertain world, the same inputs can lead to different outputs.",
                                "You can plant a seed, water it perfectly, and provide the right sunlight. Yet, it might still fail to grow due to a random genetic defect or a hidden pest.",
                                "Possibilities, Not Certainties: Even if you do everything \"right,\" the result is not guaranteed.",
                                "Probability Distributions: We stop thinking in single numbers (Determinism) and start thinking in ranges (Uncertainty).",
                                "Predicting the Pattern: We cannot predict the specific outcome of one event, but we can predict the pattern of many.",
                                "A clothing store cannot predict exactly which customer will walk in next. However, they can predict with high accuracy that 60% of customers in winter will buy wool."
                            ],
                            simulation: {
                                title: "The Windy Cannon",
                                interaction: "Fire cannon. Random wind pushes it off course.",
                                lesson: "Unknown variables break determinism."
                            }
                        }
                    },
                    {
                        id: "node-0.3.3",
                        title: "Sub-topic 0.3.3: The source of Uncertainty",
                        type: "file",
                        content: {
                            hook: "Why can't we predict the weather perfectly yet?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20source%20of%20Uncertainty_.mp4",
                            scrollyPoints: [
                                "Why can't we be perfect? Two main reasons: Lack of Knowledge and Lack of Control.",
                                "1. Lack of Infinite Knowledge: If we had a \"God's eye view,\" maybe we could predict the crop yield perfectly. But we don't.",
                                "We cannot measure the exact moisture of every inch of soil or the exact trajectory of every wind gust. We are limited by our tools.",
                                "2. The \"Hidden Variables\" (Parameters): Real life has too many moving parts.",
                                "To get a 100% perfect crop yield, you would need to control temperature, water, fertilizer, genetics, soil microbes, and sunlight simultaneously.",
                                "Tracing every single parameter and aligning them perfectly is impossible. The \"Noise\" of the world prevents 100% accuracy."
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
                        id: "node-0.3.4",
                        title: "Sub-topic 0.3.4: How statistics joins the game",
                        type: "file",
                        content: {
                            hook: "How do we win a game we can't predict?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/How%20statistics%20joins%20the%20game.mp4",
                            scrollyPoints: [
                                "We Live in Both Worlds: \"2 + 2 = 4\" is deterministic. \"Will my startup succeed?\" is uncertain.",
                                "The Bridge: Statistics is the tool that helps us manage the uncertain world to make it look more like a deterministic one.",
                                "Maximizing Efficiency: We can never reach 100% certainty in farming or business. But statistics gets us from 50% to 95%.",
                                "Optimization: Modern farmers use data to calculate the ideal fertilizer amount. Retailers use data to stock the optimal inventory.",
                                "They don't guess. They use statistics to squeeze the maximum possible certainty out of an uncertain world."
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
                id: "mission-0.4",
                title: "Topic 0.4: Everyday decisions",
                type: "folder",
                children: [
                    {
                        id: "node-0.4.1",
                        title: "Sub-topic 0.4.1: The Availability Heuristic",
                        type: "file",
                        content: {
                            hook: "Are you more afraid of Sharks or Cows?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/The%20Availability%20Heuristic.mp4",
                            scrollyPoints: [
                                "Memory $\\neq$ Data: We estimate probability based on how easily we can remember an example, not on actual math.",
                                "The Fear Factor: Why are people terrified of planes but comfortable in cars?",
                                "Plane crashes are rare but dramatic. They are highly \"Available\" in your memory because they are all over the news.",
                                "Car accidents are common but \"boring.\" You ignore them.",
                                "The Reality: The most dangerous part of your flight is the drive to the airport. Your brain ignores the statistics because the fear of the crash is more vivid."
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
                        id: "node-0.4.2",
                        title: "Sub-topic 0.4.2: Anchoring",
                        type: "file",
                        content: {
                            hook: "How do you know if a T-shirt is a good price?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Anchoring%20(The%20Trap%20of%20the%20First%20Number)_.mp4",
                            scrollyPoints: [
                                "The Magnet Effect: When estimating a value, our brain grabs the first number it hears (the \"Anchor\") and gets stuck to it.",
                                "The Salary Trap: You walk into an interview. The manager offers 50k.",
                                "You negotiate hard and get 55k. You feel like you won.",
                                "But if the manager had started at 70k, you might have settled at 65k.",
                                "The First Mover Advantage: The person who drops the first number sets the statistical range for the entire conversation.",
                                "You adjust away from the anchor, but never far enough."
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
                        id: "node-0.4.3",
                        title: "Sub-topic 0.4.3: Hidden Statistics",
                        type: "file",
                        content: {
                            hook: "How did you know to bring an umbrella today?",
                            animationUrl: "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/Statistics%20Hidden%20in%20Daily%20Choices.mp4",
                            scrollyPoints: [
                                "You Are a Statistician: You don't need a spreadsheet to do statistics. You do it every day.",
                                "Traffic Theory: You choose a specific route to college because, over the last 50 days (Sample Size), it was usually the fastest (Average).",
                                "Weather Prediction: You carry an umbrella not because you checked the barometer, but because it has rained for 3 days straight (Pattern Recognition).",
                                "Intuition is Informal Data: Your brain is constantly collecting data points and calculating probabilities to keep you safe and efficient.",
                                "Formal statistics just takes this natural ability and gives it a mathematical super-power."
                            ],
                            mcq: {
                                question: "Why look left and right crossing the road?",
                                options: ["Parents told me", "Calculating survival probability"],
                                correctAnswer: "Calculating survival probability"
                            },
                            assignment: {
                                type: "Photo",
                                title: "Hunt for Anchors",
                                task: "Find an Anchoring trick on a shopping site."
                            }
                        }
                    }
                ]
            },
            {
                id: "mission-0.5",
                title: "Topic 0.5: Correlation vs causation",
                type: "folder",
                children: [
                    {
                        id: "node-0.5.1",
                        title: "Sub-topic 0.5.1: What Correlation Really Means",
                        type: "file",
                        content: {
                            hook: "What does it mean when two things move together?",
                            animationUrl: "default",
                            animationPrompt: "Abstract data visualization... glowing neon lines dancing together...",
                            scrollyPoints: [
                                "The Dance of Data: Correlation simply describes a relationship where two things change together.",
                                "Positive Correlation: When A goes up, B goes up. (e.g., Temperature rises $\\rightarrow$ Ice Cream sales rise).",
                                "Negative Correlation: When A goes up, B goes down. (e.g., Altitude rises $\\rightarrow$ Temperature drops).",
                                "Zero Correlation: Sometimes, things have no link at all. There is no mathematical relationship between your IQ and your birthdate."
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
                        id: "node-0.5.2",
                        title: "Sub-topic 0.5.2: Why correlation is not causation",
                        type: "file",
                        content: {
                            hook: "Does eating ice cream cause shark attacks?",
                            animationUrl: "default",
                            animationPrompt: "Split screen. Ice cream on beach vs Shark fin...",
                            scrollyPoints: [
                                "Causation: This is a direct link. A causes B. (Going up a mountain causes the temperature to drop).",
                                "The Trap: Just because two things move together, doesn't mean one pushed the other.",
                                "The Classic Example: Data shows that when Ice Cream sales increase, Drowning deaths also increase.",
                                "Does Ice Cream cause drowning? No.",
                                "The Hidden Variable: The \"Summer Heat\" causes both. People buy ice cream because it's hot. People swim (and sometimes drown) because it's hot.",
                                "Correlation is a hint, but it is not proof. Always look for the hidden third factor."
                            ],
                            simulation: {
                                title: "The Ban Button",
                                interaction: "Ban Ice Cream. Shark attacks stay high.",
                                lesson: "No causality found."
                            }
                        }
                    },
                    {
                        id: "node-0.5.3",
                        title: "Sub-topic 0.5.3: The Hidden Variable",
                        type: "file",
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
                                title: "Causation Detective",
                                task: "Find a 'X causes Y' headline and propose the Hidden Variable."
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "level-1",
        title: "Level 1: Data – The Raw Material",
        type: "root",
        children: [] // Placeholder for future levels
    },
    {
        id: "level-2",
        title: "Level 2: Descriptive Statistics",
        type: "root",
        children: []
    },
    {
        id: "level-3",
        title: "Level 3: Visual & Exploratory Data Analysis",
        type: "root",
        children: []
    },
    {
        id: "level-4",
        title: "Level 4: Probability & Uncertainty",
        type: "root",
        children: []
    },
    {
        id: "level-5",
        title: "Level 5: Sampling & Distributions",
        type: "root",
        children: []
    },
    {
        id: "level-6",
        title: "Level 6: Statistical Inference",
        type: "root",
        children: []
    },
    {
        id: "level-7",
        title: "Level 7: Relationships & Modeling",
        type: "root",
        children: []
    },
    {
        id: "level-8",
        title: "Level 8: Real World Applications",
        type: "root",
        children: []
    }
];

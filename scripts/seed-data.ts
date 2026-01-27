
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function main() {
    console.log("🌱 Starting database seed...");

    // 1. Cleanup existing data
    console.log("🧹 Cleaning up existing data...");
    await supabase.from("submissions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("user_progress").delete().neq("user_id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("assignments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("ai_summaries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("nodes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("courses").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // 2. Insert Courses
    console.log("📚 Inserting courses...");
    const courses = [
        {
            title: "Web Development Fundamentals",
            description: "Master the languages of the web: HTML, CSS, and JavaScript, through deep dives and interactive practice.",
            thumbnail_url: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=1000",
        },
        {
            title: "Statistics 101: Understanding the World",
            description: "Move beyond intuition. Learn to analyze data, understand probability, and make evidence-based decisions.",
            thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        }
    ];

    const { data: createdCourses, error: coursesError } = await supabase
        .from("courses")
        .insert(courses)
        .select();

    if (coursesError) {
        console.error("Error inserting courses:", coursesError);
        return;
    }

    const webDevCourse = createdCourses.find(c => c.title.includes("Web"));
    const statsCourse = createdCourses.find(c => c.title.includes("Statistics"));

    if (!webDevCourse || !statsCourse) {
        console.error("Courses not created correctly");
        return;
    }

    // 3. Insert Nodes
    console.log("🔗 Inserting nodes...");

    // Helper to create UUIDs for blocks
    const uuid = () => crypto.randomUUID();

    const nodes = [
        // ==========================================
        // WEB DEVELOPMENT COURSE (12 Nodes)
        // ==========================================
        {
            course_id: webDevCourse.id,
            title: "1. The Web's Architecture",
            type: "lesson",
            position_index: 0,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 10, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Global Conversation", animation: { type: "fade" } },
                    { id: uuid(), type: "text", content: "Every time you open a browser, you are starting a conversation. But who are you talking to?" },
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1665470909928-a832ebc923d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YnJvd3NlcnxlbnwwfHwwfHx8MA%3D%3D", caption: "The Connected World", animation: { type: "scale" } },
                    { id: uuid(), type: "text", content: "The web is built on a **Client-Server** model. You (the Client) ask for a page, and a computer somewhere else (the Server) sends it back." },
                    {
                        id: uuid(),
                        type: "animation",
                        format: "video",
                        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                        caption: "How the Internet Works (Animation)",
                        autoplay: false
                    },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "The Request Cycle" },
                    { id: uuid(), type: "text", content: "1. You type `google.com`.\n2. Your browser sends a **GET** request.\n3. The server finds the files.\n4. The server sends a **Response** (HTML, CSS, JS)." },
                    { id: uuid(), type: "simulation", simulationId: "network-visualizer", config: { mode: "network" }, instructions: "Visualize the data packet travel." },
                    { id: uuid(), type: "divider", style: "line" },
                    { id: uuid(), type: "text", content: "But how does it know *where* to go? That's DNS (Domain Name System). It's the phonebook of the internet." },
                    { id: uuid(), type: "ai-insight", prompt: "Explain DNS like I'm 5", showSummary: true },
                    { id: uuid(), type: "quiz", question: "Who stores the website files?", options: ["The Client", "The Server", "The Internet Provider"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "2. Setting Up Your Environment",
            type: "lesson",
            position_index: 1,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Your Digital Workshop" },
                    { id: uuid(), type: "text", content: "You can write code in Notepad, but you shouldn't. You need a dedicated Code Editor." },
                    { id: uuid(), type: "image", url: "https://media.istockphoto.com/id/2114295998/photo/asian-and-indian-developer-devops-team-discussion-about-coding-promgram-with-software.webp?a=1&b=1&s=612x612&w=0&k=20&c=qNgHSOfUKy-jPjzg9JmtQ0_fuKw2TvGC02gRSsJpGEc=", caption: "VS Code Interface" },
                    { id: uuid(), type: "text", content: "**VS Code** is the industry standard. It highlights your errors, helps you autocomplete, and has thousands of plugins." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "The Browser Console" },
                    { id: uuid(), type: "text", content: "Your browser isn't just for viewing. It's for debugging. Right-click and hit 'Inspect'." },
                    { id: uuid(), type: "text", content: "This opens the **DevTools**. You can change the code of any website live (only on your screen)." },
                    { id: uuid(), type: "simulation", simulationId: "devtools", config: { mode: "devtools" }, instructions: "Try inspecting elements to see underlying HTML." },
                    { id: uuid(), type: "ai-insight", prompt: "What are the most useful VS Code extensions for beginners?", showSummary: true },
                    { id: uuid(), type: "quiz", question: "What creates the industry standard editor VS Code?", options: ["Google", "Microsoft", "Facebook"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "3. HTML: The Skeleton",
            type: "lesson",
            position_index: 2,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Anatomy of a Tag" },
                    { id: uuid(), type: "text", content: "HTML stands for HyperText Markup Language. It uses 'tags' to wrap content." },
                    { id: uuid(), type: "text", style: "code", content: "<p>This is a paragraph</p>" },
                    { id: uuid(), type: "text", content: "The `<p>` is the opening tag. The `</p>` is the closing tag." },
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&q=80&w=1000", caption: "HTML Structure" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "The Hierarchy" },
                    { id: uuid(), type: "text", content: "HTML is a tree. You have `<html>`, inside that `<body>`, inside that `<h1>`." },
                    { id: uuid(), type: "text", content: "Nesting correctly is crucial. Indentation helps you see the structure." },
                    { id: uuid(), type: "simulation", simulationId: "dom", config: { mode: "dom" }, instructions: "Visualize the Tree Structure of HTML." },
                    { id: uuid(), type: "quiz", question: "Which tag creates a large heading?", options: ["<p>", "<h1>", "<head>"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "4. Semantic HTML",
            type: "lesson",
            position_index: 3,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 12, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Meaning Over Style" },
                    { id: uuid(), type: "text", content: "You *could* build a whole site with `<div>` tags. But you shouldn't." },
                    { id: uuid(), type: "text", content: "**Semantic HTML** means using tags that describe their content: `<article>`, `<nav>`, `<aside>`." },
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGh0bWx8ZW58MHx8MHx8fDA%3D", caption: "Screen Readers run on Semantics" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "Accessibility (A11y)" },
                    { id: uuid(), type: "text", content: "Blind users rely on screen readers. If your button is just a `<div>`, the screen reader won't know it's clickable." },
                    { id: uuid(), type: "ai-insight", prompt: "Explain the role of ARIA labels in HTML", showSummary: true },
                    { id: uuid(), type: "quiz", question: "Which tag is best for a navigation menu?", options: ["<div>", "<nav>", "<section>"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "5. CSS: The Skin",
            type: "lesson",
            position_index: 4,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 20, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Cascading Style Sheets" },
                    { id: uuid(), type: "text", content: "HTML is the skeleton. CSS is the skin, clothing, and makeup." },
                    { id: uuid(), type: "text", content: "It controls color, typography, layout, and animation." },
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y3NzfGVufDB8fDB8fHww", caption: "Before and After CSS" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "Selectors" },
                    { id: uuid(), type: "text", content: "How do you tell CSS *which* element to style? Selectors." },
                    { id: uuid(), type: "text", content: "- `p { ... }` targets all paragraphs.\n- `.class { ... }` targets a class.\n- `#id { ... }` targets a specific ID." },
                    { id: uuid(), type: "simulation", simulationId: "selectors", config: { mode: "selectors" }, instructions: "Select the red circles." },
                    { id: uuid(), type: "quiz", question: "Which selector targets a class?", options: ["#name", ".name", "name"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "6. The Box Model",
            type: "lesson",
            position_index: 5,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Everything is a Box" },
                    { id: uuid(), type: "text", content: "This is the most important concept in CSS layout. Every element is a rectangle." },
                    { id: uuid(), type: "text", content: "It has layers like an onion:" },
                    { id: uuid(), type: "image", url: "https://media.istockphoto.com/id/1337505267/photo/colorful-broken-cube-sketch-effect-abstract-illustration-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=B27xvlKcIgbRpxbSuOUmpl2eRJ3l5bK9uOUnPy6eN-U=", caption: "The Box Model Diagram" },
                    { id: uuid(), type: "divider", style: "line" },
                    { id: uuid(), type: "text", content: "1. **Content**: The text or image.\n2. **Padding**: Space *inside* the border.\n3. **Border**: The line around the padding.\n4. **Margin**: Space *outside* the border." },
                    { id: uuid(), type: "simulation", simulationId: "box-model", config: { mode: "box-model" }, instructions: "Adjust padding and margin to see the difference." },
                    { id: uuid(), type: "quiz", question: "Which property adds space OUTSIDE the border?", options: ["Padding", "Margin", "Content"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "7. Flexbox Layouts",
            type: "lesson",
            position_index: 6,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 25, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Layout Before Flexbox" },
                    { id: uuid(), type: "text", content: "In the old days, we used `float` and `table` for layout. It was a nightmare." },
                    { id: uuid(), type: "text", style: "heading", content: "Enter Flexbox" },
                    { id: uuid(), type: "text", content: "Flexbox allows you to align items in rows or columns, distribute space, and handle different screen sizes with ease." },
                    { id: uuid(), type: "image", url: "data:image/png;base64,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", caption: "Flexbox Axes" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "Justify & Align" },
                    { id: uuid(), type: "text", content: "`justify-content` controls the main axis (usually horizontal). `align-items` controls the cross axis (usually vertical)." },
                    { id: uuid(), type: "simulation", simulationId: "flexbox", config: { mode: "flexbox" }, instructions: "Align the frogs using Flexbox properties." },
                    { id: uuid(), type: "quiz", question: "To center an item horizontally in a row, use:", options: ["align-items: center", "justify-content: center", "margin: auto"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "8. CSS Grid",
            type: "lesson",
            position_index: 7,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 25, difficulty: "advanced" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "2D Layout Powerhouse" },
                    { id: uuid(), type: "text", content: "Flexbox is for 1D (lines). Grid is for 2D (rows and columns simultaneously)." },
                    { id: uuid(), type: "text", content: "You can define a complex magazine-style layout in just a few lines of CSS." },
                    { id: uuid(), type: "image", url: "data:image/png;base64,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", caption: "Complex Grid Layouts" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", content: "You define columns like this: `grid-template-columns: 1fr 2fr;`. This creates two columns, one twice as wide as the other." },
                    { id: uuid(), type: "ai-insight", prompt: "Difference between Flexbox and Grid", showSummary: true },
                    { id: uuid(), type: "quiz", question: "Which is best for a full page dashboard layout?", options: ["Flexbox", "Grid", "Float"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "9. JavaScript Basics",
            type: "lesson",
            position_index: 8,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 20, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Making it Alive" },
                    { id: uuid(), type: "text", content: "HTML is content. CSS is style. **JavaScript** is behavior." },
                    { id: uuid(), type: "text", content: "It's a full programming language running in the browser. It can fetch data, change the page, and calculate logic." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "Variables & Types" },
                    { id: uuid(), type: "text", content: "Store data in variables using `let` or `const`." },
                    { id: uuid(), type: "text", style: "code", content: "let score = 0;\nconst name = 'Alex';" },
                    { id: uuid(), type: "simulation", simulationId: "logic-gates", instructions: "Understand logic flow (Logic Gates Sim)." },
                    { id: uuid(), type: "quiz", question: "Which keyword creates a variable that cannot be changed?", options: ["var", "let", "const"], correctIndex: 2, unlocks: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "10. Project: Personal Portfolio",
            type: "assignment",
            position_index: 9,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 60, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Build Your Brand" },
                    { id: uuid(), type: "text", content: "Time to put it all together. You will build a personal portfolio website." },
                    { id: uuid(), type: "text", style: "subheading", content: "Requirements:" },
                    { id: uuid(), type: "text", content: "1. Use semantic HTML.\n2. Use Flexbox for the navbar.\n3. Use CSS Grid for the project gallery.\n4. Make it look good!" },
                    { id: uuid(), type: "image", url: "data:image/jpeg;base64,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", caption: "Portfolio Inspiration" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "assignment", title: "Submit Portfolio", description: "Upload a screenshot or link.", submissionTypes: ["photo", "text"], isBlocking: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "11. DOM Manipulation",
            type: "lesson",
            position_index: 10,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Document Object Model" },
                    { id: uuid(), type: "text", content: "The DOM is how JS sees your HTML. It's a tree of objects." },
                    { id: uuid(), type: "text", content: "You can grab elements: `document.getElementById('title')`." },
                    { id: uuid(), type: "text", content: "You can change them: `element.innerText = 'New Title'`." },
                    { id: uuid(), type: "divider", style: "line" },
                    { id: uuid(), type: "text", content: "This is how features like 'Dark Mode' or 'Live Search' work without reloading the page." },
                    { id: uuid(), type: "simulation", simulationId: "dom", config: { mode: "dom", interactive: true }, instructions: "Click nodes in the DOM tree to highlight elements." },
                    { id: uuid(), type: "ai-insight", prompt: "Safety risks of innerHTML", showSummary: true }
                ]
            }
        },
        {
            course_id: webDevCourse.id,
            title: "12. Responsive Design",
            type: "lesson",
            position_index: 11,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Mobile First" },
                    { id: uuid(), type: "text", content: "More people browse on phones than desktops. Your site must adapt." },
                    { id: uuid(), type: "image", url: "data:image/jpeg;base64,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", caption: "Responsive Devices" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "Media Queries" },
                    { id: uuid(), type: "text", content: "`@media (max-width: 600px) { ... }` allows you to apply CSS only on small screens." },
                    { id: uuid(), type: "text", content: "This is the backbone of responsive design." },
                    { id: uuid(), type: "quiz", question: "What is a breakpoint in Responsive Design?", options: ["A broken link", "A screen width where design changes", "A Javascript bug"], correctIndex: 1, unlocks: true }
                ]
            }
        },

        // ==========================================
        // STATISTICS COURSE (12 Nodes)
        // ==========================================
        {
            course_id: statsCourse.id,
            title: "1. Why Statistics Exists?",
            type: "lesson",
            position_index: 0,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Why Statistics Exists?", animation: { type: "fade" } },
                    // 1 Conclusion of data cluster
                    { id: uuid(), type: "text", style: "subheading", content: "1. Conclusion of Data Cluster" },
                    {
                        id: uuid(),
                        type: "animation",
                        format: "video",
                        url: "/assets/statistics/cluster_anim.mp4",
                        caption: "Data Cluster Illusion: Impossible to draw conclusions from raw cluster without tools.",
                        autoplay: true
                    },
                    { id: uuid(), type: "text", content: "Human mind is limited to the data that can be observed so its impossible to extract or view the data from data cluster." },
                    { id: uuid(), type: "text", content: "For eg: after examination, the principal wants to get sight on the performance of the students, however its not possible to see the result of thousand of students one by one and review the student of each classes." },
                    { id: uuid(), type: "text", content: "With the help of statistics, the performance of each class can be represented by a single number so, the head teacher can only observe few numbers to get idea of the performance of overall school." },

                    // 2 Understanding collective phenomena
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "2. Understanding Collective Phenomena" },
                    {
                        id: uuid(),
                        type: "animation",
                        format: "video",
                        url: "/assets/statistics/collective_anim.mp4",
                        caption: "Individual vs Big Picture: Statistics allows us to see the 'Nation' level view.",
                        autoplay: true
                    },
                    { id: uuid(), type: "text", content: "Humans are \"locally minded\"—we only truly understand what we can see with our own eyes i.e. the events happening in our locality however its impossible to know that going in the bigger picture (state/nation) without any medium." },
                    { id: uuid(), type: "text", content: "For eg. One can know or observe the people taking birth or the people dying in his locality but having no idea about his country. So by the help of statistics, by a single number he can get the idea about the people taking birth or dying in his country." },
                    { id: uuid(), type: "text", content: "One can argue, why a individual could care about the bigger picture however it’s not only about the individual but in the government level suppose the death rate can increased rapidly of a state then policy should be made accordingly. The information that death rate has increased can only be known using statistics." },

                    // 3 The “Small Sample” Trap
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "3. The \"Small Sample\" Trap" },
                    { id: uuid(), type: "text", content: "Objective: Explain why our personal experiences are often \"statistically insignificant.\"" },
                    { id: uuid(), type: "text", content: "Our brains weigh our own experiences more heavily than the truth of the \"many.\" Just because something happened to you that doesn’t mean it’s the truth." },
                    { id: uuid(), type: "text", content: "For e.g. after eating burger from a restaurant you fell ill as a result you may think it’s all because of burger you ate however the problem may not be the burger itself but another factor because thousands of other people are eating same burger and nothing happening to them. So we use statistics to know whether its really the problem of burger or not." },
                    { id: uuid(), type: "text", content: "Statistics moves us from \"I feel\" to \"We know\" by looking at the whole group, not just the individual." },

                    // 4 Individual Cases Can Mislead Us
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "4. Individual Cases Can Mislead Us" },
                    { id: uuid(), type: "text", content: "One person’s experience is not the whole truth as Individual opinions can be biased therefore we need a way to see the overall picture." },
                    { id: uuid(), type: "text", content: "For e.g. asking one student about an exam doesn’t tell how hard the exam really was as one can say it was hard and easy for another. Similar a newly launched medicine may work out for one and not for another therefore doctor can’t prescribe these kind of medicine. We need to find the medium or measure to really now how hard was the exam really and will the medicine work of maximum no of patients." },
                    { id: uuid(), type: "text", content: "Of course statistics is the medium to get the things most closer toward the truth whether its about how hard is the exam or about the medicine." },
                    { id: uuid(), type: "quiz", question: "Why is personal experience often misleading?", options: ["It is always a lie", "It is a small sample size", "It is not emotional"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "2. Statistics vs Intuition",
            type: "lesson",
            position_index: 1,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "beginner" },
                blocks: [
                    // 1: The Gambler’s Mindset
                    { id: uuid(), type: "text", style: "heading", content: "Statistics vs Intuition" },
                    { id: uuid(), type: "text", style: "subheading", content: "1. The Gambler’s Mindset" },
                    {
                        id: uuid(),
                        type: "animation",
                        format: "video",
                        url: "/assets/statistics/gambler_anim.mp4",
                        caption: "The Gambler's Fallacy: Expecting Tails just because Heads happened 3 times.",
                        autoplay: true
                    },
                    { id: uuid(), type: "text", content: "Statistics replace gut feelings with evidence and help to make the decision without being carried out by our emotions." },
                    { id: uuid(), type: "text", content: "For e.g. a gambler is trying his luck in a game of coin. He observes that it was head 3 times in a row so fourth time he bet for tail as his intuition made him feel that it should be tail now as it was head 3 times in a row. However, it was head once again and he lost as he was just guessing carried by his emotion." },
                    { id: uuid(), type: "text", content: "Statistics helps us to not make the decision done by that gambler as his decision was statistically incorrect. You might be thinking what would be the right decision. Shockingly the evidence of statistics has told us the right decision is actually not playing the game as the best in the long run we can do is staying break even so it's not worthy." },

                    // 2: Intuition Fails When Scale Increases
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "2. Intuition Fails When Scale Increases" },
                    {
                        id: uuid(),
                        type: "animation",
                        format: "video",
                        url: "/assets/statistics/scale_anim.mp4",
                        caption: "Intuition works for a room, fails for a stadium.",
                        autoplay: true
                    },
                    { id: uuid(), type: "text", content: "Intuition works only for small situations as large numbers confuse human judgment." },
                    { id: uuid(), type: "text", content: "For e.g. a person tries to estimate the average height of people in a small room as we can do this by just observing through the intuition. However, if there is a whole stadium with thousands of people and it's impossible to do so, therefore intuition is limited as well as not necessarily correct." },
                    { id: uuid(), type: "text", content: "Statistics not only works with limited data but also with large scale so with the help of the it one can get the required info even in the stadium using statistical tools as its not limited to human intuition." },

                    // 3 Guesswork Works Sometimes-By Accident
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "3. Guesswork Works Sometimes—By Accident" },
                    {
                        id: uuid(),
                        type: "animation",
                        format: "video",
                        url: "/assets/statistics/investment_anim.mp4",
                        caption: "Investment luck vs long-term failure.",
                        autoplay: true
                    },
                    { id: uuid(), type: "text", content: "In daily life guesswork might work sometimes but it doesn’t mean that it does so all the time or this is the reliable way to do the task." },
                    { id: uuid(), type: "text", content: "For e.g. sometimes when students don’t know the answer of MCQ then they guessed it which may turn out right, but this doesn’t mean that they can only rely on that. Another one can take the investment done in the share market. Report has shown us that the majority of investor loss their money because they invest the wealth based on their guess and gut feeling not actual data i.e. using statistics as shown in the clip, because statistics shows the fact which conclude that is really the company worthy or is consistence in their work." },
                    { id: uuid(), type: "text", content: "Guesswork mighty gives the occasional success, but statistics is the actual tool which gives consistence rate of success." },

                    // 4. Why do statistics win
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "4. Why Do Statistics Win?" },
                    { id: uuid(), type: "text", content: "Guesswork relies on \"Luck,\" and luck eventually runs out however, statistics rely on \"Probability,\" which is mathematically guaranteed to work overtime." },
                    { id: uuid(), type: "text", content: "For e.g. A \"Guesser\" might pick one winning stock by accident. But a \"Statistician\" builds a diverse portfolio that grows steadily, even when some stocks fail therefore in the professional field like (banking sector, Insurance or Tech) all of them use statistics measure which give them consistency and winning edge making them stable and successful in the market. If these companies rely on luck, i.e. guesswork or intuition, then the very second would be the last moment of that company." },
                    { id: uuid(), type: "text", content: "Statistics doesn't try to be \"perfect\" once; it tries to be \"mostly right\" forever." },
                    { id: uuid(), type: "quiz", question: "Why does the House always win in a casino?", options: ["It cheats", "Law of Large Numbers", "It has better intuition"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "3. Deterministic vs. Uncertain Worlds",
            type: "lesson",
            position_index: 2,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 10, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Deterministic vs. Uncertain Worlds" },
                    { id: uuid(), type: "text", style: "subheading", content: "1. The Deterministic Worldview" },
                    { id: uuid(), type: "text", content: "In a deterministic world, the future is completely determined by the present. If you know the current state of an object and the laws of physics, nature, mathematics, etc then you can predict the outcome with 100% accuracy because there is no randomness involved." },
                    { id: uuid(), type: "text", content: "For eg: When you enter \"2 + 2\" into a calculator, the answer is always \"4.\" It will never randomly be \"5\" because the programming logic and the rules of mathematics are rigid and deterministic." },
                    { id: uuid(), type: "text", content: "Therefore if you repeat an action under the exact same conditions in a deterministic system, you will get the exact same result every single time. Variation only happens if you change an input; the system itself does not fluctuate." },
                    { id: uuid(), type: "text", content: "For eg: if you enter “2+2” even thousands of times in the calculator the result will not change." },
                    { id: uuid(), type: "text", content: "Hence, determinism assumes that if we had enough data and processing power, nothing would be a surprise. \"Chance\" or \"luck\" is viewed simply as a lack of knowledge about the hidden variables(factor) causing the result." },
                    { id: uuid(), type: "text", content: "For eg: if we can know the speed of ball, force we need to hit the ball form the bat and angle at which we should hit the then every ball we can hit a “six” in cricket. Here the condition that we can’t hit six on every ball is taken of lack of knowledge and resources so it”s all about the laws and resources(may be robotic hand} not the skill itself." },
                    { id: uuid(), type: "quiz", question: "In a deterministic system, a result is:", options: ["Random", "Predictable given inputs", "Based on feelings"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "4. Visualizing Data",
            type: "lesson",
            position_index: 3,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 12, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "A Picture is Worth 1000 Rows" },
                    { id: uuid(), type: "text", content: "Raw tables of numbers are unreadable. Visualization maps numbers to spatial properties like length, position, or color." },
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&q=80&w=1000", caption: "Complex Data Viz" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "The Histogram" },
                    { id: uuid(), type: "text", content: "A histogram groups data into 'bins'. It shows the shape of the data distribution." },
                    { id: uuid(), type: "simulation", simulationId: "histogram", config: { mode: "histogram" }, instructions: "Adjust bin size to see distribution shape changes." },
                    { id: uuid(), type: "quiz", question: "What does the height of a bar in a histogram represent?", options: ["The value", "The frequency count", "The time"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "5. Measures of Central Tendency",
            type: "lesson",
            position_index: 4,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The 'Average' Ambiguity" },
                    { id: uuid(), type: "text", content: "When someone says 'average', they usually mean the **Mean**. But that's not always the best measure." },
                    { id: uuid(), type: "divider", style: "line" },
                    { id: uuid(), type: "text", content: "1. **Mean**: Sum / Count. Sensitive to outliers.\n2. **Median**: The middle value. Robost to outliers.\n3. **Mode**: The most common value." },
                    { id: uuid(), type: "text", content: "Example: If Bill Gates walks into a bar, the 'mean' income skyrockets, but the 'median' income stays the same." },
                    { id: uuid(), type: "simulation", simulationId: "central-tendency", config: { mode: "central-tendency" }, instructions: "Add an outlier and watch the Mean vs Median move." },
                    { id: uuid(), type: "quiz", question: "Which measure is best for house prices?", options: ["Mean", "Median", "Mode"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "6. Variance & Standard Deviation",
            type: "lesson",
            position_index: 5,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 20, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Measuring Consistency" },
                    { id: uuid(), type: "text", content: "Two classes can have the same average score (75%), but one class has everyone at 75% (low variance), and the other has 100s and 50s (high variance)." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "Standard Deviation (SD)" },
                    { id: uuid(), type: "text", content: "This is the most common way to measure spread. In a normal distribution, most data is within 1 SD of the mean." },
                    { id: uuid(), type: "simulation", simulationId: "statistics", config: { mode: "normal" }, instructions: "Visualize how Standard Deviation defines spread." },
                    { id: uuid(), type: "ai-insight", prompt: "Why do we square differences in Variance?", showSummary: true },
                    { id: uuid(), type: "quiz", question: "A low standard deviation means:", options: ["Data is spread out", "Data is clustered around the mean", "Data is incorrect"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "7. The Normal Distribution",
            type: "lesson",
            position_index: 6,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 20, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Bell Curve" },
                    { id: uuid(), type: "text", content: "It appears everywhere in nature: Heights, blood pressure, errors in measurement, IQ scores." },
                    { id: uuid(), type: "image", url: "https://media.istockphoto.com/id/1371167202/photo/histogram-with-gaussian-distribution-on-blackboard.webp?a=1&b=1&s=612x612&w=0&k=20&c=7svBeJhnYN5Fq62CWHPhcoFQNdKK28hEOKbnpk4SF_M=", caption: "The Bell Curve" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "The 68-95-99.7 Rule" },
                    { id: uuid(), type: "text", content: "- 68% of data is within 1 SD.\n- 95% within 2 SD.\n- 99.7% within 3 SD." },
                    { id: uuid(), type: "simulation", simulationId: "statistics", config: { mode: "normal" }, instructions: "Visualize the Standard Deviation distribution." },
                    { id: uuid(), type: "quiz", question: "What percent of data is within 2 SDs in a Normal Calc?", options: ["50%", "68%", "95%"], correctIndex: 2, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "8. Z-Scores",
            type: "lesson",
            position_index: 7,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "advanced" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Comparing Apples and Oranges" },
                    { id: uuid(), type: "text", content: "Who is more impressive? A runner who does a 4-minute mile, or a student who scores 1500 on the SAT?" },
                    { id: uuid(), type: "text", content: "You can't compare directly. You need **Z-Scores**." },
                    { id: uuid(), type: "divider", style: "line" },
                    { id: uuid(), type: "text", content: "A Z-score tells you how many standard deviations away from the mean a value is." },
                    { id: uuid(), type: "text", style: "code", content: "Z = (Value - Mean) / SD" },
                    { id: uuid(), type: "simulation", simulationId: "z-score", config: { mode: "z-score" }, instructions: "Calculate Z-Scores for different values." },
                    { id: uuid(), type: "quiz", question: "What is the Z-score of the Mean?", options: ["1", "0", "-1"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "9. Correlation vs Causation",
            type: "lesson",
            position_index: 8,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 12, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Golden Rule" },
                    { id: uuid(), type: "text", content: "**Correlation does not imply Causation.** Memorize this." },
                    { id: uuid(), type: "text", content: "Just because two variables move together, doesn't mean one causes the other." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "Spurious Correlations" },
                    { id: uuid(), type: "text", content: "Did you know that per capita cheese consumption correlates with the number of people who died by becoming tangled in their bedsheets?" },
                    { id: uuid(), type: "image", url: "https://media.istockphoto.com/id/2194803315/photo/catered-breakfast-in-bed.webp?a=1&b=1&s=612x612&w=0&k=20&c=-P2uqQS0Opg6Wh8dKx3gr-2j5aryiaYwU1gI6VkPlwA=", caption: "Cheese vs Bedsheets" },
                    { id: uuid(), type: "text", content: "This is purely coincidence (or a hidden third variable)." },
                    { id: uuid(), type: "quiz", question: "If A and B are correlated, what is true?", options: ["A causes B", "B causes A", "They move together"], correctIndex: 2, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "10. Probability Basics",
            type: "lesson",
            position_index: 9,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 20, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Science of Chance" },
                    { id: uuid(), type: "text", content: "Probability is the language of uncertainty. It ranges from 0 (Impossible) to 1 (Certain)." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "The Gambler's Fallacy" },
                    { id: uuid(), type: "text", content: "If a coin flips Heads 5 times, is Tails 'due'? No. The coin has no memory." },
                    { id: uuid(), type: "simulation", simulationId: "probability", config: { mode: "gambler" }, instructions: "Flip a coin 10 times. Look for streaks." },
                    { id: uuid(), type: "text", content: "In the short run, anything can happen. In the long run, it averages out." },
                    { id: uuid(), type: "quiz", question: "Probability of Heads is:", options: ["50%", "Depends on last flip", "Unknown"], correctIndex: 0, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "11. Law of Large Numbers",
            type: "lesson",
            position_index: 10,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Stability in Numbers" },
                    { id: uuid(), type: "text", content: "This law guarantees stable long-term results for random events." },
                    { id: uuid(), type: "text", content: "A casino always wins in the long run because of this law." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "simulation", simulationId: "probability", config: { coinFlips: 100 }, instructions: "Flip 100 coins. Notice how the ratio gets closer to 50%." },
                    { id: uuid(), type: "ai-insight", prompt: "How do insurance companies use Law of Large Numbers?", showSummary: true },
                    { id: uuid(), type: "quiz", question: "As sample size increases:", options: ["Variance acts wild", "Mean gets closer to true probability", "Nothing happens"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "12. Hypothesis Testing",
            type: "lesson",
            position_index: 11,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 25, difficulty: "advanced" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Scientific Method Proof" },
                    { id: uuid(), type: "text", content: "How do we know if a new drug works? We start with a **Null Hypothesis ($H_0$)**: 'The drug has no effect'." },
                    { id: uuid(), type: "text", content: "Then we gather data to try and reject $H_0$." },
                    { id: uuid(), type: "divider", style: "line" },
                    { id: uuid(), type: "text", style: "heading", content: "The P-Value" },
                    { id: uuid(), type: "text", content: "The p-value is the probability that your results happened by random chance. If p < 0.05, we say it's 'Significant'." },
                    { id: uuid(), type: "ai-insight", prompt: "Misinterpretations of P-Values", showSummary: true },
                    { id: uuid(), type: "quiz", question: "A p-value of 0.03 means:", options: ["3% chance it was random noise", "The result is 3% correct", "We failed"], correctIndex: 0, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "13. Regression Analysis",
            type: "lesson",
            position_index: 12,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 25, difficulty: "advanced" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Predicting the Future" },
                    { id: uuid(), type: "text", content: "Regression finds the relationship between variables. The most simple is Linear Regression." },
                    { id: uuid(), type: "text", content: "`y = mx + b`" },
                    { id: uuid(), type: "image", url: "https://media.istockphoto.com/id/1385299308/photo/abstract-financial-charts-on-a-digital-display.webp?a=1&b=1&s=612x612&w=0&k=20&c=fDiiLNXjlrCod426VsT5778wCmeUOMLsuGy_95o787E=", caption: "Linear Regression Line" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "simulation", simulationId: "statistics", config: { mode: "trend" }, instructions: "Visualize fitting a line to data." },
                    { id: uuid(), type: "text", content: "$R^2$ tells you how well the line fits the data. 1 is perfect, 0 is useless." },
                    { id: uuid(), type: "quiz", question: "What does the slope (m) represent?", options: ["The starting value", "The rate of change", "The error"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "14. Final Project: Analyze This",
            type: "assignment",
            position_index: 13,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 60, difficulty: "advanced" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Real World Challenge" },
                    { id: uuid(), type: "text", content: "You've learned the tools. Now apply them." },
                    { id: uuid(), type: "text", content: "We have provided a dataset of customer purchases. Your job is to find the correlation between Age and Spend." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "subheading", content: "Instructions:" },
                    { id: uuid(), type: "text", content: "1. Download dataset (Placeholder).\n2. Calculate Mean and Median.\n3. Create a Scatter Plot.\n4. Write a conclusion." },
                    { id: uuid(), type: "assignment", title: "Submit Analysis", description: "Upload your report.", submissionTypes: ["text", "photo"], isBlocking: true }
                ]
            }
        }
    ];

    const { data: createdNodes, error: nodesError } = await supabase
        .from("nodes")
        .insert(nodes)
        .select();

    if (nodesError) {
        console.error("Error inserting nodes:", nodesError);
        return;
    }

    // 4. Insert Assignment Details (Syncing with JSON blocks)
    console.log("📝 Inserting assignments...");

    // Find nodes that have assignment blocks in their JSON
    for (const node of createdNodes) {
        const content = node.content_json;
        if (!content || !content.blocks) continue;

        const assignmentBlocks = content.blocks.filter((b: any) => b.type === 'assignment');

        for (const block of assignmentBlocks) {
            await supabase.from("assignments").insert({
                node_id: node.id,
                title: block.title,
                instructions: block.description || block.instructions,
                submission_types: block.submissionTypes || ['text'],
                is_required: block.isBlocking || false
            });
        }
    }

    console.log("✅ Seed completed successfully!");
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});

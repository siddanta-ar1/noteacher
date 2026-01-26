
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

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
    const uuid = () => Math.random().toString(36).substring(2, 15);

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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000", caption: "The Connected World", animation: { type: "scale" } },
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000", caption: "VS Code Interface" },
                    { id: uuid(), type: "text", content: "**VS Code** is the industry standard. It highlights your errors, helps you autocomplete, and has thousands of plugins." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "The Browser Console" },
                    { id: uuid(), type: "text", content: "Your browser isn't just for viewing. It's for debugging. Right-click and hit 'Inspect'." },
                    { id: uuid(), type: "text", content: "This opens the **DevTools**. You can change the code of any website live (only on your screen)." },
                    { id: uuid(), type: "simulation", simulationId: "custom", config: { type: "visual" }, instructions: "Try inspecting this element (Simulation Placeholder)." },
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
                    { id: uuid(), type: "simulation", simulationId: "custom", config: { type: "visual" }, instructions: "Drag and drop tags to nest them (Placeholder)." },
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000", caption: "Screen Readers run on Semantics" },
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=1000", caption: "Before and After CSS" },
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1610433572201-110753c6cff9?auto=format&fit=crop&q=80&w=1000", caption: "The Box Model Diagram" },
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1000", caption: "Flexbox Axes" },
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000", caption: "Complex Grid Layouts" },
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000", caption: "Portfolio Inspiration" },
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
                    { id: uuid(), type: "simulation", simulationId: "custom", config: { type: "visual" }, instructions: "Click elements to change their text (Placeholder)." },
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=1000", caption: "Responsive Devices" },
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
            title: "1. Intuition vs Data",
            type: "lesson",
            position_index: 0,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 10, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Flawed Brain", animation: { type: "fade" } },
                    { id: uuid(), type: "text", content: "The human brain is an incredible pattern-recognition machine. It's also frequently wrong." },
                    { id: uuid(), type: "text", content: "We evolved to spot tigers in the grass, not to analyze stock market trends." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "The Data Cluster Illusion" },
                    { id: uuid(), type: "text", content: "Look at the simulation below. Your brain will try to find 'clumps' or 'groups'. But the data is completely random." },
                    { id: uuid(), type: "simulation", simulationId: "statistics", config: { mode: "chaos" }, instructions: "Generate random noise. Try to spot patterns that aren't there." },
                    { id: uuid(), type: "text", content: "This is why we need statistics. To tell the difference between a signal and noise." },
                    { id: uuid(), type: "ai-insight", prompt: "What is Apophenia?", showSummary: true },
                    { id: uuid(), type: "quiz", question: "Why do we need statistics?", options: ["To do math homework", "To validate patterns objectively", "To confuse people"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "2. Visualizing Data",
            type: "lesson",
            position_index: 1,
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
                    { id: uuid(), type: "simulation", simulationId: "custom", config: { type: "visual" }, instructions: "Change bin size on this histogram (Placeholder)." },
                    { id: uuid(), type: "quiz", question: "What does the height of a bar in a histogram represent?", options: ["The value", "The frequency count", "The time"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "3. Measures of Central Tendency",
            type: "lesson",
            position_index: 2,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 15, difficulty: "beginner" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The 'Average' Ambiguity" },
                    { id: uuid(), type: "text", content: "When someone says 'average', they usually mean the **Mean**. But that's not always the best measure." },
                    { id: uuid(), type: "divider", style: "line" },
                    { id: uuid(), type: "text", content: "1. **Mean**: Sum / Count. Sensitive to outliers.\n2. **Median**: The middle value. Robost to outliers.\n3. **Mode**: The most common value." },
                    { id: uuid(), type: "text", content: "Example: If Bill Gates walks into a bar, the 'mean' income skyrockets, but the 'median' income stays the same." },
                    { id: uuid(), type: "simulation", simulationId: "custom", config: { type: "visual" }, instructions: "Add an outlier and watch the Mean vs Median move (Placeholder)." },
                    { id: uuid(), type: "quiz", question: "Which measure is best for house prices?", options: ["Mean", "Median", "Mode"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "4. Variance & Standard Deviation",
            type: "lesson",
            position_index: 3,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 20, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Measuring Consistency" },
                    { id: uuid(), type: "text", content: "Two classes can have the same average score (75%), but one class has everyone at 75% (low variance), and the other has 100s and 50s (high variance)." },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "text", style: "heading", content: "Standard Deviation (SD)" },
                    { id: uuid(), type: "text", content: "This is the most common way to measure spread. In a normal distribution, most data is within 1 SD of the mean." },
                    { id: uuid(), type: "simulation", simulationId: "statistics", config: { mode: "trend" }, instructions: "Watch the spread calculation." },
                    { id: uuid(), type: "ai-insight", prompt: "Why do we square differences in Variance?", showSummary: true },
                    { id: uuid(), type: "quiz", question: "A low standard deviation means:", options: ["Data is spread out", "Data is clustered around the mean", "Data is incorrect"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "5. The Normal Distribution",
            type: "lesson",
            position_index: 4,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 20, difficulty: "intermediate" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "The Bell Curve" },
                    { id: uuid(), type: "text", content: "It appears everywhere in nature: Heights, blood pressure, errors in measurement, IQ scores." },
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1543286386-2d65930606d3?auto=format&fit=crop&q=80&w=1000", caption: "The Bell Curve" },
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
            title: "6. Z-Scores",
            type: "lesson",
            position_index: 5,
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
                    { id: uuid(), type: "simulation", simulationId: "custom", config: { type: "visual" }, instructions: "Calculate Z-Score interaction (Placeholder)." },
                    { id: uuid(), type: "quiz", question: "What is the Z-score of the Mean?", options: ["1", "0", "-1"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "7. Correlation vs Causation",
            type: "lesson",
            position_index: 6,
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
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1600109987391-b3b320d7718e?auto=format&fit=crop&q=80&w=1000", caption: "Cheese vs Bedsheets" },
                    { id: uuid(), type: "text", content: "This is purely coincidence (or a hidden third variable)." },
                    { id: uuid(), type: "quiz", question: "If A and B are correlated, what is true?", options: ["A causes B", "B causes A", "They move together"], correctIndex: 2, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "8. Probability Basics",
            type: "lesson",
            position_index: 7,
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
            title: "9. Law of Large Numbers",
            type: "lesson",
            position_index: 8,
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
            title: "10. Hypothesis Testing",
            type: "lesson",
            position_index: 9,
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
            title: "11. Regression Analysis",
            type: "lesson",
            position_index: 10,
            content_json: {
                version: "1.0",
                metadata: { estimatedMinutes: 25, difficulty: "advanced" },
                blocks: [
                    { id: uuid(), type: "text", style: "heading", content: "Predicting the Future" },
                    { id: uuid(), type: "text", content: "Regression finds the relationship between variables. The most simple is Linear Regression." },
                    { id: uuid(), type: "text", content: "`y = mx + b`" },
                    { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000", caption: "Linear Regression Line" },
                    { id: uuid(), type: "divider", style: "section-break" },
                    { id: uuid(), type: "simulation", simulationId: "statistics", config: { mode: "trend" }, instructions: "Visualize fitting a line to data." },
                    { id: uuid(), type: "text", content: "$R^2$ tells you how well the line fits the data. 1 is perfect, 0 is useless." },
                    { id: uuid(), type: "quiz", question: "What does the slope (m) represent?", options: ["The starting value", "The rate of change", "The error"], correctIndex: 1, unlocks: true }
                ]
            }
        },
        {
            course_id: statsCourse.id,
            title: "12. Final Project: Analyze This",
            type: "assignment",
            position_index: 11,
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

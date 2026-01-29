import { World } from "@/types/course-structure";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

// Helper to generate UUIDs if this runs in an environment with uuid, 
// otherwise we might need a simple generator or just static strings for the file.
// For a static file, we can use static strings or placeholders.
const uuid = () => crypto.randomUUID ? crypto.randomUUID() : "uuid-" + Math.random();

export const WEB_DEV_WORLD: World = {
    id: "world-1-web-dev",
    title: "Web Development Fundamentals",
    description: "Master the languages of the web: HTML, CSS, and JavaScript, through deep dives and interactive practice.",
    topics: [
        {
            id: "topic-1-architecture",
            title: "1. The Web's Architecture",
            subTopics: [
                {
                    id: "sub-1-global-conv",
                    title: "The Global Conversation",
                    blocks: [
                        { id: uuid(), type: "text", style: "heading", content: "The Global Conversation" },
                        {
                            id: uuid(),
                            type: "text",
                            content: "Every time you open a browser, you are starting a conversation. But who are you talking to? [[1]]",
                            citations: [
                                { id: "1", text: "MDN Web Docs: How the Web Works", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works" }
                            ]
                        },
                        { id: uuid(), type: "image", url: "https://images.unsplash.com/photo-1665470909928-a832ebc923d1", caption: "The Connected World" }
                    ]
                },
                {
                    id: "sub-2-request-cycle",
                    title: "The Request Cycle",
                    blocks: [
                        { id: uuid(), type: "text", style: "heading", content: "The Request Cycle" },
                        { id: uuid(), type: "text", content: "1. You type `google.com`.\n2. Your browser sends a **GET** request.\n3. The server finds the files.\n4. The server sends a **Response** (HTML, CSS, JS)." },
                        { id: uuid(), type: "simulation", simulationId: "network-visualizer", config: { mode: "network" }, instructions: "Visualize the data packet travel." }
                    ]
                }
            ]
        },
        {
            id: "topic-2-env-setup",
            title: "2. Setting Up Your Environment",
            subTopics: [
                {
                    id: "sub-1-vscode",
                    title: "Your Digital Workshop",
                    blocks: [
                        { id: uuid(), type: "text", style: "heading", content: "Your Digital Workshop" },
                        { id: uuid(), type: "text", content: "You can write code in Notepad, but you shouldn't. You need a dedicated Code Editor. [[2]]", citations: [{ id: "2", text: "VS Code Official Site", url: "https://code.visualstudio.com/" }] },
                        { id: uuid(), type: "image", url: "https://media.istockphoto.com/id/2114295998/photo/asian-and-indian-developer-devops-team-discussion-about-coding-promgram-with-software.webp", caption: "VS Code Interface" }
                    ]
                }
            ]
        },
        // ... Additional topics would follow similarly
        {
            id: "topic-3-html",
            title: "3. HTML: The Skeleton",
            subTopics: [
                {
                    id: "sub-1-tags",
                    title: "Anatomy of a Tag",
                    blocks: [
                        { id: uuid(), type: "text", style: "heading", content: "Anatomy of a Tag" },
                        { id: uuid(), type: "text", content: "HTML stands for HyperText Markup Language." },
                        { id: uuid(), type: "text", style: "code", content: "<p>This is a paragraph</p>" }
                    ]
                }
            ]
        }
    ]
};

export const DATA_STRUCTURE_COURSE: World[] = [
    WEB_DEV_WORLD
];

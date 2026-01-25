import { NextRequest, NextResponse } from "next/server";
import { getCourseWithNodes, updateCourseFromJSON } from "@/services/course.service";

// params type for dynamic route
type Props = {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const result = await getCourseWithNodes(id);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        if (!result.data) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const course = result.data;

        // Transform to convenient JSON format for editor
        const courseJSON = {
            title: course.title,
            description: course.description,
            nodes: course.nodes.map(n => ({
                id: n.id,
                title: n.title,
                type: n.type,
                content: n.content || n.content_json, // Fallback
            }))
        };

        return NextResponse.json(courseJSON);

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!body.title || !body.nodes) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const result = await updateCourseFromJSON(id, body);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, courseId: result.data });

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

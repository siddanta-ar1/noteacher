import { NextRequest, NextResponse } from "next/server";
import { createCourseFromJSON } from "@/services/course.service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.title || !body.nodes || !Array.isArray(body.nodes)) {
            return NextResponse.json(
                { error: "Invalid JSON structure. 'title' and 'nodes' array are required." },
                { status: 400 }
            );
        }

        const result = await createCourseFromJSON(body);

        if (result.error) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            courseId: result.data,
            message: "Course created successfully!"
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

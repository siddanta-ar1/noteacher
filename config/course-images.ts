export const COURSE_IMAGES: Record<string, string> = {
    // Statistics Course
    "dd3fabc5-786b-474f-a1dd-75cb0715a20b": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
};

export const DEFAULT_COURSE_IMAGE = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000";

export function getCourseImage(courseId: string): string {
    return COURSE_IMAGES[courseId] || DEFAULT_COURSE_IMAGE;
}

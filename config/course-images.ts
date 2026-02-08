export const COURSE_IMAGES: Record<string, string> = {
    // Statistics Course
    "dd3fabc5-786b-474f-a1dd-75cb0715a20b": "https://xjfooxkawqvbkcburvxm.supabase.co/storage/v1/object/public/animations/thumbnail-1.mp4",
};

export const DEFAULT_COURSE_IMAGE = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000";

export function getCourseImage(courseId: string): string {
    return COURSE_IMAGES[courseId] || DEFAULT_COURSE_IMAGE;
}

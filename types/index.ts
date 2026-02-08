// Central export for all types
export * from './database';

import { Course, Node } from './database';

export interface CourseWithNodes extends Course {
    nodes: Node[];
    levels?: { count: number }[];
}
export * from './content';

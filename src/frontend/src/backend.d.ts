import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type EnrollmentId = bigint;
export type Time = bigint;
export type LessonId = bigint;
export interface NewCourse {
    title: string;
    description: string;
    lessons: Array<NewLesson>;
    educatorName: string;
    category: string;
    price: bigint;
    durationWeeks: bigint;
}
export interface Enrollment {
    id: EnrollmentId;
    completedLessonIds: Array<LessonId>;
    student: Principal;
    enrollmentDate: Time;
    courseId: CourseId;
}
export interface Course {
    id: CourseId;
    title: string;
    description: string;
    lessons: Array<Lesson>;
    educatorName: string;
    category: Category;
    price: bigint;
    durationWeeks: bigint;
}
export interface NewLesson {
    title: string;
    content: string;
    order: bigint;
}
export interface Doubt {
    id: DoubtId;
    postedAt: Time;
    answer?: Answer;
    questionText: string;
    student: Principal;
    course: CourseId;
}
export interface Lesson {
    id: LessonId;
    title: string;
    content: string;
    order: bigint;
    courseId: CourseId;
}
export interface TestScore {
    marks: bigint;
    totalMarks: bigint;
    subject: string;
    takenAt: Time;
}
export type CourseId = bigint;
export interface Answer {
    answerText: string;
    answeredAt: Time;
    answeredBy: string;
}
export type DoubtId = bigint;
export interface UserProfile {
    name: string;
    role: string;
    email: string;
}
export type Category = {
    __kind__: "generalStudies";
    generalStudies: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "csat";
    csat: null;
} | {
    __kind__: "currentAffairs";
    currentAffairs: null;
} | {
    __kind__: "interviewPrep";
    interviewPrep: null;
} | {
    __kind__: "essayWriting";
    essayWriting: null;
} | {
    __kind__: "optionalSubject";
    optionalSubject: string;
};
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCourse(newCourse: NewCourse): Promise<Course>;
    enrollStudentInCourse(courseId: CourseId): Promise<Enrollment>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCourseById(courseId: CourseId): Promise<Course>;
    getCourseDoubtsList(courseId: CourseId): Promise<Array<Doubt>>;
    getStudentEnrollmentsList(principal: Principal): Promise<Array<Enrollment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTestScores(principal: Principal): Promise<Array<TestScore>>;
    isCallerAdmin(): Promise<boolean>;
    listCourses(): Promise<Array<Course>>;
    markLessonComplete(courseId: CourseId, lessonId: LessonId): Promise<void>;
    postDoubt(courseId: CourseId, questionText: string): Promise<Doubt>;
    postDoubtAnswer(doubtId: DoubtId, answerText: string, answeredBy: string): Promise<Doubt>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitTestScore(subject: string, marks: bigint, totalMarks: bigint): Promise<TestScore>;
}

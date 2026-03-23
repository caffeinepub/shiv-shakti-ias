import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SAMPLE_COURSES } from "@/data/sampleData";
import {
  useGetCallerProfile,
  useGetEnrollments,
  useGetUserTestScores,
} from "@/hooks/useQueries";
import { Award, BookOpen, Clock, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export default function StudentDashboard() {
  const { data: enrollments = [] } = useGetEnrollments();
  const { data: testScores = [] } = useGetUserTestScores();
  const { data: profile } = useGetCallerProfile();

  const enrolledCourses =
    enrollments.length > 0
      ? enrollments
          .map((e: any) => {
            const course = SAMPLE_COURSES.find(
              (c) => String(c.id) === String(e.courseId),
            );
            if (!course) return null;
            const total = course.lessons.length;
            const done = (e.completedLessonIds ?? []).length;
            return {
              ...course,
              progress: total > 0 ? Math.round((done / total) * 100) : 0,
            };
          })
          .filter(Boolean)
      : SAMPLE_COURSES.slice(0, 3).map((c) => ({
          ...c,
          progress: Math.floor(Math.random() * 80) + 10,
        }));

  const mockScores =
    testScores.length > 0
      ? testScores
      : [
          { subject: "GS1", marks: 118n, totalMarks: 200n },
          { subject: "GS2", marks: 105n, totalMarks: 200n },
          { subject: "GS3", marks: 122n, totalMarks: 200n },
          { subject: "GS4", marks: 98n, totalMarks: 150n },
          { subject: "Essay", marks: 130n, totalMarks: 250n },
        ];

  const stats = [
    {
      icon: BookOpen,
      label: "Enrolled Courses",
      value: enrolledCourses.length,
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Avg Progress",
      value: `${Math.round(enrolledCourses.reduce((a: number, c: any) => a + c.progress, 0) / Math.max(enrolledCourses.length, 1))}%`,
      color: "text-green-500",
    },
    {
      icon: Award,
      label: "Mock Tests",
      value: mockScores.length,
      color: "text-blue-500",
    },
    {
      icon: Clock,
      label: "Study Streak",
      value: "12 days",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10" data-ocid="dashboard.page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">
            Welcome back, {profile?.name ?? "Student"} 👋
          </h1>
          <p className="text-muted-foreground">
            Track your progress and continue your UPSC journey
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="shadow-card"
              data-ocid="dashboard.card"
            >
              <CardContent className="p-5">
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-navy">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-navy flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> My Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {enrolledCourses.map((course: any, i) => (
                <div
                  key={String(course.id)}
                  className="space-y-2"
                  data-ocid={`dashboard.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-navy text-sm">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.educatorName}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {course.progress}%
                    </Badge>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-navy flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Mock Test Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockScores.map((score: any, i) => {
                const pct = Math.round(
                  (Number(score.marks) / Number(score.totalMarks)) * 100,
                );
                return (
                  <div
                    key={score.subject}
                    className="space-y-1"
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-navy">
                        {score.subject}
                      </span>
                      <span className="text-muted-foreground">
                        {Number(score.marks)}/{Number(score.totalMarks)}
                      </span>
                    </div>
                    <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_COURSES } from "@/data/sampleData";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetCourse,
  useGetCourseDoubts,
  usePostDoubt,
} from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  Send,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function CourseDetail() {
  const { id } = useParams({ from: "/courses/$id" });
  const courseId = BigInt(id);
  const { data: backendCourse } = useGetCourse(courseId);
  const sampleCourse = SAMPLE_COURSES.find((c) => String(c.id) === id);
  const course: any = backendCourse ?? sampleCourse;

  const { data: doubts = [] } = useGetCourseDoubts(courseId);
  const postDoubt = usePostDoubt();
  const { identity } = useInternetIdentity();
  const [question, setQuestion] = useState("");
  const [expanded, setExpanded] = useState<number[]>([]);

  const toggleLesson = (idx: number) =>
    setExpanded((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );

  const handlePostDoubt = async () => {
    if (!question.trim()) return;
    if (!identity) {
      toast.error("Please log in to post a doubt.");
      return;
    }
    try {
      await postDoubt.mutateAsync({ courseId, questionText: question });
      setQuestion("");
      toast.success("Doubt posted!");
    } catch {
      toast.error("Failed to post doubt.");
    }
  };

  if (!course) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="course_detail.loading_state"
      >
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-10"
      data-ocid="course_detail.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {course.image && (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-56 object-cover rounded-xl mb-6"
              />
            )}
            <Badge className="bg-primary text-white border-0 mb-3">
              {typeof course.category === "string"
                ? course.category
                : (course.category?.__kind__ ?? "General")}
            </Badge>
            <h1 className="text-2xl font-bold text-navy mb-2">
              {course.title}
            </h1>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                {(course.rating ?? 4.7).toFixed(1)} rating
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Number(course.durationWeeks)} weeks
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.students?.toLocaleString() ?? "Hundreds"} students
              </span>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-navy">Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {(course.lessons ?? []).map((lesson: any, i: number) => (
                  <div
                    key={String(lesson.id ?? i)}
                    className="border-t first:border-t-0"
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-accent transition-colors"
                      onClick={() => toggleLesson(i)}
                      data-ocid={`course_detail.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-navy">
                          {lesson.title}
                        </span>
                      </div>
                      {expanded.includes(i) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expanded.includes(i) && (
                      <div className="px-6 pb-4 text-sm text-muted-foreground">
                        {lesson.content}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-navy flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Doubts & Q&A
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <Textarea
                    placeholder="Ask a doubt about this course..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="resize-none"
                    rows={3}
                    data-ocid="course_detail.textarea"
                  />
                  <Button
                    onClick={handlePostDoubt}
                    disabled={postDoubt.isPending || !question.trim()}
                    className="bg-primary hover:bg-primary/90 text-white self-end"
                    data-ocid="course_detail.submit_button"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {doubts.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground text-center py-4"
                    data-ocid="course_detail.empty_state"
                  >
                    No doubts yet. Be the first to ask!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {doubts.map((d: any, i: number) => (
                      <div
                        key={String(d.id)}
                        className="bg-secondary/50 rounded-lg p-4"
                        data-ocid={`course_detail.item.${i + 1}`}
                      >
                        <p className="text-sm font-medium text-navy">
                          {d.questionText}
                        </p>
                        {d.answer && (
                          <div className="mt-2 pl-3 border-l-2 border-primary">
                            <p className="text-xs text-muted-foreground">
                              {d.answer.answerText}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20 shadow-card">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-navy mb-4">
                  ₹{Number(course.price).toLocaleString()}
                </div>
                <Separator className="mb-4" />
                <Link
                  to="/payment"
                  search={{ courseId: String(course.id) } as any}
                >
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-full mb-3 font-semibold"
                    data-ocid="course_detail.primary_button"
                  >
                    Enroll Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-navy text-navy"
                  data-ocid="course_detail.secondary_button"
                >
                  Try Free Demo
                </Button>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> Lifetime
                    access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> Certificate
                    of completion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> Doubt
                    solving support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> Mobile &
                    desktop access
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

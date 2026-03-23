import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_COURSES } from "@/data/sampleData";
import { useCreateCourse, useListCourses } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { BookOpen, Plus, Trash2, Video } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "generalStudies",
  "csat",
  "currentAffairs",
  "essayWriting",
  "interviewPrep",
  "optionalSubject",
];

interface LessonForm {
  title: string;
  content: string;
}

export default function EducatorPanel() {
  const { data: backendCourses } = useListCourses();
  const courses: any[] =
    backendCourses && backendCourses.length > 0
      ? backendCourses
      : SAMPLE_COURSES;
  const createCourse = useCreateCourse();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("generalStudies");
  const [price, setPrice] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [educatorName, setEducatorName] = useState("");
  const [lessons, setLessons] = useState<LessonForm[]>([
    { title: "", content: "" },
  ]);

  const addLesson = () =>
    setLessons((prev) => [...prev, { title: "", content: "" }]);
  const removeLesson = (i: number) =>
    setLessons((prev) => prev.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, field: keyof LessonForm, value: string) =>
    setLessons((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourse.mutateAsync({
        title,
        description,
        category: category as any,
        price: BigInt(price || 0),
        durationWeeks: BigInt(durationWeeks || 0),
        educatorName,
        lessons: lessons.map((l, i) => ({
          title: l.title,
          content: l.content,
          order: BigInt(i + 1),
        })),
      });
      toast.success("Course created successfully!");
      setShowForm(false);
      setTitle("");
      setDescription("");
      setPrice("");
      setDurationWeeks("");
      setEducatorName("");
      setLessons([{ title: "", content: "" }]);
    } catch {
      toast.error("Failed to create course.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10" data-ocid="educator.page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy">Educator Panel</h1>
            <p className="text-muted-foreground">
              Manage and create your courses
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/educator/classroom">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 rounded-full"
                data-ocid="educator.link"
              >
                <Video className="w-4 h-4 mr-2" /> Conduct Live Class
              </Button>
            </Link>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 text-white rounded-full"
              data-ocid="educator.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-2" /> New Course
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8 shadow-card" data-ocid="educator.panel">
            <CardHeader>
              <CardTitle className="text-navy">Create New Course</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Course Title</Label>
                    <Input
                      placeholder="e.g. UPSC Prelims Complete Course"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      data-ocid="educator.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Educator Name</Label>
                    <Input
                      placeholder="Your name"
                      value={educatorName}
                      onChange={(e) => setEducatorName(e.target.value)}
                      required
                      data-ocid="educator.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Course description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                    data-ocid="educator.textarea"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger data-ocid="educator.select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="4999"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      data-ocid="educator.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Duration (weeks)</Label>
                    <Input
                      type="number"
                      placeholder="24"
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value)}
                      required
                      data-ocid="educator.input"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Lessons</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLesson}
                      data-ocid="educator.button"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Lesson
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {lessons.map((lesson, i) => (
                      <div
                        key={lesson.title || String(i)}
                        className="bg-secondary/50 rounded-lg p-4 space-y-3"
                        data-ocid={`educator.item.${i + 1}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Lesson {i + 1}
                          </span>
                          {lessons.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLesson(i)}
                              className="text-destructive hover:text-destructive/80"
                              data-ocid="educator.delete_button"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <Input
                          placeholder="Lesson title"
                          value={lesson.title}
                          onChange={(e) =>
                            updateLesson(i, "title", e.target.value)
                          }
                          required
                          data-ocid="educator.input"
                        />
                        <Textarea
                          placeholder="Lesson content"
                          value={lesson.content}
                          onChange={(e) =>
                            updateLesson(i, "content", e.target.value)
                          }
                          rows={2}
                          data-ocid="educator.textarea"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={createCourse.isPending}
                    className="bg-primary hover:bg-primary/90 text-white rounded-full"
                    data-ocid="educator.submit_button"
                  >
                    {createCourse.isPending ? "Creating..." : "Create Course"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="rounded-full"
                    data-ocid="educator.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4" data-ocid="educator.list">
          {courses.map((course: any, i) => (
            <Card
              key={String(course.id)}
              className="shadow-card"
              data-ocid={`educator.item.${i + 1}`}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.educatorName} · {Number(course.durationWeeks)}{" "}
                      weeks · ₹{Number(course.price).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  data-ocid="educator.delete_button"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

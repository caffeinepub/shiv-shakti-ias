import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useAddRecording } from "@/hooks/useQueries";
import { uploadBlob } from "@/hooks/useUploadBlob";
import {
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Monitor,
  MonitorOff,
  Radio,
  Send,
  Users,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MOCK_QUESTIONS = [
  {
    id: 1,
    student: "Arjun Sharma",
    question: "Sir, can you explain Article 356 and its misuse?",
    answered: false,
  },
  {
    id: 2,
    student: "Priya Verma",
    question:
      "What is the difference between Lok Sabha and Rajya Sabha in terms of powers?",
    answered: false,
  },
  {
    id: 3,
    student: "Rahul Singh",
    question: "How does the UPSC interview panel assess candidates?",
    answered: false,
  },
  {
    id: 4,
    student: "Meera Pillai",
    question:
      "What are the key differences between Fundamental Rights and DPSP?",
    answered: false,
  },
];

const UPCOMING_CLASSES = [
  {
    id: 1,
    title: "GS1 Polity \u2013 Constitutional Amendments",
    date: "24 Mar 2026",
    time: "10:00 AM",
    students: 142,
  },
  {
    id: 2,
    title: "Current Affairs \u2013 March Week 3",
    date: "25 Mar 2026",
    time: "6:00 PM",
    students: 98,
  },
  {
    id: 3,
    title: "GS2 \u2013 International Relations",
    date: "26 Mar 2026",
    time: "11:00 AM",
    students: 87,
  },
  {
    id: 4,
    title: "Essay Writing Workshop",
    date: "27 Mar 2026",
    time: "4:00 PM",
    students: 65,
  },
  {
    id: 5,
    title: "CSAT \u2013 Data Interpretation",
    date: "28 Mar 2026",
    time: "9:00 AM",
    students: 110,
  },
];

const COURSES = [
  "GS1 \u2013 History & Polity",
  "GS2 \u2013 Governance & IR",
  "GS3 \u2013 Economy & Environment",
  "GS4 \u2013 Ethics",
  "Current Affairs",
  "CSAT",
  "Essay Writing",
  "Optional \u2013 Sociology",
];

type Question = (typeof MOCK_QUESTIONS)[0] & {
  answer?: string;
  expanded?: boolean;
};

export default function EducatorClassroom() {
  const [isLive, setIsLive] = useState(false);
  const [classTitle, setClassTitle] = useState(
    "GS1 Polity \u2013 Article 356 & President's Rule",
  );
  const [notes, setNotes] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    title: "",
    course: "",
    date: "",
    time: "",
  });
  const [upcomingClasses, setUpcomingClasses] = useState(UPCOMING_CLASSES);

  // Screen share state
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const screenPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const addRecording = useAddRecording();

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!isSaving) setSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLive, isSaving]);

  // Mirror screen stream to preview video element
  useEffect(() => {
    if (screenPreviewRef.current && screenStream) {
      screenPreviewRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setScreenStream(stream);

      // Listen for user stopping via browser UI
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setScreenStream(null);
        setIsRecording(false);
        if (mediaRecorderRef.current?.state !== "inactive") {
          mediaRecorderRef.current?.stop();
        }
      });

      toast.success("Screen sharing started!");
    } catch {
      toast.error("Screen share cancelled or not supported.");
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      for (const track of screenStream.getTracks()) track.stop();
      setScreenStream(null);
    }
    setIsRecording(false);
  };

  const startRecorder = (stream: MediaStream) => {
    recordingChunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    try {
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordingChunksRef.current.push(e.data);
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      toast.error("Recording not supported in this browser.");
    }
  };

  const startSession = () => {
    setIsLive(true);
    if (screenStream) {
      startRecorder(screenStream);
    }
    toast.success("Class started! Students are now joining.");
  };

  const endSession = async () => {
    const sessionDurationSeconds = seconds;
    setIsLive(false);
    setIsSaving(true);
    setIsRecording(false);

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();

      // Wait for final chunk
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        setTimeout(resolve, 1500);
      });

      if (recordingChunksRef.current.length > 0) {
        try {
          const blob = new Blob(recordingChunksRef.current, {
            type: "video/webm",
          });
          toast.loading("Saving recording...", { id: "saving-rec" });
          const blobId = await uploadBlob(blob);
          await addRecording.mutateAsync({
            title: classTitle,
            date: BigInt(Date.now()),
            duration: BigInt(sessionDurationSeconds),
            blobId,
            courseTitle: classTitle,
          });
          toast.dismiss("saving-rec");
          toast.success("Session recorded and saved for students!");
        } catch {
          toast.dismiss("saving-rec");
          toast.error("Failed to save recording. Please try again.");
        }
      } else {
        toast.success("Class ended.");
      }
    } else {
      toast.success("Class ended.");
    }

    mediaRecorderRef.current = null;
    recordingChunksRef.current = [];
    setIsSaving(false);
    setSeconds(0);
    stopScreenShare();
  };

  const toggleSession = () => {
    if (isLive) {
      endSession();
    } else {
      startSession();
    }
  };

  const toggleAnswer = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, expanded: !q.expanded } : q)),
    );
  };

  const submitAnswer = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, answered: true, expanded: false } : q,
      ),
    );
    toast.success("Answer posted to students!");
  };

  const handleSchedule = () => {
    if (
      !newClass.title ||
      !newClass.course ||
      !newClass.date ||
      !newClass.time
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    setUpcomingClasses((prev) => [
      {
        id: prev.length + 1,
        title: `${newClass.course} \u2013 ${newClass.title}`,
        date: newClass.date,
        time: newClass.time,
        students: 0,
      },
      ...prev,
    ]);
    setNewClass({ title: "", course: "", date: "", time: "" });
    setScheduleOpen(false);
    toast.success("Class scheduled successfully!");
  };

  return (
    <div className="min-h-screen bg-muted/30" data-ocid="classroom.page">
      {/* Session Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy">
                  Educator Classroom
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isLive
                    ? `Session running \u00b7 ${formatTime(seconds)}`
                    : isSaving
                      ? "Saving recording..."
                      : "Ready to start your class"}
                </p>
              </div>
              <AnimatePresence>
                {isLive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Badge
                      className="bg-green-500 text-white flex items-center gap-1.5 px-3 py-1"
                      data-ocid="classroom.panel"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      LIVE
                    </Badge>
                    {isRecording && (
                      <Badge
                        className="bg-red-600 text-white flex items-center gap-1.5 px-3 py-1"
                        data-ocid="classroom.panel"
                      >
                        <Circle className="w-2 h-2 fill-white animate-pulse" />
                        REC
                      </Badge>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              {/* Screen Share Button */}
              {!screenStream ? (
                <Button
                  onClick={startScreenShare}
                  variant="outline"
                  className="border-navy text-navy hover:bg-navy hover:text-white rounded-full"
                  data-ocid="classroom.secondary_button"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Share Screen
                </Button>
              ) : (
                <Button
                  onClick={stopScreenShare}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full"
                  data-ocid="classroom.secondary_button"
                >
                  <MonitorOff className="w-4 h-4 mr-2" />
                  Stop Sharing
                </Button>
              )}
              <Button
                onClick={toggleSession}
                disabled={isSaving}
                className={
                  isLive
                    ? "bg-destructive hover:bg-destructive/90 text-white rounded-full"
                    : "bg-primary hover:bg-primary/90 text-white rounded-full"
                }
                data-ocid="classroom.primary_button"
              >
                <Radio className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : isLive ? "End Class" : "Start Class"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Screen Share Preview */}
            <AnimatePresence>
              {screenStream && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-card border-2 border-primary/40 overflow-hidden">
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-navy text-sm flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-primary" />
                        Screen Share Preview
                        <Badge className="ml-auto bg-primary/10 text-primary border-0 text-xs">
                          Sharing
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative bg-black aspect-video">
                        {/* biome-ignore lint/a11y/useMediaCaption: live screen share preview, no caption track available */}
                        <video
                          ref={screenPreviewRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-contain"
                        />
                        {isRecording && (
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600/90 text-white text-xs px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Recording
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Class Title */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-navy text-base flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  Current Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  disabled={isLive}
                  className="text-lg font-semibold border-border"
                  placeholder="Enter class title..."
                  data-ocid="classroom.input"
                />
                {isLive && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Title locked during live session
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Whiteboard / Notes */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-navy text-base">
                  Class Whiteboard / Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type lecture notes, key points, diagrams... Students see this in real time."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={10}
                  className="resize-none font-mono text-sm leading-relaxed"
                  data-ocid="classroom.textarea"
                />
                <div className="flex justify-end mt-2">
                  <span className="text-xs text-muted-foreground">
                    {notes.length} characters
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Live Q&A */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-navy text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Live Q&A
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {questions.filter((q) => !q.answered).length} pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3" data-ocid="classroom.list">
                {questions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-xl border p-4 ${
                      q.answered
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-border"
                    }`}
                    data-ocid={`classroom.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-primary">
                            {q.student}
                          </span>
                          {q.answered && (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-foreground">{q.question}</p>
                      </div>
                      {!q.answered && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 rounded-full text-primary border-primary hover:bg-primary/10"
                          onClick={() => toggleAnswer(q.id)}
                          data-ocid="classroom.secondary_button"
                        >
                          Answer
                        </Button>
                      )}
                    </div>

                    <AnimatePresence>
                      {q.expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-2">
                            <Textarea
                              placeholder="Type your answer here..."
                              value={q.answer || ""}
                              onChange={(e) =>
                                setQuestions((prev) =>
                                  prev.map((item) =>
                                    item.id === q.id
                                      ? { ...item, answer: e.target.value }
                                      : item,
                                  ),
                                )
                              }
                              rows={3}
                              className="text-sm"
                              data-ocid="classroom.textarea"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white rounded-full"
                                onClick={() => submitAnswer(q.id)}
                                data-ocid="classroom.submit_button"
                              >
                                <Send className="w-3.5 h-3.5 mr-1" />
                                Post Answer
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleAnswer(q.id)}
                                data-ocid="classroom.cancel_button"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Screen Share Tips */}
            {!screenStream && (
              <Card className="shadow-card border-dashed border-2 border-primary/30 bg-primary/5">
                <CardContent className="p-5">
                  <div className="flex gap-3 items-start">
                    <Monitor className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        Share Your Presentation
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click "Share Screen" to present your PowerPoint slides.
                        The session will be recorded automatically when you
                        start the class.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Classes */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-navy text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Upcoming Classes
                  </CardTitle>
                  <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white rounded-full text-xs"
                        data-ocid="classroom.open_modal_button"
                      >
                        + Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-ocid="classroom.dialog">
                      <DialogHeader>
                        <DialogTitle className="text-navy">
                          Schedule New Class
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                          <Label>Class Title</Label>
                          <Input
                            placeholder="e.g. Article 370 & Special Provisions"
                            value={newClass.title}
                            onChange={(e) =>
                              setNewClass((p) => ({
                                ...p,
                                title: e.target.value,
                              }))
                            }
                            data-ocid="classroom.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Select Course</Label>
                          <Select
                            value={newClass.course}
                            onValueChange={(v) =>
                              setNewClass((p) => ({ ...p, course: v }))
                            }
                          >
                            <SelectTrigger data-ocid="classroom.select">
                              <SelectValue placeholder="Choose course" />
                            </SelectTrigger>
                            <SelectContent>
                              {COURSES.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={newClass.date}
                              onChange={(e) =>
                                setNewClass((p) => ({
                                  ...p,
                                  date: e.target.value,
                                }))
                              }
                              data-ocid="classroom.input"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Time</Label>
                            <Input
                              type="time"
                              value={newClass.time}
                              onChange={(e) =>
                                setNewClass((p) => ({
                                  ...p,
                                  time: e.target.value,
                                }))
                              }
                              data-ocid="classroom.input"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setScheduleOpen(false)}
                          data-ocid="classroom.cancel_button"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSchedule}
                          className="bg-primary hover:bg-primary/90 text-white"
                          data-ocid="classroom.confirm_button"
                        >
                          Schedule Class
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3" data-ocid="classroom.list">
                {upcomingClasses.slice(0, 5).map((cls, i) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                    data-ocid={`classroom.item.${i + 1}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        {cls.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cls.date} \u00b7 {cls.time}
                      </p>
                      {cls.students > 0 && (
                        <p className="text-xs text-primary mt-0.5">
                          {cls.students} registered
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card bg-gradient-to-br from-navy to-navy/80 text-white">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-sm opacity-80">
                  Today's Session
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">
                      {isLive ? formatTime(seconds) : "--:--"}
                    </p>
                    <p className="text-xs opacity-70 mt-1">Duration</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">
                      {questions.filter((q) => q.answered).length}/
                      {questions.length}
                    </p>
                    <p className="text-xs opacity-70 mt-1">Q&A Resolved</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-sm font-semibold">
                    {screenStream ? (
                      <span className="text-green-300">✓ Screen Shared</span>
                    ) : (
                      <span className="opacity-60">No Screen Share</span>
                    )}
                  </p>
                  <p className="text-xs opacity-70 mt-1">Presentation</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

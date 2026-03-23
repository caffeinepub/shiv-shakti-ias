import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useListRecordings } from "@/hooks/useQueries";
import { getBlobUrl } from "@/hooks/useUploadBlob";
import { BookOpen, Calendar, Clock, PlayCircle, Video, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Recording } from "../backend.d";

function formatDuration(seconds: bigint): string {
  const s = Number(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp);
  // If it looks like nanoseconds (IC uses nanoseconds)
  const date = ms > 1e15 ? new Date(ms / 1_000_000) : new Date(ms);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function RecordingCard({
  recording,
  index,
}: { recording: Recording; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (expanded && !videoUrl) {
      getBlobUrl(recording.blobId)
        .then(setVideoUrl)
        .catch(() => setVideoUrl(""));
    }
  }, [expanded, videoUrl, recording.blobId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      data-ocid={`recordings.item.${index + 1}`}
    >
      <Card className="shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Thumbnail / Video */}
        <AnimatePresence>
          {expanded ? (
            <motion.div
              key="video"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="relative bg-black aspect-video">
                {videoUrl ? (
                  // biome-ignore lint/a11y/useMediaCaption: recorded lecture videos don't have caption tracks
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    data-ocid="recordings.panel"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  data-ocid="recordings.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="thumbnail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-video bg-gradient-to-br from-navy to-navy/80 flex items-center justify-center cursor-pointer group"
              onClick={() => setExpanded(true)}
              data-ocid="recordings.canvas_target"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <PlayCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute bottom-3 right-3">
                <Badge className="bg-black/50 text-white border-0 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(recording.duration)}
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-2">
          <CardTitle className="text-navy text-base leading-snug">
            {recording.title}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <Badge
              variant="outline"
              className="text-xs text-primary border-primary/40 flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              {recording.courseTitle}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(recording.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(recording.duration)}
              </span>
            </div>
            {!expanded && (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white rounded-full shrink-0"
                onClick={() => setExpanded(true)}
                data-ocid="recordings.primary_button"
              >
                <PlayCircle className="w-3.5 h-3.5 mr-1" />
                Watch
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Recordings() {
  const { data: recordings, isLoading } = useListRecordings();

  return (
    <div className="min-h-screen bg-muted/30" data-ocid="recordings.page">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-navy">
                  Class Recordings
                </h1>
                <p className="text-sm text-muted-foreground">
                  Watch past live sessions at your own pace
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="recordings.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 ml-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !recordings || recordings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="recordings.empty_state"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Video className="w-10 h-10 text-primary/50" />
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">
              No Recordings Yet
            </h2>
            <p className="text-muted-foreground max-w-sm">
              No recordings yet. Check back after your next class. Live sessions
              are automatically saved here for you to watch anytime.
            </p>
          </motion.div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {recordings.length} recording{recordings.length !== 1 ? "s" : ""}{" "}
              available
            </p>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="recordings.list"
            >
              {recordings.map((rec, i) => (
                <RecordingCard
                  key={rec.id.toString()}
                  recording={rec}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

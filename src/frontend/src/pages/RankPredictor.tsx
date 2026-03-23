import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitTestScore } from "@/hooks/useQueries";
import { Award, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SUBJECTS = [
  { key: "GS1", label: "GS Paper I", total: 200 },
  { key: "GS2", label: "GS Paper II", total: 200 },
  { key: "GS3", label: "GS Paper III", total: 200 },
  { key: "GS4", label: "GS Paper IV", total: 150 },
  { key: "Essay", label: "Essay", total: 250 },
  { key: "Interview", label: "Interview", total: 275 },
];

function predictRank(total: number): string {
  if (total >= 900) return "AIR 1–50";
  if (total >= 850) return "AIR 51–150";
  if (total >= 800) return "AIR 151–300";
  if (total >= 750) return "AIR 301–500";
  if (total >= 700) return "AIR 501–800";
  if (total >= 650) return "AIR 801–1200";
  return "Above AIR 1200";
}

export default function RankPredictor() {
  const [scores, setScores] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ total: number; rank: string } | null>(
    null,
  );
  const submitScore = useSubmitTestScore();

  const updateScore = (key: string, value: string) =>
    setScores((prev) => ({ ...prev, [key]: value }));

  const handlePredict = async () => {
    const total = SUBJECTS.reduce(
      (sum, s) => sum + (Number.parseInt(scores[s.key] || "0") || 0),
      0,
    );
    setResult({ total, rank: predictRank(total) });
    // Submit scores to backend
    try {
      await Promise.all(
        SUBJECTS.filter((s) => scores[s.key]).map((s) =>
          submitScore.mutateAsync({
            subject: s.key,
            marks: BigInt(Number.parseInt(scores[s.key] || "0")),
            totalMarks: BigInt(s.total),
          }),
        ),
      );
    } catch {
      // Non-blocking
    }
  };

  const maxTotal = SUBJECTS.reduce((s, sub) => s + sub.total, 0);

  return (
    <div
      className="container mx-auto px-4 py-10"
      data-ocid="rank_predictor.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-navy mb-2">
            UPSC Rank Predictor
          </h1>
          <p className="text-muted-foreground">
            Enter your mock test scores to predict your UPSC rank
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-navy">Enter Your Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-5">
                {SUBJECTS.map((s) => (
                  <div key={s.key} className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      {s.label}{" "}
                      <span className="text-muted-foreground font-normal">
                        (Max: {s.total})
                      </span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max={s.total}
                      placeholder={`0–${s.total}`}
                      value={scores[s.key] ?? ""}
                      onChange={(e) => updateScore(s.key, e.target.value)}
                      data-ocid="rank_predictor.input"
                    />
                  </div>
                ))}
              </div>
              <Button
                className="mt-6 w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold"
                onClick={handlePredict}
                data-ocid="rank_predictor.submit_button"
              >
                <TrendingUp className="w-4 h-4 mr-2" /> Predict My Rank
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card
                className="shadow-card border-2 border-primary"
                data-ocid="rank_predictor.success_state"
              >
                <CardContent className="p-8 text-center">
                  <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                  <div className="text-5xl font-extrabold text-navy mb-2">
                    {result.rank}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Predicted Rank Range Based on Mock Score
                  </p>
                  <div className="text-2xl font-bold text-primary mb-6">
                    Total: {result.total} / {maxTotal}
                  </div>
                  {/* Bar chart */}
                  <div className="space-y-2 text-left mt-6">
                    {SUBJECTS.map((s) => {
                      const val = Number.parseInt(scores[s.key] || "0") || 0;
                      const pct = Math.round((val / s.total) * 100);
                      return (
                        <div key={s.key} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-navy">{s.label}</span>
                            <span className="text-muted-foreground">
                              {val}/{s.total} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

import CourseCard from "@/components/CourseCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SAMPLE_COURSES, SAMPLE_TESTIMONIALS } from "@/data/sampleData";
import { useListCourses } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Expert Faculty",
    desc: "Learn from IAS officers and subject matter experts with proven track records",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Material",
    desc: "3000+ hours of video content, PDFs, and topic-wise notes",
  },
  {
    icon: FileText,
    title: "Mock Tests",
    desc: "10,000+ practice questions and full-length mock exams with analytics",
  },
  {
    icon: Users,
    title: "Personal Mentoring",
    desc: "One-on-one mentoring sessions with toppers and educators",
  },
];

export default function Home() {
  const { data: backendCourses } = useListCourses();
  const courses = (
    backendCourses && backendCourses.length > 0
      ? backendCourses
      : SAMPLE_COURSES
  ).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden" data-ocid="home.section">
        <div className="grid md:grid-cols-2 min-h-[520px]">
          {/* Left: content */}
          <div
            className="relative flex flex-col justify-center px-8 md:px-16 py-16"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.058 245) 0%, oklch(0.28 0.07 245) 100%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
                <CheckCircle className="w-3.5 h-3.5" /> India's #1 IAS
                Preparation Platform
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                Crack UPSC with{" "}
                <span className="text-primary">Shiv Shakti IAS</span>
              </h1>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Join 50,000+ aspirants who trust us for expert guidance,
                comprehensive study material, and AI-powered rank prediction.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/courses">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 font-semibold"
                    data-ocid="home.primary_button"
                  >
                    Explore Courses <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/rank-predictor">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 border-white text-white hover:bg-white hover:text-navy font-semibold"
                    data-ocid="home.secondary_button"
                  >
                    Try Rank Predictor
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-xs text-white/70">Students</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1200+</div>
                  <div className="text-xs text-white/70">Selections</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-xs text-white/70">Success Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Right: image */}
          <div className="relative hidden md:block">
            <img
              src="/assets/generated/hero-students.dim_800x600.jpg"
              alt="Students studying for UPSC"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/20" />
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section
        className="py-16 container mx-auto px-4"
        data-ocid="home.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy mb-2">
              Popular Courses
            </h2>
            <p className="text-muted-foreground">
              Handpicked by toppers and trusted by thousands of aspirants
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any, i) => (
              <motion.div
                key={String(course.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <CourseCard
                  id={course.id}
                  title={course.title}
                  educatorName={course.educatorName}
                  category={
                    typeof course.category === "string"
                      ? course.category
                      : (course.category?.__kind__ ?? "General")
                  }
                  price={course.price}
                  durationWeeks={course.durationWeeks}
                  rating={course.rating ?? 4.7}
                  students={course.students}
                  image={course.image}
                  index={i}
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/courses">
              <Button
                variant="outline"
                className="rounded-full px-8 border-navy text-navy hover:bg-navy hover:text-white"
                data-ocid="home.secondary_button"
              >
                View All Courses <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-secondary/50" data-ocid="home.section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-navy mb-2">
                Why Shiv Shakti IAS?
              </h2>
              <p className="text-muted-foreground">
                Everything you need to crack UPSC in one platform
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center p-6 border-0 shadow-card hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-navy mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-16 container mx-auto px-4"
        data-ocid="home.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy mb-2">
              Student Testimonials
            </h2>
            <p className="text-muted-foreground">
              Hear from our successful IAS, IPS, and IFS officers
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SAMPLE_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className="p-6 shadow-card hover:shadow-md transition-shadow border-l-4 border-l-primary"
                  data-ocid={`testimonials.item.${i + 1}`}
                >
                  <CardContent className="p-0">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-navy text-white font-bold">
                          {t.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-navy text-sm">
                          {t.name}
                        </p>
                        <p className="text-xs text-primary font-medium">
                          {t.rank} · {t.year}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-navy" data-ocid="home.section">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Your UPSC Journey Today
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Join thousands of aspirants who have already started their
              preparation with Shiv Shakti IAS.
            </p>
            <Link to="/courses">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 font-semibold"
                data-ocid="home.primary_button"
              >
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

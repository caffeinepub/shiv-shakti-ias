import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SAMPLE_COURSES } from "@/data/sampleData";
import { useListCourses } from "@/hooks/useQueries";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All",
  "General Studies",
  "CSAT",
  "Current Affairs",
  "Essay Writing",
  "Interview Prep",
  "Optional Subject",
];

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { data: backendCourses } = useListCourses();
  const allCourses =
    backendCourses && backendCourses.length > 0
      ? backendCourses
      : SAMPLE_COURSES;

  const filtered = useMemo(() => {
    return allCourses.filter((c: any) => {
      const cat =
        typeof c.category === "string"
          ? c.category
          : (c.category?.__kind__ ?? "");
      const matchesCat =
        category === "All" ||
        cat.toLowerCase().includes(category.toLowerCase());
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.educatorName.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [allCourses, search, category]);

  return (
    <div className="container mx-auto px-4 py-10" data-ocid="courses.page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-navy mb-2">All Courses</h1>
        <p className="text-muted-foreground mb-8">
          Choose from our expert-designed UPSC preparation courses
        </p>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses or educators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="courses.search_input"
            />
          </div>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="mb-8">
          <TabsList className="flex-wrap h-auto gap-1 bg-secondary/50 p-1">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="text-xs"
                data-ocid="courses.tab"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="courses.empty_state"
          >
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No courses found. Try a different search or category.</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="courses.list"
          >
            {filtered.map((course: any, i) => (
              <motion.div
                key={String(course.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
        )}
      </motion.div>
    </div>
  );
}

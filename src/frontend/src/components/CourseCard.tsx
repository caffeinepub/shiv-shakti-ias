import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Clock, Star, Users } from "lucide-react";

interface CourseCardProps {
  id: bigint | number;
  title: string;
  educatorName?: string;
  category: string;
  price: bigint | number;
  durationWeeks: bigint | number;
  rating: number;
  students?: number;
  image?: string;
  index?: number;
}

export default function CourseCard({
  id,
  title,
  category,
  price,
  durationWeeks,
  rating,
  students,
  image,
  index = 0,
}: CourseCardProps) {
  return (
    <Card
      className="rounded-xl overflow-hidden shadow-card hover:shadow-md transition-shadow group"
      data-ocid={`courses.item.${index + 1}`}
    >
      <div className="relative h-44 bg-accent overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-navy/20 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary text-white border-0 text-xs">
          {category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-navy text-base leading-snug mb-1 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {Number(durationWeeks)} weeks
          </span>
          {students !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {students.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-navy text-lg">
            ₹{Number(price).toLocaleString()}
          </span>
          <Link to="/courses/$id" params={{ id: String(id) }}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-full text-xs px-4"
              data-ocid={`courses.item.${index + 1}`}
            >
              Enroll Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, DollarSign, Briefcase, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    salary: string;
    type: "Full-time" | "Part-time" | "Contract" | "Remote";
    skills: string[];
    description: string;
    postedAt: string;
    featured?: boolean;
  };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  className?: string;
}

export const JobCard = ({ job, onApply, onSave, className }: JobCardProps) => {
  const handleApply = () => {
    onApply?.(job.id);
  };

  const handleSave = () => {
    onSave?.(job.id);
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-card border-border/40",
      job.featured && "border-primary/30 shadow-primary",
      className
    )}>
      {/* Featured Job Indicator */}
      {job.featured && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-primary">
          <div className="absolute -top-8 -right-2 text-xs text-primary-foreground font-bold transform rotate-45">
            HOT
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Avatar className="h-12 w-12 border border-border/40">
              <AvatarImage src={job.companyLogo} alt={job.company} />
              <AvatarFallback className="bg-gradient-card text-foreground">
                {job.company.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium">{job.company}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{job.postedAt}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="h-8 w-8 opacity-60 hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Job Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="font-semibold text-success">{job.salary}</span>
          </div>
          <Badge variant={
            job.type === "Remote" ? "default" :
            job.type === "Full-time" ? "secondary" :
            "outline"
          } className="text-xs">
            <Briefcase className="h-3 w-3 mr-1" />
            {job.type}
          </Badge>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="text-xs px-2 py-1 bg-gradient-card border-primary/20 hover:border-primary/40 transition-colors"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex space-x-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="web3"
            size="sm"
            className="flex-1"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
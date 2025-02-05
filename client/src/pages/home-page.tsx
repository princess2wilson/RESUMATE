import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { SiTarget } from "react-icons/si";
import { BookOpen, FileText, Users } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Expert CV Reviews & Career Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get professional feedback on your CV, access premium templates, and book career consultations with industry experts.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href={user ? "/dashboard" : "/auth"}>Get Started</Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* CV Review Card */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>CV Review Service</CardTitle>
                <CardDescription>
                  Get detailed feedback from industry experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1484981138541-3d074aa97716"
                  alt="CV Review"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• Detailed analysis of your CV</li>
                  <li>• Professional recommendations</li>
                  <li>• Quick turnaround time</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href={user ? "/dashboard" : "/auth"}>Submit Your CV</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Digital Products Card */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Digital Resources</CardTitle>
                <CardDescription>
                  Professional templates and guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931"
                  alt="Digital Resources"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• CV Templates</li>
                  <li>• Cover Letter Guides</li>
                  <li>• Career Resources</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href={user ? "/dashboard" : "/auth"}>View Resources</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Consultation Card */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Free Consultation</CardTitle>
                <CardDescription>
                  Book a session with our experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
                  alt="Consultation"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• 30-minute free session</li>
                  <li>• Career guidance</li>
                  <li>• Personalized advice</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href={user ? "/dashboard" : "/auth"}>Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

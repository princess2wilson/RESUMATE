import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Video,
  FileSpreadsheet,
  ArrowRight,
  GraduationCap,
  BrainCircuit,
} from "lucide-react";
import type { Product } from "@shared/schema";

const resourceIcons = {
  cv_template: FileText,
  interview_guide: Video,
  career_guide: BookOpen,
  salary_calculator: FileSpreadsheet,
  skills_assessment: BrainCircuit,
  learning_path: GraduationCap,
};

type ResourceType = keyof typeof resourceIcons;

export default function ResourceLibraryPage() {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const IconComponent = selectedProduct
    ? resourceIcons[selectedProduct.type as ResourceType]
    : FileText;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <span className="font-serif text-xl font-bold text-primary cursor-pointer">
                RESUMATE
              </span>
            </Link>
            <div className="space-x-4">
              {user ? (
                <Button variant="outline" asChild>
                  <Link href="/dashboard">DASHBOARD</Link>
                </Button>
              ) : (
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <Link href="/auth">SIGN IN</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Digital Resource Library</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access premium templates, guides, and tools to accelerate your career growth
          </p>
        </div>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => {
            const Icon = resourceIcons[product.type as ResourceType] || FileText;
            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-6">
                    <Button
                      className="w-full"
                      onClick={() => setSelectedProduct(product)}
                    >
                      VIEW DETAILS
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Product Details Dialog */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-serif">
                {selectedProduct?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedProduct?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Product Features */}
              <div>
                <h4 className="font-semibold mb-3">What's Included:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Industry-specific templates and examples
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Step-by-step implementation guide
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Lifetime access to updates
                  </li>
                </ul>
              </div>

              {/* Price and CTA */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    ${(selectedProduct?.price || 0) / 100}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    One-time purchase
                  </div>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    if (!user) {
                      window.location.href = '/auth';
                    }
                    // Add purchase logic here when user is logged in
                  }}
                >
                  {user ? 'BUY NOW' : 'LOGIN TO PURCHASE'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
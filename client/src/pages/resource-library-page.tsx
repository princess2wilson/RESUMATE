import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Engine } from "@tsparticles/engine";
import {
  SiMastercard,
  SiVisa,
  SiAmericanexpress,
  SiPaypal,
} from "react-icons/si";
import {
  FileText,
  BookOpen,
  Video,
  FileSpreadsheet,
  ArrowRight,
  GraduationCap,
  BrainCircuit,
  CreditCard,
  Sparkles,
} from "lucide-react";
import type { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const resourceIcons = {
  cv_template: FileText,
  interview_guide: Video,
  career_guide: BookOpen,
  salary_calculator: FileSpreadsheet,
  skills_assessment: BrainCircuit,
  learning_path: GraduationCap,
};

type ResourceType = keyof typeof resourceIcons;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    }
  },
};

export default function ResourceLibraryPage() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const initParticles = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const handlePurchase = async (product: Product) => {
    try {
      const response = await apiRequest("POST", "/api/create-checkout-session", {
        productId: product.id,
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateDiscountedPrice = (price: number) => {
    return Math.floor(price * 0.5); // 50% off
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={initParticles}
        options={{
          particles: {
            color: { value: "#6b7280" },
            opacity: { value: 0.1 },
            size: { value: 1 },
            move: {
              direction: "none",
              enable: true,
              speed: 0.5,
            },
            links: {
              enable: true,
              opacity: 0.05,
            },
          },
          background: { color: { value: "transparent" } },
        }}
      />

      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <span className="font-serif text-xl font-bold text-primary cursor-pointer">
                RESUMATE
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl font-serif font-bold">Digital Resource Library</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access premium templates, guides, and tools to accelerate your career growth
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products?.map((product) => {
            const Icon = resourceIcons[product.type as ResourceType] || FileText;
            const originalPrice = product.price;
            const discountedPrice = calculateDiscountedPrice(originalPrice);

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-6">
                    <Button
                      className="w-full group"
                      onClick={() => setSelectedProduct({...product, price: discountedPrice})}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        VIEW DETAILS
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                {selectedProduct && (
                  <FileText className="w-6 h-6 text-primary" />
                )}
              </div>
              <DialogTitle className="text-2xl font-serif">
                {selectedProduct?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedProduct?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
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

              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="text-3xl font-bold">${(selectedProduct?.price || 0) / 100}</div>
                    <div className="text-xl text-muted-foreground line-through">
                      ${((selectedProduct?.price || 0) * 2) / 100}
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Sparkles className="w-4 h-4 mr-1" />
                      50% OFF
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Limited time offer
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    <SiVisa className="w-8 h-8 text-gray-400" />
                    <SiMastercard className="w-8 h-8 text-gray-400" />
                    <SiAmericanexpress className="w-8 h-8 text-gray-400" />
                    <SiPaypal className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 group"
                  onClick={() => selectedProduct && handlePurchase(selectedProduct)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    BUY NOW
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

// Add formatPrice utility function
const formatPrice = (amount: number) => {
  try {
    return new Intl.NumberFormat(navigator.language || 'en-US', {
      style: 'currency',
      currency: 'USD', // Base currency is USD
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    return `$${(amount / 100).toFixed(2)}`;
  }
};

export default function ResourceLibraryPage() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });


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
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="h-full"
              >
                <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Sparkles className="w-4 h-4 mr-1" />
                      50% OFF
                    </Badge>
                  </div>
                  <CardHeader className="flex-none pb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-serif">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <ul className="space-y-3 text-sm text-muted-foreground mb-6 flex-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        Industry-specific templates
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        Step-by-step guides
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        Lifetime updates
                      </li>
                    </ul>
                    <div className="mt-auto">
                      <div className="mb-4">
                        <span className="text-2xl font-bold">{formatPrice(discountedPrice)}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {formatPrice(originalPrice)}
                        </span>
                      </div>
                      <Button
                        className="w-full group"
                        onClick={() => setSelectedProduct({ ...product, price: discountedPrice })}
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          VIEW DETAILS
                        </span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </CardContent>
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
                  <div className="text-3xl font-bold mb-1">
                    {selectedProduct && formatPrice(selectedProduct.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Limited time offer
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <SiVisa className="w-8 h-8 text-gray-400" />
                  <SiMastercard className="w-8 h-8 text-gray-400" />
                  <SiAmericanexpress className="w-8 h-8 text-gray-400" />
                  <SiPaypal className="w-8 h-8 text-gray-400" />
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
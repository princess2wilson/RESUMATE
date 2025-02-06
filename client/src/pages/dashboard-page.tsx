import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CVReview, Product, Consultation } from "@shared/schema";
import { Upload, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { formatPrice } from "@/lib/currency";

export default function DashboardPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const { data: reviews } = useQuery<CVReview[]>({
    queryKey: ["/api/cv-reviews"],
  });

  const { data: consultations } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cv-review", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cv-reviews"] });
      setFile(null);
    },
  });

  const consultationMutation = useMutation({
    mutationFn: async (data: { date: string; time: string }) => {
      const res = await apiRequest("POST", "/api/consultations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
    },
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <Tabs defaultValue="reviews">
          <TabsList className="mb-8">
            <TabsTrigger value="reviews">CV Reviews</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="products">Digital Products</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Submit New CV</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (file) uploadMutation.mutateAsync(file);
                    }}
                    className="flex gap-4"
                  >
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      accept=".pdf,.doc,.docx"
                    />
                    <Button
                      type="submit"
                      disabled={!file || uploadMutation.isPending}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews?.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            {format(new Date(review.createdAt), "PP")}
                          </TableCell>
                          <TableCell>{review.status}</TableCell>
                          <TableCell>{review.feedback || "Pending"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="consultations">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Book Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      consultationMutation.mutateAsync({
                        date: formData.get("date") as string,
                        time: formData.get("time") as string,
                      });
                    }}
                    className="flex gap-4"
                  >
                    <Input type="date" name="date" required />
                    <Input type="time" name="time" required />
                    <Button type="submit" disabled={consultationMutation.isPending}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Book
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consultations?.map((consultation) => (
                        <TableRow key={consultation.id}>
                          <TableCell>{consultation.date}</TableCell>
                          <TableCell>{consultation.time}</TableCell>
                          <TableCell>{consultation.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid md:grid-cols-3 gap-8">
              {products?.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {formatPrice(product.price)}
                      </span>
                      <Button>
                        Buy Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
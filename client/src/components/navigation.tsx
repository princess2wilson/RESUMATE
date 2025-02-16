import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Shield } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navigation() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const menuItems = [
    { href: "/", label: "HOME" },
    { href: "/resources", label: "DIGITAL LIBRARY" },
    { href: "/cv-submission", label: "CV REVIEW" },
    { href: "/consultations", label: "CONSULTATIONS" },
  ];

  const renderMenuItems = () => (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      {menuItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className="justify-start lg:justify-center hover:bg-primary/5 transition-colors duration-200"
          asChild
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
      {user ? (
        <>
          <Button 
            variant="outline" 
            className="hover:border-primary/30 transition-colors duration-200"
            asChild
          >
            <Link href="/dashboard">DASHBOARD</Link>
          </Button>
          {user.isAdmin && (
            <Button 
              variant="outline"
              className="hover:border-primary/30 transition-colors duration-200"
              asChild
            >
              <Link href="/admin">ADMIN PANEL</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            size="sm"
            className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            LOGOUT
          </Button>
        </>
      ) : (
        <>
          <Button 
            className="bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md"
            asChild
          >
            <Link href="/cv-submission">SUBMIT YOUR CV</Link>
          </Button>
        </>
      )}
    </div>
  );

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <span className="font-serif text-xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity duration-200">
              RESUMATE
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {renderMenuItems()}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/5 transition-colors duration-200">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-serif">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                {renderMenuItems()}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
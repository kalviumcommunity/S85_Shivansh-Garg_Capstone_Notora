import React from "react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  BookOpen,
  Users,
  Download,
  Upload,
  Sparkles,
  TrendingUp,
  Calendar,
  Bell,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Upload,
    title: "Upload Notes",
    description: "Share your lecture notes with the community and help others learn.",
  },
  {
    icon: Download,
    title: "Download Resources",
    description: "Access thousands of high-quality notes from top students.",
  },
  {
    icon: Users,
    title: "Peer Chat",
    description: "Connect with classmates and discuss complex topics in real-time.",
  },
  {
    icon: Sparkles,
    title: "Premium Content",
    description: "Get access to exclusive notes and advanced study materials.",
  },
];

const announcements = [
  {
    title: "New Java Advanced Concepts Notes Available",
    date: "2024-01-15",
    type: "New Content",
    description: "Comprehensive notes on multithreading, collections, and design patterns.",
  },
  {
    title: "Premium Section Launch",
    date: "2024-01-10",
    type: "Feature",
    description: "Access exclusive content from industry experts and top universities.",
  },
  {
    title: "Mobile App Coming Soon",
    date: "2024-01-05",
    type: "Update",
    description: "Study on the go with our upcoming mobile application.",
  },
];

const stats = [
  { label: "Active Users", value: "12,000+", icon: Users },
  { label: "Notes Shared", value: "45,000+", icon: BookOpen },
  { label: "Downloads", value: "180,000+", icon: Download },
  { label: "Success Rate", value: "95%", icon: TrendingUp },
];

export default function HomePage() {
  return (
    <div className="space-y-16 px-6 md:px-12 lg:px-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <Badge className="px-4 py-2 text-sm font-medium" style={{ backgroundColor: "#9AC9DE33", color: "#1F1F1F" }}
>
            <Sparkles className="w-4 h-4 mr-2" />
            Simplified Learning Experience
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="gradient-text">Notora</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your ultimate platform for organizing, sharing, and accessing lecture notes. Master Java, C++, Web
            Development, and more with our community-driven approach.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/notes">
            <Button size="lg" className="glow-effect text-white" style={{ backgroundColor: "#9AC9DE" }}>
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Notes
            </Button>
          </Link>
          <Link to="/premium">
            <Button
              size="lg"
              variant="outline"
              className="hover-lift border"
              style={{
                color: "#1F8ECD",
                borderColor: "#1F8ECD",
                backgroundColor: "transparent",
              }}
            >
              <Crown className="w-5 h-5 mr-2" />
              Go Premium
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center hover-lift glass-effect" style={{ borderColor: "#D3D3D3" }}>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#9AC9DE33" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "#9AC9DE" }} />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Why Choose Notora?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make learning and sharing knowledge effortless
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover-lift transition-all duration-300 group" style={{ borderColor: "#D3D3D3" }}>
                <CardHeader className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: "linear-gradient(to bottom right, #9AC9DE, #1F8ECD99)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Announcements Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Recent Announcements</h2>
            <p className="text-muted-foreground">Stay updated with the latest news and features</p>
          </div>
          <Bell className="w-6 h-6" style={{ color: "#1F8ECD" }} />
        </div>

        <div className="grid gap-6">
          {announcements.map((announcement, index) => (
            <Card key={index} className="hover-lift" style={{ borderColor: "#D3D3D3" }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="text-white" style={{ backgroundColor: "#9AC9DE33", color: "#1F1F1F" }}>
                        {announcement.type}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(announcement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                    <CardDescription className="text-base">
                      {announcement.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="text-center space-y-8 py-12 rounded-2xl"
        style={{ background: "linear-gradient(to right, #9AC9DE1a, #1F8ECD0d, transparent)" }}
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of students who are already using Notora to excel in their studies
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/notes">
            <Button size="lg" className="text-white" style={{ backgroundColor: "#9AC9DE" }}>
              Browse Notes
            </Button>
          </Link>
          <Link to="/upload">
            <Button
              size="lg"
              variant="outline"
              className="border"
              style={{
                color: "#1F8ECD",
                borderColor: "#1F8ECD",
                backgroundColor: "transparent",
              }}
            >
              Upload Your Notes
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

// import React from "react";
// import { Button } from "../components/ui/Button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/Card";
// import { Badge } from "../components/ui/Badge";
// import {
//   BookOpen,
//   Users,
//   Download,
//   Upload,
//   Sparkles,
//   TrendingUp,
//   Calendar,
//   Bell,
//   Crown,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const features = [
//   {
//     icon: Upload,
//     title: "Upload Notes",
//     description: "Share your lecture notes with the community and help others learn.",
//   },
//   {
//     icon: Download,
//     title: "Download Resources",
//     description: "Access thousands of high-quality notes from top students.",
//   },
//   {
//     icon: Users,
//     title: "Peer Chat",
//     description: "Connect with classmates and discuss complex topics in real-time.",
//   },
//   {
//     icon: Sparkles,
//     title: "Premium Content",
//     description: "Get access to exclusive notes and advanced study materials.",
//   },
// ];

// const announcements = [
//   {
//     title: "New Java Advanced Concepts Notes Available",
//     date: "2024-01-15",
//     type: "New Content",
//     description: "Comprehensive notes on multithreading, collections, and design patterns.",
//   },
//   {
//     title: "Premium Section Launch",
//     date: "2024-01-10",
//     type: "Feature",
//     description: "Access exclusive content from industry experts and top universities.",
//   },
//   {
//     title: "Mobile App Coming Soon",
//     date: "2024-01-05",
//     type: "Update",
//     description: "Study on the go with our upcoming mobile application.",
//   },
// ];

// const stats = [
//   { label: "Active Users", value: "12,000+", icon: Users },
//   { label: "Notes Shared", value: "45,000+", icon: BookOpen },
//   { label: "Downloads", value: "180,000+", icon: Download },
//   { label: "Success Rate", value: "95%", icon: TrendingUp },
// ];

// export default function HomePage() {
//   return (
//     <div className="space-y-16 px-6 md:px-12 lg:px-24">
//       {/* Hero Section */}
//       <section className="text-center space-y-8 py-12">
//         <div className="space-y-4">
//           <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
//             <Sparkles className="w-4 h-4 mr-2" />
//             Simplified Learning Experience
//           </Badge>
//           <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
//             Welcome to <span className="gradient-text">Notora</span>
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//             Your ultimate platform for organizing, sharing, and accessing lecture notes. Master Java, C++, Web
//             Development, and more with our community-driven approach.
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           <Link to="/notes">
//             <Button size="lg" className="bg-primary hover:bg-primary/90 glow-effect">
//               <BookOpen className="w-5 h-5 mr-2" />
//               Explore Notes
//             </Button>
//           </Link>
//           <Link to="/premium">
//             <Button size="lg" variant="outline" className="hover-lift">
//               <Crown className="w-5 h-5 mr-2" />
//               Go Premium
//             </Button>
//           </Link>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <Card key={index} className="text-center hover-lift glass-effect">
//               <CardContent className="pt-6">
//                 <div className="flex justify-center mb-2">
//                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//                     <Icon className="w-6 h-6 text-primary" />
//                   </div>
//                 </div>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//                 <div className="text-sm text-muted-foreground">{stat.label}</div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </section>

//       {/* Features Section */}
//       <section className="space-y-8">
//         <div className="text-center space-y-4">
//           <h2 className="text-3xl font-bold">Why Choose Notora?</h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             Discover the features that make learning and sharing knowledge effortless
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {features.map((feature, index) => {
//             const Icon = feature.icon;
//             return (
//               <Card key={index} className="hover-lift transition-all duration-300 group">
//                 <CardHeader className="text-center">
//                   <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                     <Icon className="w-6 h-6 text-white" />
//                   </div>
//                   <CardTitle className="text-lg">{feature.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <CardDescription className="text-center">{feature.description}</CardDescription>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </section>

//       {/* Announcements Section */}
//       <section className="space-y-8">
//         <div className="flex items-center justify-between">
//           <div className="space-y-2">
//             <h2 className="text-3xl font-bold">Recent Announcements</h2>
//             <p className="text-muted-foreground">Stay updated with the latest news and features</p>
//           </div>
//           <Bell className="w-6 h-6 text-primary" />
//         </div>

//         <div className="grid gap-6">
//           {announcements.map((announcement, index) => (
//             <Card key={index} className="hover-lift">
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <Badge variant="secondary">{announcement.type}</Badge>
//                       <div className="flex items-center text-sm text-muted-foreground">
//                         <Calendar className="w-4 h-4 mr-1" />
//                         {new Date(announcement.date).toLocaleDateString()}
//                       </div>
//                     </div>
//                     <CardTitle className="text-xl">{announcement.title}</CardTitle>
//                     <CardDescription className="text-base">
//                       {announcement.description}
//                     </CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="text-center space-y-8 py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl">
//         <div className="space-y-4">
//           <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
//           <p className="text-muted-foreground max-w-xl mx-auto">
//             Join thousands of students who are already using Notora to excel in their studies
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Link to="/notes">
//             <Button size="lg" className="bg-primary hover:bg-primary/90">
//               Browse Notes
//             </Button>
//           </Link>
//           <Link to="/upload">
//             <Button size="lg" variant="outline">
//               Upload Your Notes
//             </Button>
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }

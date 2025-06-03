import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import {
    Search,
    Download,
    Calendar,
    User,
    Filter,
    Upload,
    Star,
    Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

const subjects = ["All", "C++", "Java", "Web Development", "Miscellaneous"];

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [sortBy, setSortBy] = useState("date");

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/notes`)
            .then((res) => setNotes(res.data))
            .catch((err) => console.error("Error fetching notes:", err));
    }, []);

    const filteredNotes = notes
        .filter(
            (note) =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedSubject === "All" ||
                    note.subject.toLowerCase() === selectedSubject.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "downloads":
                    return (b.downloads || 0) - (a.downloads || 0);
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                case "date":
                default:
                    return (
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
            }
        });

    return (
        <div className="space-y-8 px-6 md:px-12 lg:px-24 pt-8 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-black gradient-text">
                        Lecture Notes
                    </h1>
                    <p className="text-[#64748b]">
                        Discover and download high-quality study materials
                    </p>
                </div>
                <Link to="/upload">
                    <Button className="bg-[#9AC9DE] text-white hover:bg-[#8abbd3]">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Notes
                    </Button>
                </Link>
            </div>



            {/* Search and Filters Container */}
            <Card className="glass-effect border border-[#e2e8f0] bg-white shadow-sm">
                <CardContent className="pt-6 rounded-md">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b] w-4 h-4" />
                            <Input
                                placeholder="Search notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white border border-[#e2e8f0] text-[#64748b] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#85cbe5] focus:border-[#85cbe5] transition"
                            />
                        </div>

                        {/* Subject Filter */}
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-full md:w-48 bg-white border border-[#e2e8f0] text-[#64748b] focus:ring-2 focus:ring-[#85cbe5] focus:border-[#85cbe5] transition">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#e2e8f0] shadow-md">
                                {subjects.map((subject) => (
                                    <SelectItem
                                        key={subject}
                                        value={subject}
                                        className="hover:bg-[#f1f5f9] hover:text-black transition-colors cursor-pointer"
                                    >
                                        {subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort Dropdown */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-48 bg-white border border-[#e2e8f0] text-[#64748b] focus:ring-2 focus:ring-[#85cbe5] focus:border-[#85cbe5] transition">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#e2e8f0] shadow-md">
                                <SelectItem
                                    value="date"
                                    className="hover:bg-[#f1f5f9] hover:text-black transition-colors cursor-pointer"
                                >
                                    Latest
                                </SelectItem>
                                <SelectItem
                                    value="downloads"
                                    className="hover:bg-[#f1f5f9] hover:text-black transition-colors cursor-pointer"
                                >
                                    Most Downloaded
                                </SelectItem>
                                <SelectItem
                                    value="rating"
                                    className="hover:bg-[#f1f5f9] hover:text-black transition-colors cursor-pointer"
                                >
                                    Highest Rated
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>


            {/* Notes Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNotes.map((note) => (
                    <Card
                        key={note._id}
                        className="group relative overflow-hidden text-left hover-lift glass-effect"
                        style={{ borderColor: "#e2e8f0" }}
                    >
                        <CardHeader className="pb-3">
                            <div className="space-y-2">
                                <Badge className="bg-[#4473a2] text-white dark:bg-[#e2e2e2] dark:text-black w-fit mx-auto">
                                    {note.subject.charAt(0).toUpperCase() + note.subject.slice(1)}
                                </Badge>
                                <CardTitle className="text-xl leading-tight group-hover:text-[#1F8ECD] transition-colors text-[#000000] font-semibold">
                                    {note.title}
                                </CardTitle>
                                <CardDescription className="text-sm text-[#64748b]">
                                    {note.description}
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 text-[#64748b]">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-1" /> {note.uploadedBy?.name || "Unknown"}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center text-[#64748b]">
                                        <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
                                    </div>
                                    <div className="flex items-center text-[#64748b]">
                                        <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{note.rating || "N/A"}</span>
                                </div>
                            </div>

                            <a
                                href={note.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button
                                    className="w-full border border-[#9AC9DE] text-[#9AC9DE] group-hover:bg-[#9AC9DE] group-hover:text-white transition-colors"
                                    variant={note.isPremium ? "default" : "outline"}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {note.isPremium ? "Get Premium Access" : "Download"}
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {filteredNotes.length === 0 && (
                <div className="text-center py-12 text-[#64748b]">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-[#64748b]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-black">No notes found</h3>
                    <p>
                        Try adjusting your search criteria or browse all notes
                    </p>
                </div>
            )}

        </div>
    );
}


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/Select";
// import {
//   Search,
//   Download,
//   Calendar,
//   User,
//   Filter,
//   Upload,
//   Star,
//   Eye,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const subjects = ["All", "C++", "Java", "Web Development", "Miscellaneous"];

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All");
//   const [sortBy, setSortBy] = useState("date");

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/api/notes`)
//       .then((res) => setNotes(res.data))
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, []);

//   const filteredNotes = notes
//     .filter(
//       (note) =>
//         note.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (selectedSubject === "All" ||
//           note.subject.toLowerCase() === selectedSubject.toLowerCase())
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "downloads":
//           return (b.downloads || 0) - (a.downloads || 0);
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "date":
//         default:
//           return (
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );
//       }
//     });

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold gradient-text">Lecture Notes</h1>
//           <p className="text-muted-foreground">
//             Discover and download high-quality study materials
//           </p>
//         </div>
//         <Link to="/upload">
//           <Button className="bg-[#9AC9DE] text-white hover:bg-[#8abbd3]">
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Notes
//           </Button>
//         </Link>
//       </div>

//       <Card className="glass-effect">
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search notes..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//               <SelectTrigger className="w-full md:w-48">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map((subject) => (
//                   <SelectItem key={subject} value={subject}>
//                     {subject}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Latest</SelectItem>
//                 <SelectItem value="downloads">Most Downloaded</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {filteredNotes.map((note) => (
//           <Card
//             key={note._id}
//             className="group relative overflow-hidden text-left hover-lift glass-effect"
//             style={{ borderColor: "#e2e8f0" }}
//           >
//             <CardHeader className="pb-3">
//               <div className="space-y-2">
//                 <Badge className="bg-[#4473a2] text-[#ffffff] dark:bg-[#e2e2e2] dark:text-[#000000] w-fit mx-auto">
//                   {note.subject.charAt(0).toUpperCase() + note.subject.slice(1)}
//                 </Badge>
//                 <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
//                   {note.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">
//                   {note.description}
//                 </CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" /> {note.uploadedBy?.name || "Unknown"}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(note.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center text-muted-foreground">
//                     <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
//                   </div>
//                   <div className="flex items-center text-muted-foreground">
//                     <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
//                   <span className="font-medium">{note.rating || "N/A"}</span>
//                 </div>
//               </div>

//               <a
//                 href={note.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block"
//               >
//                 <Button
//                   className="w-full"
//                   variant={note.isPremium ? "default" : "outline"}
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   {note.isPremium ? "Get Premium Access" : "Download"}
//                 </Button>
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </section>

//       {filteredNotes.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//           <p className="text-muted-foreground">
//             Try adjusting your search criteria or browse all notes
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/Select";
// import {
//   Search,
//   Download,
//   Calendar,
//   User,
//   Filter,
//   Upload,
//   Star,
//   Eye,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const subjects = ["All", "C++", "Java", "Web Development", "Miscellaneous"];

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All");
//   const [sortBy, setSortBy] = useState("date");

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/api/notes`)
//       .then((res) => setNotes(res.data))
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, []);

//   const filteredNotes = notes
//     .filter((note) => {
//       const matchesSearch = note.title
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       const matchesSubject =
//         selectedSubject === "All" ||
//         note.subject.toLowerCase() === selectedSubject.toLowerCase();
//       return matchesSearch && matchesSubject;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "downloads":
//           return (b.downloads || 0) - (a.downloads || 0);
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "date":
//         default:
//           return (
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );
//       }
//     });

//   return (
//     <div className="space-y-8 animate-fade-in">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold gradient-text">Lecture Notes</h1>
//           <p className="text-muted-foreground">
//             Discover and download high-quality study materials
//           </p>
//         </div>
//         <Link to="/upload">
//           <Button className="bg-primary hover:bg-primary/90">
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Notes
//           </Button>
//         </Link>
//       </div>

//       <Card className="glass-effect">
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search notes..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//               <SelectTrigger className="w-full md:w-48">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map((subject) => (
//                   <SelectItem key={subject} value={subject}>
//                     {subject}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Latest</SelectItem>
//                 <SelectItem value="downloads">Most Downloaded</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredNotes.map((note) => (
//           <Card
//             key={note._id}
//             className="group relative overflow-hidden hover-lift glow-effect"
//           >
//             {note.isPremium && (
//               <div className="absolute top-4 right-4 z-10">
//                 <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
//                   <Star className="w-3 h-3 mr-1" /> Premium
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="pb-3">
//               <div className="space-y-2">
//                 <Badge className="bg-[#4473a2] text-white dark:bg-[#e2e2e2] dark:text-black">
//                   {note.subject.charAt(0).toUpperCase() + note.subject.slice(1)}
//                 </Badge>
//                 <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
//                   {note.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">
//                   {note.description}
//                 </CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" />
//                   {note.uploadedBy?.name || "Unknown"}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(note.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center text-muted-foreground">
//                     <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
//                   </div>
//                   <div className="flex items-center text-muted-foreground">
//                     <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
//                   <span className="font-medium">{note.rating || "N/A"}</span>
//                 </div>
//               </div>

//               <a
//                 href={note.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block"
//               >
//                 <Button
//                   className="w-full"
//                   variant={note.isPremium ? "default" : "outline"}
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   {note.isPremium ? "Get Premium Access" : "Download"}
//                 </Button>
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredNotes.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//           <p className="text-muted-foreground">
//             Try adjusting your search criteria or browse all notes
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/Select";
// import {
//   Search,
//   Download,
//   Calendar,
//   User,
//   Filter,
//   Upload,
//   Star,
//   Eye,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const subjects = ["All", "Java", "C++", "Web Development", "Miscellaneous"];

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All");
//   const [sortBy, setSortBy] = useState("date");

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/api/notes`)
//       .then((res) => setNotes(res.data))
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, []);

//   const filteredNotes = notes
//     .filter((note) => {
//       const subject = (note.subject || "").toLowerCase();
//       const selected = selectedSubject.toLowerCase();
//       return (
//         note.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (selected === "all" || subject === selected)
//       );
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "downloads":
//           return (b.downloads || 0) - (a.downloads || 0);
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "date":
//         default:
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//     });

//   const formatSubject = (subject = "") => {
//     const formatted = subject.charAt(0).toUpperCase() + subject.slice(1);
//     return formatted === "Miscleenaous" ? "Miscellaneous" : formatted;
//   };

//   return (
//     <div className="space-y-8 animate-fade-in">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold gradient-text">Lecture Notes</h1>
//           <p className="text-muted-foreground">
//             Discover and download high-quality study materials
//           </p>
//         </div>
//         <Link to="/upload">
//           <Button className="bg-primary hover:bg-primary/90">
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Notes
//           </Button>
//         </Link>
//       </div>

//       <Card className="glass-effect">
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search notes..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//               <SelectTrigger className="w-full md:w-48">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map((subject) => (
//                   <SelectItem key={subject} value={subject}>
//                     {subject}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Latest</SelectItem>
//                 <SelectItem value="downloads">Most Downloaded</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredNotes.map((note) => (
//           <Card key={note._id} className="group relative overflow-hidden hover-lift glass-effect">
//             {note.isPremium && (
//               <div className="absolute top-4 right-4 z-10">
//                 <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
//                   <Star className="w-3 h-3 mr-1" /> Premium
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="pb-3">
//               <div className="space-y-2">
//                 <Badge className="bg-[#4473a2] text-white dark:bg-[#e2e2e2] dark:text-black">
//                   {formatSubject(note.subject)}
//                 </Badge>
//                 <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
//                   {note.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">{note.description}</CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" /> {note.uploadedBy?.name || "Unknown"}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(note.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center text-muted-foreground">
//                     <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
//                   </div>
//                   <div className="flex items-center text-muted-foreground">
//                     <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
//                   <span className="font-medium">{note.rating || "N/A"}</span>
//                 </div>
//               </div>

//               <a
//                 href={note.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block"
//               >
//                 <Button
//                   className="w-full glow-effect"
//                   variant={note.isPremium ? "default" : "outline"}
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   {note.isPremium ? "Get Premium Access" : "Download"}
//                 </Button>
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredNotes.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//           <p className="text-muted-foreground">
//             Try adjusting your search criteria or browse all notes
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
// import { Search, Download, Calendar, User, Filter, Upload, Star, Eye } from "lucide-react";
// import { Link } from "react-router-dom";

// const subjects = ["All", "C++", "Java", "Web Development", "Miscellaneous"];

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All");
//   const [sortBy, setSortBy] = useState("date");

//   useEffect(() => {
//     axios.get(`${import.meta.env.VITE_API_URL}/api/notes`)
//       .then((res) => setNotes(res.data))
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, []);

//   const filteredNotes = notes
//     .filter((note) => {
//       const subjectMatch = selectedSubject === "All" ||
//         (note.subject && note.subject.toLowerCase() === selectedSubject.toLowerCase());
//       return (
//         note.title.toLowerCase().includes(searchTerm.toLowerCase()) && subjectMatch
//       );
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "downloads":
//           return (b.downloads || 0) - (a.downloads || 0);
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "date":
//         default:
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//     });

//   const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Lecture Notes</h1>
//           <p className="text-muted-foreground">Discover and download high-quality study materials</p>
//         </div>
//         <Link to="/upload">
//           <Button className="bg-[#9AC9DE] hover:bg-[#89b7cc] text-white">
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Notes
//           </Button>
//         </Link>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search notes..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//               <SelectTrigger className="w-full md:w-48">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map((subject) => (
//                   <SelectItem key={subject} value={subject}>{subject}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Latest</SelectItem>
//                 <SelectItem value="downloads">Most Downloaded</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredNotes.map((note) => (
//           <Card key={note._id} className="group relative overflow-hidden">
//             {note.isPremium && (
//               <div className="absolute top-4 right-4 z-10">
//                 <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
//                   <Star className="w-3 h-3 mr-1" /> Premium
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="pb-3">
//               <div className="space-y-2">
//                 <Badge className="bg-[#4473a2] text-white dark:bg-[#e2e2e2] dark:text-black">
//                   {capitalize(note.subject || "")}
//                 </Badge>
//                 <CardTitle className="text-lg leading-tight group-hover:text-[#1F8ECD] transition-colors">
//                   {note.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">{note.description}</CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" /> {note.uploadedBy?.name || 'Unknown'}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(note.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center text-muted-foreground">
//                     <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
//                   </div>
//                   <div className="flex items-center text-muted-foreground">
//                     <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
//                   <span className="font-medium">{note.rating || "N/A"}</span>
//                 </div>
//               </div>

//               <a
//                 href={note.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block"
//               >
//                 <Button className="w-full" variant={note.isPremium ? "default" : "outline"}>
//                   <Download className="w-4 h-4 mr-2" />
//                   {note.isPremium ? "Get Premium Access" : "Download"}
//                 </Button>
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredNotes.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//           <p className="text-muted-foreground">Try adjusting your search criteria or browse all notes</p>
//         </div>
//       )}
//     </div>
//   );
// }





//                                                             Download, Filter, Search everything working now the css
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
// import { Search, Download, Calendar, User, Filter, Upload, Star, Eye } from "lucide-react";
// import { Link } from "react-router-dom";

// const subjects = ["All", "C++", "Java", "Web Development", "Miscellaneous"];

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All");
//   const [sortBy, setSortBy] = useState("date");

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/api/notes`)
//       .then((res) => setNotes(res.data))
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, []);

//   const filteredNotes = notes
//     .filter((note) => {
//       const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesSubject = selectedSubject === "All" || note.subject.toLowerCase() === selectedSubject.toLowerCase();
//       return matchesSearch && matchesSubject;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "downloads":
//           return (b.downloads || 0) - (a.downloads || 0);
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "date":
//         default:
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//     });

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Lecture Notes</h1>
//           <p className="text-muted-foreground">Discover and download high-quality study materials</p>
//         </div>
//         <Link to="/upload">
//           <Button style={{ backgroundColor: "#9AC9DE", color: "#ffffff" }}>
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Notes
//           </Button>
//         </Link>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search notes..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//               <SelectTrigger className="w-full md:w-48">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map((subject) => (
//                   <SelectItem key={subject} value={subject}>{subject}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Latest</SelectItem>
//                 <SelectItem value="downloads">Most Downloaded</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredNotes.map((note) => (
//           <Card key={note._id} className="group relative overflow-hidden">
//             {note.isPremium && (
//               <div className="absolute top-4 right-4 z-10">
//                 <Badge style={{ backgroundColor: "#1F8ECD", color: "#ffffff" }}>
//                   <Star className="w-3 h-3 mr-1" /> Premium
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="pb-3">
//               <div className="space-y-2">
//                 <Badge variant="secondary" className="w-fit">{note.subject}</Badge>
//                 <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
//                   {note.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">{note.description}</CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" /> {note.uploadedBy?.name || 'Unknown'}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(note.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center text-muted-foreground">
//                     <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
//                   </div>
//                   <div className="flex items-center text-muted-foreground">
//                     <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
//                   <span className="font-medium">{note.rating || "N/A"}</span>
//                 </div>
//               </div>

//               <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
//                 <Button className="w-full" variant={note.isPremium ? "default" : "outline"}>
//                   <Download className="w-4 h-4 mr-2" />
//                   {note.isPremium ? "Get Premium Access" : "Download"}
//                 </Button>
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredNotes.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//           <p className="text-muted-foreground">Try adjusting your search criteria or browse all notes</p>
//         </div>
//       )}
//     </div>
//   );
// }











// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
// import { Search, Download, Calendar, User, Filter, Upload, Star, Eye } from "lucide-react";
// import { Link } from "react-router-dom";

// const subjects = ["All", "C++", "Java", "Web Development", "Miscellaneous"];

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All");
//   const [sortBy, setSortBy] = useState("date");

//   useEffect(() => {
//     axios.get(`${import.meta.env.VITE_API_URL}/api/notes`)
//       .then((res) => setNotes(res.data))
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, []);

//   const filteredNotes = notes
//     .filter(
//       (note) =>
//         note.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (selectedSubject === "All" || note.subject === selectedSubject)
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "downloads":
//           return (b.downloads || 0) - (a.downloads || 0);
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "date":
//         default:
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//     });

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Lecture Notes</h1>
//           <p className="text-muted-foreground">Discover and download high-quality study materials</p>
//         </div>
//         <Link to="/upload">
//           <Button style={{ backgroundColor: "#9AC9DE", color: "#ffffff" }}>
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Notes
//           </Button>
//         </Link>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search notes..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//               <SelectTrigger className="w-full md:w-48">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map((subject) => (
//                   <SelectItem key={subject} value={subject}>{subject}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Latest</SelectItem>
//                 <SelectItem value="downloads">Most Downloaded</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredNotes.map((note) => (
//           <Card key={note._id} className="group relative overflow-hidden">
//             {note.isPremium && (
//               <div className="absolute top-4 right-4 z-10">
//                 <Badge style={{ backgroundColor: "#1F8ECD", color: "#ffffff" }}>
//                   <Star className="w-3 h-3 mr-1" /> Premium
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="pb-3">
//               <div className="space-y-2">
//                 <Badge variant="secondary" className="w-fit">{note.subject}</Badge>
//                 <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
//                   {note.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">{note.description}</CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" /> {note.uploadedBy?.name || 'Unknown'}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(note.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center text-muted-foreground">
//                     <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
//                   </div>
//                   <div className="flex items-center text-muted-foreground">
//                     <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
//                   <span className="font-medium">{note.rating || "N/A"}</span>
//                 </div>
//               </div>

//               <a
//                 href={note.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block"
//               >
//                 <Button
//                   className="w-full"
//                   variant={note.isPremium ? "default" : "outline"}
//                   style={note.isPremium ? { backgroundColor: "#9AC9DE", color: "#ffffff" } : {}}
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   {note.isPremium ? "Get Premium Access" : "Download"}
//                 </Button>
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredNotes.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//           <p className="text-muted-foreground">Try adjusting your search criteria or browse all notes</p>
//         </div>
//       )}
//     </div>
//   );
// }










// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
// import { Search, Download, Calendar, User, Filter, Upload, Star, Eye } from "lucide-react";
// import { Link } from "react-router-dom";

// const subjects = ["All", "Java", "C++", "Web Development"];

// const PRIMARY_COLOR = "#9AC9DE";
// const PRIMARY_FOREGROUND = "#ffffff";
// const SECONDARY_COLOR = "#1F8ECD";
// const SECONDARY_FOREGROUND = "#ffffff";

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All");
//   const [sortBy, setSortBy] = useState("date");

//   useEffect(() => {
//     axios.get(`${import.meta.env.VITE_API_URL}/api/notes`)
//       .then((res) => setNotes(res.data))
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, []);

//   const filteredNotes = notes
//     .filter(
//       (note) =>
//         note.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (selectedSubject === "All" || note.subject === selectedSubject)
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "downloads":
//           return (b.downloads || 0) - (a.downloads || 0);
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "date":
//         default:
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//     });

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Lecture Notes</h1>
//           <p className="text-muted-foreground">Discover and download high-quality study materials</p>
//         </div>
//         <Link to="/upload">
//           <Button style={{ backgroundColor: PRIMARY_COLOR, color: PRIMARY_FOREGROUND }}>
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Notes
//           </Button>
//         </Link>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search notes..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//               <SelectTrigger className="w-full md:w-48">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map((subject) => (
//                   <SelectItem key={subject} value={subject}>{subject}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Latest</SelectItem>
//                 <SelectItem value="downloads">Most Downloaded</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredNotes.map((note) => (
//           <Card key={note._id} className="group relative overflow-hidden">
//             {note.isPremium && (
//               <div className="absolute top-4 right-4 z-10">
//                 <Badge style={{ backgroundColor: SECONDARY_COLOR, color: SECONDARY_FOREGROUND }}>
//                   <Star className="w-3 h-3 mr-1" /> Premium
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="pb-3">
//               <div className="space-y-2">
//                 <Badge variant="secondary" className="w-fit" style={{ backgroundColor: SECONDARY_COLOR, color: SECONDARY_FOREGROUND }}>
//                   {note.subject}
//                 </Badge>
//                 <CardTitle className="text-lg leading-tight group-hover:text-[${PRIMARY_COLOR}] transition-colors">
//                   {note.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">{note.description}</CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" /> {note.uploadedBy?.name || 'Unknown'}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(note.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-4 text-muted-foreground">
//                   <div className="flex items-center">
//                     <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
//                   </div>
//                   <div className="flex items-center">
//                     <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
//                   <span className="font-medium">{note.rating || "N/A"}</span>
//                 </div>
//               </div>

//               <a
//                 href={note.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block"
//               >
//                 <Button
//                   className="w-full"
//                   variant={note.isPremium ? "default" : "outline"}
//                   style={note.isPremium ? { backgroundColor: PRIMARY_COLOR, color: PRIMARY_FOREGROUND } : {}}
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   {note.isPremium ? "Get Premium Access" : "Download"}
//                 </Button>
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredNotes.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//           <p className="text-muted-foreground">Try adjusting your search criteria or browse all notes</p>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
// import { Search, Download, Calendar, User, Filter, Upload, Star, Eye } from "lucide-react";
// import { Link } from "react-router-dom";

// const subjects = ["All", "Java", "C++", "Web Development"];

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All");
//   const [sortBy, setSortBy] = useState("date");

//   useEffect(() => {
//     axios.get(`${import.meta.env.VITE_API_URL}/api/notes`)
//       .then((res) => setNotes(res.data))
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, []);

//   const filteredNotes = notes
//     .filter(
//       (note) =>
//         note.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (selectedSubject === "All" || note.subject === selectedSubject)
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "downloads":
//           return (b.downloads || 0) - (a.downloads || 0);
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0);
//         case "date":
//         default:
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//     });

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Lecture Notes</h1>
//           <p className="text-muted-foreground">Discover and download high-quality study materials</p>
//         </div>
//         <Link to="/upload">
//           <Button className="bg-primary hover:bg-primary/90">
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Notes
//           </Button>
//         </Link>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search notes..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//               <SelectTrigger className="w-full md:w-48">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map((subject) => (
//                   <SelectItem key={subject} value={subject}>{subject}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Latest</SelectItem>
//                 <SelectItem value="downloads">Most Downloaded</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredNotes.map((note) => (
//           <Card key={note._id} className="group relative overflow-hidden">
//             {note.isPremium && (
//               <div className="absolute top-4 right-4 z-10">
//                 <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
//                   <Star className="w-3 h-3 mr-1" /> Premium
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="pb-3">
//               <div className="space-y-2">
//                 <Badge variant="secondary" className="w-fit">{note.subject}</Badge>
//                 <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
//                   {note.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">{note.description}</CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" /> {note.uploadedBy?.name || 'Unknown'}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(note.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center text-muted-foreground">
//                     <Download className="w-4 h-4 mr-1" /> {note.downloads || 0}
//                   </div>
//                   <div className="flex items-center text-muted-foreground">
//                     <Eye className="w-4 h-4 mr-1" /> {note.views || 0}
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
//                   <span className="font-medium">{note.rating || "N/A"}</span>
//                 </div>
//               </div>

//               <a
//                 href={note.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block"
//               >
//                 <Button className="w-full" variant={note.isPremium ? "default" : "outline"}>
//                   <Download className="w-4 h-4 mr-2" />
//                   {note.isPremium ? "Get Premium Access" : "Download"}
//                 </Button>
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredNotes.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//           <p className="text-muted-foreground">Try adjusting your search criteria or browse all notes</p>
//         </div>
//       )}
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Input } from "../components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "../components/ui/select";

// const NotesPage = () => {
//   const [notes, setNotes] = useState([]);
//   const [filteredNotes, setFilteredNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterSubject, setFilterSubject] = useState("");

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const fetchNotes = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`);
//       setNotes(res.data);
//       setFilteredNotes(res.data);
//     } catch (err) {
//       console.error("Failed to fetch notes:", err);
//     }
//   };

//   useEffect(() => {
//     let filtered = notes;

//     if (searchTerm) {
//       filtered = filtered.filter((note) =>
//         note.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterSubject) {
//       filtered = filtered.filter(
//         (note) => note.subject.toLowerCase() === filterSubject.toLowerCase()
//       );
//     }

//     setFilteredNotes(filtered);
//   }, [searchTerm, filterSubject, notes]);

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex flex-col md:flex-row items-center gap-4">
//         <Input
//           placeholder="Search notes by title"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <Select onValueChange={(val) => setFilterSubject(val)}>
//           <SelectTrigger className="w-full md:w-60">
//             <SelectValue placeholder="Filter by subject" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="">All</SelectItem>
//             <SelectItem value="c++">C++</SelectItem>
//             <SelectItem value="java">Java</SelectItem>
//             <SelectItem value="web development">Web Development</SelectItem>
//             <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredNotes.map((note) => (
//           <div
//             key={note._id}
//             className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition"
//           >
//             <h2 className="text-lg font-semibold mb-1">{note.title}</h2>
//             <p className="text-sm text-gray-600 mb-2">{note.subject}</p>
//             <p className="text-sm">{note.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NotesPage;




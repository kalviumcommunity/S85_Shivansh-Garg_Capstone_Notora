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
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
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
                                className="pl-10 bg-white border-[#5375a2] text-black placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#85cbe5] focus:border-[#85cbe5] transition"
                            />
                        </div>

                        {/* Subject Filter */}
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-full md:w-48 bg-white border border-[#e2e8f0] text-[#64748b] focus:ring-2 focus:ring-[#85cbe5] focus:border-[#85cbe5] transition">
                                <Filter className="w-4 h-4 mr-2 text-[#64748b]" />
                                <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#e2e8f0] shadow-md">
                                {subjects.map((subject) => (
                                    <SelectItem
                                        key={subject}
                                        value={subject}
                                        className="hover:bg-[#f1f5f9] hover:text-black transition-colors cursor-pointer text-[#64748b]"
                                    >
                                        {subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort Dropdown */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-48 bg-white border border-[#e2e8f0] text-black focus:ring-2 focus:ring-[#85cbe5] focus:border-[#85cbe5] transition">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#e2e8f0] shadow-md">
                                <SelectItem
                                    value="date"
                                    className="hover:bg-[#f1f5f9] hover:text-black transition-colors cursor-pointer text-[#64748b]"
                                >
                                    Latest
                                </SelectItem>
                                <SelectItem
                                    value="downloads"
                                    className="hover:bg-[#f1f5f9] hover:text-black transition-colors cursor-pointer text-[#64748b]"
                                >
                                    Most Downloaded
                                </SelectItem>
                                <SelectItem
                                    value="rating"
                                    className="hover:bg-[#f1f5f9] hover:text-black transition-colors cursor-pointer text-[#64748b]"
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
                {filteredNotes.map((note, idx) => (
                    <Card
                        key={note._id}
                        className="group relative overflow-hidden text-left glass-effect animate-fade-in-down hover:scale-[1.025] hover:shadow-2xl transition-all duration-300"
                        style={{ borderColor: "#e2e8f0", background: "linear-gradient(135deg, #fafdff 0%, #f7fbfd 100%)" }}
                    >
                        <CardHeader className="pb-3">
                            <div className="space-y-2">
                                <Badge
                                  className="bg-[#eaf0f5] text-[#3a5d74] shadow rounded-full px-4 py-1 text-sm font-semibold tracking-wide mx-auto mb-2 border-0"
                                  style={{ boxShadow: '0 2px 8px 0 rgba(154, 201, 222, 0.10)' }}
                                >
                                    {note.subject.charAt(0).toUpperCase() + note.subject.slice(1)}
                                </Badge>
                                <CardTitle className="text-xl font-medium text-black">
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
                                    className="w-full border border-[#9AC9DE] text-[#3a5d74] bg-white group-hover:bg-[#9AC9DE] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-sm"
                                    variant={note.isPremium ? "default" : "outline"}
                                    style={{ boxShadow: '0 2px 8px 0 rgba(154, 201, 222, 0.10)' }}
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

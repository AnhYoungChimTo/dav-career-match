"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/Badge";
import { ImageUpload } from "@/components/ImageUpload";
import { Loader2 } from "lucide-react";

interface ProfileData {
    name: string;
    email: string;
    avatar: string | null;
    faculty: string;
    mbti: string;
    disc: string;
    education: string;
    workExperience: string;
    skills: string[];
    interests: string[];
}

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient() as any
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData>({
        name: "",
        email: "",
        avatar: null,
        faculty: "",
        mbti: "",
        disc: "",
        education: "",
        workExperience: "",
        skills: [],
        interests: []
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newSkill, setNewSkill] = useState("");

    // Predefined interest options
    const interestOptions = [
        "Technology", "Politics", "Diplomacy", "Economics", "Art", "Science",
        "Business", "Education", "Healthcare", "Environment", "Sports", "Music"
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
                return;
            }

            // Fetch Profile
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            // Fetch Skills
            const { data: skillsData } = await supabase
                .from("skills")
                .select("skill_name")
                .eq("user_id", user.id);

            // Fetch Interests
            const { data: interestsData } = await supabase
                .from("career_preferences")
                .select("interest_domains")
                .eq("user_id", user.id)
                .single();

            // Fetch Personality
            const { data: personalityData } = await supabase
                .from("personality")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (profileData) {
                setProfile({
                    name: profileData.full_name || "",
                    email: user.email || "",
                    avatar: profileData.avatar_url || null,
                    faculty: profileData.major || "", // Mapping major to faculty/major
                    mbti: personalityData?.mbti || "",
                    disc: personalityData?.disc || "",
                    education: profileData.university || "", // Using university field for now
                    workExperience: "", // Not in current schema, would need a new column or table
                    skills: skillsData?.map((s: any) => s.skill_name) || [],
                    interests: interestsData?.interest_domains || []
                });
            }
            setLoading(false);
        };

        fetchProfile();
    }, [supabase, router]);

    const handleSave = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Update Profile
        await supabase.from("profiles").update({
            full_name: profile.name,
            avatar_url: profile.avatar,
            major: profile.faculty,
            university: profile.education, // Mapping back
            updated_at: new Date().toISOString()
        }).eq("id", user.id);

        // 2. Update Personality
        await supabase.from("personality").upsert({
            user_id: user.id,
            mbti: profile.mbti,
            disc: profile.disc,
            updated_at: new Date().toISOString()
        });

        // 3. Update Interests
        await supabase.from("career_preferences").upsert({
            user_id: user.id,
            interest_domains: profile.interests,
            updated_at: new Date().toISOString()
        });

        // 4. Update Skills (Delete all and re-insert for simplicity)
        await supabase.from("skills").delete().eq("user_id", user.id);
        if (profile.skills.length > 0) {
            const skillsToInsert = profile.skills.map(skill => ({
                user_id: user.id,
                skill_name: skill,
                level: "Intermediate" // Default level
            }));
            await supabase.from("skills").insert(skillsToInsert);
        }

        setIsEditing(false);
        setLoading(false);
    };

    const handleInputChange = (field: string, value: any) => {
        setProfile({ ...profile, [field]: value });
    };

    const addSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-stripe-blue" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stripe-light font-sans text-stripe-dark">
            <Navigation />

            {/* Hero Section */}
            <div className="gradient-dark pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            My Profile
                        </h1>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            Manage your personal information, career preferences, and expertise.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20 relative z-20">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard')}
                        className="text-white hover:text-white/80 hover:bg-white/10"
                    >
                        ← Back to Dashboard
                    </Button>
                </div>

                <Card className="card-stripe bg-white/95 backdrop-blur-sm">
                    <CardHeader className="border-b border-gray-100 pb-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold text-stripe-dark">Profile Information</CardTitle>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} className="shadow-stripe hover:shadow-stripe-lg">
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-3">
                                    <Button onClick={handleSave} className="shadow-stripe">
                                        Save Changes
                                    </Button>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-8 space-y-10">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-shrink-0">
                                <div className="relative group">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt="Avatar"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-stripe-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-stripe-blue to-stripe-blurple flex items-center justify-center text-white text-4xl font-bold shadow-stripe-lg border-4 border-white">
                                            {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                                        </div>
                                    )}
                                    {isEditing && (
                                        <div className="mt-4">
                                            <ImageUpload value={profile.avatar} onChange={(url) => handleInputChange("avatar", url)} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-grow grid md:grid-cols-2 gap-6 w-full">
                                <div>
                                    <Label htmlFor="name" className="text-stripe-slate font-medium">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={profile.name}
                                        onChange={e => handleInputChange("name", e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="e.g. Sarah Connor"
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-stripe-slate font-medium">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile.email}
                                        disabled={true} // Email usually not editable
                                        className="mt-1.5 bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="faculty" className="text-stripe-slate font-medium">Faculty / Major</Label>
                                    <Input
                                        id="faculty"
                                        value={profile.faculty}
                                        onChange={e => handleInputChange("faculty", e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="e.g. International Relations"
                                        className="mt-1.5"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="mbti" className="text-stripe-slate font-medium">MBTI</Label>
                                        <Input
                                            id="mbti"
                                            value={profile.mbti}
                                            onChange={e => handleInputChange("mbti", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="e.g. ENTJ"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="disc" className="text-stripe-slate font-medium">DISC</Label>
                                        <Input
                                            id="disc"
                                            value={profile.disc}
                                            onChange={e => handleInputChange("disc", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="e.g. D"
                                            className="mt-1.5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Professional Info */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-stripe-dark mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-stripe-blue flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                                    </span>
                                    Education / University
                                </h3>
                                <Input
                                    value={profile.education}
                                    onChange={e => handleInputChange("education", e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="University Name"
                                    className="mt-1.5"
                                />
                            </div>
                            {/* Work Experience - removed as it's not in schema yet, or we can add a placeholder */}
                        </div>

                        <hr className="border-gray-100" />

                        {/* Skills & Interests */}
                        <div>
                            <h3 className="text-lg font-semibold text-stripe-dark mb-4">Skills & Expertise</h3>
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {profile.skills.map((skill, index) => (
                                        <Badge key={index} variant="default" className="px-3 py-1 text-sm">
                                            {skill}
                                            {isEditing && (
                                                <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-200 transition-colors">
                                                    ×
                                                </button>
                                            )}
                                        </Badge>
                                    ))}
                                    {profile.skills.length === 0 && !isEditing && (
                                        <span className="text-gray-400 italic">No skills added yet.</span>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2 max-w-md">
                                        <Input
                                            value={newSkill}
                                            onChange={e => setNewSkill(e.target.value)}
                                            placeholder="Add a skill (e.g. Leadership)"
                                            onKeyPress={e => e.key === 'Enter' && addSkill()}
                                            className="bg-white"
                                        />
                                        <Button onClick={addSkill} variant="secondary">Add</Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interests (Read-only/Selectable) */}
                        <div>
                            <h3 className="text-lg font-semibold text-stripe-dark mb-4">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {interestOptions.map(interest => {
                                    const isSelected = profile.interests.includes(interest);
                                    return (
                                        <Badge
                                            key={interest}
                                            variant={isSelected ? "teal" : "secondary"}
                                            className={`px-3 py-1 text-sm cursor-pointer transition-all duration-200 ${isEditing ? 'hover:scale-105' : 'cursor-default'}`}
                                            onClick={() => {
                                                if (!isEditing) return;
                                                if (isSelected) {
                                                    setProfile(p => ({ ...p, interests: p.interests.filter(i => i !== interest) }));
                                                } else {
                                                    setProfile(p => ({ ...p, interests: [...p.interests, interest] }));
                                                }
                                            }}
                                        >
                                            {interest}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

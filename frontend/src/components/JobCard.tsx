import React from 'react';

export interface Job {
    id: number;
    slug: string;
    title: string;
    category: string;
    domain: string;
    shortDescription: string;
    responsibilities: string[];
    hardSkills: string[];
    softSkills: string[];
    entryKpis: string[];
    tools: string[];
    learningPath: any;
    internshipProject: string;
    archetypesFit: string[];
    marketFitScore: any;
    notes?: string;
    score?: number;
}

interface JobCardProps {
    job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{job.category} • {job.domain}</p>
                </div>
                {job.score !== undefined && (
                    <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Match: {job.score}%
                    </div>
                )}
            </div>

            <p className="text-gray-700 mb-4">{job.shortDescription}</p>

            <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Key Responsibilities:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                    {(job.responsibilities || []).map((resp, index) => {
                        if (index >= 3) return null;
                        return <li key={index}>{resp}</li>;
                    })}
                </ul>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {(job.hardSkills || []).map((skill, index) => {
                    if (index >= 5) return null; // Limit to 5 manually
                    return (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {skill}
                        </span>
                    );
                })}
            </div>

            <div className="text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details &rarr;
                </button>
            </div>
        </div>
    );
};

export default JobCard;

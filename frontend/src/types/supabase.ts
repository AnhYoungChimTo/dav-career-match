export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    avatar_url: string | null
                    university: string | null
                    major: string | null
                    year_of_study: string | null
                    onboarding_completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    avatar_url?: string | null
                    university?: string | null
                    major?: string | null
                    year_of_study?: string | null
                    onboarding_completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    university?: string | null
                    major?: string | null
                    year_of_study?: string | null
                    onboarding_completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            skills: {
                Row: {
                    id: string
                    user_id: string
                    skill_name: string
                    level: 'Beginner' | 'Intermediate' | 'Advanced'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    skill_name: string
                    level: 'Beginner' | 'Intermediate' | 'Advanced'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    skill_name?: string
                    level?: 'Beginner' | 'Intermediate' | 'Advanced'
                    created_at?: string
                }
            }
            knowledge_domains: {
                Row: {
                    id: string
                    user_id: string
                    domain: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    domain: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    domain?: string
                    created_at?: string
                }
            }
            personality: {
                Row: {
                    id: string
                    user_id: string
                    mbti: string | null
                    disc: string | null
                    working_style: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    mbti?: string | null
                    disc?: string | null
                    working_style?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    mbti?: string | null
                    disc?: string | null
                    working_style?: string | null
                    created_at?: string
                }
            }
            career_preferences: {
                Row: {
                    id: string
                    user_id: string
                    career_target: string | null
                    interest_domains: string[] | null
                    work_environment: string | null
                    time_horizon: '3 months' | '6 months' | '12 months' | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    career_target?: string | null
                    interest_domains?: string[] | null
                    work_environment?: string | null
                    time_horizon?: '3 months' | '6 months' | '12 months' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    career_target?: string | null
                    interest_domains?: string[] | null
                    work_environment?: string | null
                    time_horizon?: '3 months' | '6 months' | '12 months' | null
                    created_at?: string
                }
            }
            jobs: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    responsibilities: string[] | null
                    required_skills: Json | null // Structure: { "Intern": [], "Fresher": [], "Junior": [] }
                    required_knowledge: string[] | null
                    domain: string | null
                    level: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    responsibilities?: string[] | null
                    required_skills?: Json | null
                    required_knowledge?: string[] | null
                    domain?: string | null
                    level?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    responsibilities?: string[] | null
                    required_skills?: Json | null
                    required_knowledge?: string[] | null
                    domain?: string | null
                    level?: string | null
                    created_at?: string
                }
            }
            job_matches: {
                Row: {
                    id: string
                    user_id: string
                    job_id: string
                    match_percentage: number
                    fit_tags: string[] | null
                    reasons_for_fit: Json | null
                    skill_gaps: Json | null
                    knowledge_gaps: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    job_id: string
                    match_percentage: number
                    fit_tags?: string[] | null
                    reasons_for_fit?: Json | null
                    skill_gaps?: Json | null
                    knowledge_gaps?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    job_id?: string
                    match_percentage?: number
                    fit_tags?: string[] | null
                    reasons_for_fit?: Json | null
                    skill_gaps?: Json | null
                    knowledge_gaps?: Json | null
                    created_at?: string
                }
            }
            learning_tasks: {
                Row: {
                    id: string
                    user_id: string
                    task_description: string
                    week_number: number
                    estimated_hours: number
                    is_completed: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    task_description: string
                    week_number: number
                    estimated_hours: number
                    is_completed?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    task_description?: string
                    week_number?: number
                    estimated_hours?: number
                    is_completed?: boolean
                    created_at?: string
                }
            }
        }
    }
}

export type Role = 'student' | 'professor';

export type CategoryId = 'top5' | 'cat1' | 'cat2' | 'cat3' | 'cat4' | 'cat5' | 'favorites' | 'all';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  badge?: string;
  description: string;
}

export interface SkillLink {
  title: string;
  url: string;
}

export interface Skill {
  id: string;
  cat: 'cat1' | 'cat2' | 'cat3' | 'cat4' | 'cat5';
  top?: boolean;
  title: string;
  desc: string;
  prompt: string;
  video?: string;
  links?: SkillLink[];
  tags?: string[];
}

export interface TeachingContext {
  stage: string;
  subject: string;
  topic: string;
  pedagogies: string[];
  pedagogyCustom: string;
  assessments: string[];
  assessmentCustom: string;
  extra: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  stage: string;
  subject: string;
  topic: string;
  pedagogies: string[];
  assessments: string[];
  extra: string;
}

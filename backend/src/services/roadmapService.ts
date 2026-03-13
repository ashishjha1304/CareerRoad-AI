import { supabase } from '../config/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Skill {
  name: string;
  description: string;
  tools: string[];
}

interface Stage {
  name: string;
  level: number;
  skills: Skill[];
}

const roadmapsTemplates: Record<string, Stage[]> = {
  'Data Analyst': [
    {
      name: 'Beginner',
      level: 1,
      skills: [
        { name: 'Introduction to Data Analytics', description: 'Understand the core concepts of data analysis and life cycles.', tools: ['Excel', 'Google Sheets'] },
        { name: 'Excel for Data Analysis', description: 'Master pivot tables, VLOOKUPs, and complex formulas.', tools: ['Microsoft Excel'] },
        { name: 'Basic Statistics', description: 'Learn mean, median, mode, standard deviation, and probability.', tools: ['Scientific Calculator', 'Excel'] },
        { name: 'SQL Basics', description: 'Write elementary queries to select and filter data.', tools: ['PostgreSQL', 'MySQL'] },
        { name: 'Data Visualization Fundamentals', description: 'Learn how to create basic charts and choose the right visualization.', tools: ['Tableau Public', 'Excel'] }
      ]
    },
    {
        name: 'Intermediate',
        level: 2,
        skills: [
          { name: 'Advanced SQL', description: 'Master joins, subqueries, and window functions.', tools: ['PostgreSQL', 'BigQuery'] },
          { name: 'Python for Data Analysis', description: 'Introduction to data analysis using Python libraries.', tools: ['Pandas', 'NumPy', 'Jupyter Notebook'] },
          { name: 'Data Visualization with Python', description: 'Create stunning visualizations using code.', tools: ['Matplotlib', 'Seaborn', 'Plotly'] },
          { name: 'Exploratory Data Analysis (EDA)', description: 'Techniques for analyzing data sets to summarize their main characteristics.', tools: ['Python', 'Pandas'] },
          { name: 'Business Intelligence Tools', description: 'Build interactive dashboards for business stakeholders.', tools: ['Tableau Desktop', 'Power BI'] }
        ]
    },
    {
        name: 'Advanced',
        level: 3,
        skills: [
          { name: 'Statistical Modeling', description: 'Learn linear regression, hypothesis testing, and inferential statistics.', tools: ['Python', 'R', 'Statsmodels'] },
          { name: 'Machine Learning Basics', description: 'Introduction to predictive modeling.', tools: ['Scikit-learn', 'Excel'] },
          { name: 'Big Data Fundamentals', description: 'Handling large datasets effectively.', tools: ['Apache Spark', 'Hadoop', 'SQL'] },
          { name: 'Data Storytelling', description: 'Communicate findings effectively to non-technical audiences.', tools: ['PowerPoint', 'Tableau', 'Looker'] },
          { name: 'ETL Processes', description: 'Understand the Extract, Transform, and Load lifecycle.', tools: ['Alteryx', 'Talend', 'Airflow'] }
        ]
    }
  ],
  'Web Developer': [
    {
      name: 'Beginner',
      level: 1,
      skills: [
        { name: 'HTML5 & Semantic Web', description: 'Master the building blocks of web structure.', tools: ['VS Code', 'Chrome DevTools'] },
        { name: 'CSS3 & Flexbox/Grid', description: 'Learn how to style websites and make them responsive.', tools: ['Tailwind CSS', 'SASS'] },
        { name: 'JavaScript Fundamentals', description: 'Variables, loops, functions, and the DOM.', tools: ['Modern Browsers', 'Node.js'] },
        { name: 'Git & Version Control', description: 'Learn how to manage code changes.', tools: ['GitHub', 'GitLab'] },
        { name: 'Responsive Design', description: 'Design websites that look great on any device.', tools: ['Browser Developer Tools', 'Figma'] }
      ]
    },
    {
        name: 'Intermediate',
        level: 2,
        skills: [
          { name: 'React.js', description: 'Build dynamic user interfaces with components.', tools: ['Next.js', 'Redux', 'Zustand'] },
          { name: 'TypeScript', description: 'Add types to JavaScript for safer and cleaner code.', tools: ['VS Code'] },
          { name: 'Back-end Basics', description: 'Understand servers, APIs, and databases.', tools: ['Express.js', 'Node.js', 'PostgreSQL'] },
          { name: 'State Management', description: 'Managing application state across complex UIs.', tools: ['React Context', 'Zustand', 'TanStack Query'] },
          { name: 'CSS Frameworks', description: 'Rapidly build modern designs.', tools: ['Tailwind CSS', 'Shadcn/UI'] }
        ]
    },
    {
        name: 'Advanced',
        level: 3,
        skills: [
            { name: 'Full-stack Architecture', description: 'Designing scalable applications from database to frontend.', tools: ['Next.js', 'TRPC', 'Prisma'] },
            { name: 'Testing', description: 'Ensuring your code reliability.', tools: ['Jest', 'Cypress', 'Playwright'] },
            { name: 'CI/CD & DevOps', description: 'Automated deployments and infrastructure.', tools: ['Vercel', 'Docker', 'GitHub Actions'] },
            { name: 'Performance Optimization', description: 'Optimizing Core Web Vitals.', tools: ['Lighthouse', 'Next.js Image Optimizations'] },
            { name: 'Web Security', description: 'Protecting against common vulnerabilities.', tools: ['Helmet.js', 'OWASP ZAP'] }
        ]
    }
  ],
  'UI/UX Designer': [
    {
      name: 'Beginner',
      level: 1,
      skills: [
        { name: 'Design Principles', description: 'Learn typography, color theory, and layout.', tools: ['Figma', 'Adobe Color'] },
        { name: 'Figma Basics', description: 'Master the industry-standard design tool.', tools: ['Figma'] },
        { name: 'UX Fundamentals', description: 'Introduction to user-centered design.', tools: ['Pen & Paper', 'User Research Tools'] },
        { name: 'Wireframing', description: 'Creating low-fidelity versions of interfaces.', tools: ['Balsamiq', 'Figma'] },
        { name: 'Information Architecture', description: 'Organizing content logically.', tools: ['FigJam', 'Miro'] }
      ]
    },
    {
        name: 'Intermediate',
        level: 2,
        skills: [
            { name: 'High-Fidelity Prototyping', description: 'Creating interactive, realistic design mockups.', tools: ['Figma Prototyping', 'Protopie'] },
            { name: 'Design Systems', description: 'Building reusable component libraries.', tools: ['Figma Variables', 'Zeroheight'] },
            { name: 'User Research', description: 'Conducting interviews and usability tests.', tools: ['Maze', 'UserTesting', 'Lookback'] },
            { name: 'Visual Design Mastery', description: 'Advanced UI styling and aesthetics.', tools: ['Adobe Photoshop', 'Illustrator'] },
            { name: 'Responsive UI Design', description: 'Designing for mobile first platforms.', tools: ['Figma Plugins'] }
        ]
    },
    {
        name: 'Advanced',
        level: 3,
        skills: [
            { name: 'Product Strategy', description: 'Aligning design with business goals.', tools: ['Strategy Maps'] },
            { name: 'Animation & Motion Design', description: 'Adding life to interfaces.', tools: ['Lottie', 'Framer', 'After Effects'] },
            { name: 'Accessibility (a11y)', description: 'Designing for all users.', tools: ['Stark', 'Contrast Checkers'] },
            { name: 'Handoff to Development', description: 'Ensuring your vision is built correctly.', tools: ['Storybook', 'Zeplin'] },
            { name: 'UX Writing', description: 'Crafting clear and concise microcopy.', tools: ['Google Docs'] }
        ]
    }
  ],
  'AI Engineer': [
    {
      name: 'Beginner',
      level: 1,
      skills: [
        { name: 'Linear Algebra & Calculus', description: 'The mathematical foundations for ML.', tools: ['Mathematics', 'Python'] },
        { name: 'Python Programming', description: 'Core Python for data science.', tools: ['Python 3.11', 'VS Code'] },
        { name: 'Probability & Statistics', description: 'Understanding distributions and Bayesian modeling.', tools: ['Statsim', 'Python'] },
        { name: 'Machine Learning Fundamentals', description: 'Introduction to regression and classification.', tools: ['Scikit-learn'] },
        { name: 'Development Environments', description: 'Setting up Jupyter for experimentation.', tools: ['Jupyter Notebooks', 'Google Colab'] }
      ]
    },
    {
        name: 'Intermediate',
        level: 2,
        skills: [
            { name: 'Deep Learning', description: 'Neural networks and architectures.', tools: ['PyTorch', 'TensorFlow'] },
            { name: 'Natural Language Processing', description: 'Understanding and generating human text.', tools: ['Hugging Face', 'NLTK', 'Spacy'] },
            { name: 'Computer Vision', description: 'Building models that see.', tools: ['OpenCV', 'YOLO'] },
            { name: 'MLOps Basics', description: 'Managing the ML lifecycle.', tools: ['MLflow', 'DVC'] },
            { name: 'Cloud AI Services', description: 'Using pre-built models.', tools: ['AWS SageMaker', 'Google Vertex AI'] }
        ]
    },
    {
        name: 'Advanced',
        level: 3,
        skills: [
            { name: 'Large Language Models (LLMs)', description: 'Mastering prompt engineering and fine-tuning.', tools: ['OpenAI API', 'LangChain', 'LlamaIndex'] },
            { name: 'Reinforcement Learning', description: 'Agents that learn from environment.', tools: ['OpenAI Gym'] },
            { name: 'Generative AI Architecture', description: 'Understanding GANs and Diffusion models.', tools: ['MidJourney API', 'Stable Diffusion'] },
            { name: 'AI Ethics & Safety', description: 'Ensuring AI fairness and transparency.', tools: ['Ethical Guidelines'] },
            { name: 'Edge AI Deployment', description: 'Running AI on mobile and embedded devices.', tools: ['TensorFlow Lite', 'CoreML'] }
        ]
    }
  ]
};

export const roadmapService = {
  generateRoadmap: async (userId: string, careerPath: string) => {
    let template: Stage[] | null = null;
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
          You are an expert career architect. Generate a highly detailed, professional 3-stage learning roadmap (Beginner, Intermediate, Advanced) for a user wanting to become a "${careerPath}".
          
          You MUST return ONLY a valid JSON array object (without markdown wrappers, do not use \`\`\`json) strictly adhering to this array structure:
          [
            {
              "name": "Beginner",
              "level": 1,
              "skills": [
                { "name": "Skill Name", "description": "Short clear description", "tools": ["Tool1", "Tool2"] }
              ]
            },
            ...
          ]
          
          Ensure each stage has exactly 5 essential skills to master.
        `;
        
        const result = await model.generateContent(prompt);
        let textResponse = result.response.text();
        
        textResponse = textResponse.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();
        
        template = JSON.parse(textResponse);
      } catch (aiError) {
        console.error("AI Generation failed, falling back to static template:", aiError);
      }
    }

    if (!template) {
      template = roadmapsTemplates[careerPath];
    }
    if (!template) {
      const formattedCareer = careerPath.trim().replace(/\b\w/g, l => l.toUpperCase());
      template = [
        {
          name: 'Beginner',
          level: 1,
          skills: [
            { name: `Introduction to ${formattedCareer}`, description: `Understand the fundamental concepts, history, and core principles of being a ${formattedCareer}.`, tools: ['Research', 'Documentation'] },
            { name: 'Basic Tools & Environment', description: 'Learn to set up your fundamental working environment.', tools: ['Basic Software', 'Workstation setup'] },
            { name: 'Core Terminology', description: `Learn the essential vocabulary used by professionals in ${formattedCareer}.`, tools: ['Glossary', 'Flashcards'] },
            { name: 'First Practical Exercise', description: 'Apply your basic theoretical knowledge to a simple, guided real-world task.', tools: ['Starter Kits', 'Tutorials'] },
            { name: 'Networking Basics', description: 'Join communities and forums related to your field.', tools: ['LinkedIn', 'Discord'] }
          ]
        },
        {
            name: 'Intermediate',
            level: 2,
            skills: [
              { name: 'Advanced Methodologies', description: 'Move beyond the basics to learn industry-standard workflows.', tools: ['Industry Specific Tools'] },
              { name: 'Problem Solving Strategies', description: `Tackle common intermediate challenges faced by a ${formattedCareer}.`, tools: ['Case Studies', 'Analytical Frameworks'] },
              { name: 'Specialized Tooling Mastery', description: 'Deep dive into the primary software/tools used daily in the industry.', tools: ['Advanced Software Features'] },
              { name: 'Collaborative Projects', description: 'Learn to work within a team environment and version your work.', tools: ['Collaboration Tools', 'Version Control'] },
              { name: 'Portfolio Building', description: 'Create a professional portfolio showcasing your intermediate skills.', tools: ['Portfolio Site', 'GitHub/Behance'] }
            ]
        },
        {
            name: 'Advanced',
            level: 3,
            skills: [
                { name: 'Architectural & Strategic Planning', description: 'Design complex solutions and oversee big-picture strategies.', tools: ['Architecture Diagrams', 'Planning Tools'] },
                { name: 'Performance Optimization', description: 'Analyze and optimize your outcomes for maximum efficiency and scale.', tools: ['Optimization Frameworks'] },
                { name: 'Mentorship & Leadership', description: 'Guide juniors, review work, and lead project initiatives.', tools: ['Management Software', 'Leadership Frameworks'] },
                { name: 'Industry Innovation', description: 'Keep up with bleeding-edge technology, research, and contribute back.', tools: ['Whitepapers', 'Conferences'] },
                { name: 'Career Specialization', description: 'Carve out a highly specialized niche within the field.', tools: ['Certifications', 'Advanced Training'] }
            ]
        }
      ];
    }

    const totalSkills = template.reduce((acc, stage) => acc + stage.skills.length, 0);

    try {
      const { data: existingRoadmap, error: checkError } = await supabase
        .from('roadmaps')
        .select('id')
        .eq('user_id', userId)
        .ilike('career_path', careerPath.trim())
        .limit(1)
        .maybeSingle();
      
      if (existingRoadmap) return existingRoadmap;

      const { data: roadmap, error: roadmapError } = await supabase
        .from('roadmaps')
        .insert([{ user_id: userId, title: `${careerPath} Roadmap`, career_path: careerPath, total_skills: totalSkills, completed_skills: 0 }])
        .select()
        .single();

      if (roadmapError) throw roadmapError;

      for (const stageData of template) {
        const { data: stage, error: stageError } = await supabase
            .from('stages')
            .insert([{ roadmap_id: roadmap.id, name: stageData.name, level: stageData.level }])
            .select()
            .single();
        
        if (stageError) throw stageError;

        const skillsToInsert = stageData.skills.map(skill => ({
            stage_id: stage.id,
            name: skill.name,
            description: skill.description,
            tools: skill.tools,
            status: 'pending'
        }));

        const { error: skillsError } = await supabase
            .from('skills')
            .insert(skillsToInsert);
        
        if (skillsError) throw skillsError;
      }

      return roadmap;
    } catch (error) {
      console.error('Error in regenerateRoadmap:', error);
      throw error;
    }
  },

  getRoadmap: async (userId: string) => {
    const { data: roadmaps, error } = await supabase
      .from('roadmaps')
      .select(`
        *,
        stages (
          *,
          skills (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return roadmaps ? roadmaps[0] : null;
  }
};

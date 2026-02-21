import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from 'lucide-react';

const ResumePreview = ({ data }) => {
  const { personalInfo, summary, education, skills, projects, experience, certifications, achievements } = data;

  return (
    <div id="resume-preview" className="bg-white shadow-lg overflow-hidden" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header - Modern Clean Design */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedIn && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Portfolio</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-sm font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2 uppercase tracking-wider">
              Professional Summary
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.slice(0, 3).map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                      <p className="text-gray-700 text-sm">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap font-medium">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.filter(b => b.trim()).slice(0, 3).map((bullet, bIndex) => (
                        <li key={bIndex} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-slate-500 mt-1.5 text-xs">●</span>
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">
              Education
            </h2>
            <div className="space-y-3">
              {education.slice(0, 2).map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{edu.institution}</h3>
                    <p className="text-gray-700 text-sm">
                      {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </p>
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-1 italic">{edu.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap font-medium">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills - Modern Tag Style */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.slice(0, 2).map((proj, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {proj.title}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-2 text-slate-600 hover:text-slate-800">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </h3>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold">Technologies:</span> {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {proj.bullets.filter(b => b.trim()).slice(0, 2).map((bullet, bIndex) => (
                        <li key={bIndex} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-slate-500 mt-1.5 text-xs">●</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.slice(0, 3).map((cert, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {cert.name}
                      {cert.link && (
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-2 text-slate-600 hover:text-slate-800">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </h3>
                    {cert.issuer && <p className="text-sm text-gray-700">{cert.issuer}</p>}
                  </div>
                  {cert.date && <span className="text-xs text-gray-600 font-medium">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">
              Achievements
            </h2>
            <div className="space-y-2">
              {achievements.slice(0, 2).map((achievement, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 text-sm">{achievement.title}</h3>
                    {achievement.date && <span className="text-xs text-gray-600 font-medium">{achievement.date}</span>}
                  </div>
                  {achievement.description && (
                    <p className="text-sm text-gray-700 mt-1">{achievement.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;

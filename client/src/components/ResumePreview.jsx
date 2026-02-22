import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from 'lucide-react';

const ResumePreview = ({ data }) => {
  const { personalInfo, summary, education, skills, projects, experience, certifications, achievements } = data;

  // Professional color scheme - ATS friendly
  const styles = {
    header: {
      borderBottom: '2px solid #1e293b',
      paddingBottom: '16px',
      marginBottom: '20px'
    },
    name: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b',
      letterSpacing: '0.5px',
      marginBottom: '8px'
    },
    contactRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      fontSize: '13px',
      color: '#475569'
    },
    section: {
      marginBottom: '18px'
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: '700',
      color: '#1e293b',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      borderBottom: '1px solid #cbd5e1',
      paddingBottom: '4px',
      marginBottom: '12px'
    },
    text: {
      fontSize: '13px',
      lineHeight: '1.6',
      color: '#334155'
    }
  };

  return (
    <div id="resume-preview" className="bg-white" style={{ 
      maxWidth: '850px', 
      margin: '0 auto',
      padding: '40px 50px',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header - Professional Clean Design */}
      <div style={styles.header}>
        <h1 style={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
        <div style={styles.contactRow}>
          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <>
              <span style={{ color: '#94a3b8' }}>|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span style={{ color: '#94a3b8' }}>|</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedIn && (
            <>
              <span style={{ color: '#94a3b8' }}>|</span>
              <span>linkedin.com/in/{personalInfo.linkedIn.replace(/.*linkedin\.com\/in\//, '').replace(/\/+$/, '')}</span>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span style={{ color: '#94a3b8' }}>|</span>
              <span>{personalInfo.portfolio.replace(/^https?:\/\//, '').replace(/\/+$/, '')}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Professional Summary</h2>
          <p style={styles.text}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {experience.map((exp, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{exp.position}</h3>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0 0 0' }}>
                      {exp.company}{exp.location && `, ${exp.location}`}
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.bullets && exp.bullets.filter(b => b.trim()).length > 0 && (
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
                    {exp.bullets.filter(b => b.trim()).map((bullet, bIndex) => (
                      <li key={bIndex} style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', marginBottom: '2px' }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {education.map((edu, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{edu.institution}</h3>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0 0 0' }}>
                    {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                  </p>
                  {edu.description && (
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0', fontStyle: 'italic' }}>{edu.description}</p>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                  {edu.startDate} – {edu.endDate || 'Present'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills - ATS Friendly Format */}
      {skills.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <p style={{ ...styles.text, margin: 0 }}>
            {skills.join(', ')}
          </p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projects.map((proj, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {proj.title}
                    {proj.link && (
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400', marginLeft: '8px' }}>
                        ({proj.link.replace(/^https?:\/\//, '').replace(/\/+$/, '')})
                      </span>
                    )}
                  </h3>
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0 0' }}>
                    Technologies: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p style={{ fontSize: '13px', color: '#334155', margin: '4px 0 0 0' }}>{proj.description}</p>
                )}
                {proj.bullets && proj.bullets.filter(b => b.trim()).length > 0 && (
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                    {proj.bullets.filter(b => b.trim()).map((bullet, bIndex) => (
                      <li key={bIndex} style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Certifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {certifications.map((cert, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {cert.name}
                    {cert.link && (
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400', marginLeft: '8px' }}>
                        (View Credential)
                      </span>
                    )}
                  </h3>
                  {cert.issuer && <p style={{ fontSize: '12px', color: '#475569', margin: '1px 0 0 0' }}>{cert.issuer}</p>}
                </div>
                {cert.date && <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Achievements</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {achievements.map((achievement, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{achievement.title}</h3>
                  {achievement.date && <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>{achievement.date}</span>}
                </div>
                {achievement.description && (
                  <p style={{ fontSize: '13px', color: '#334155', margin: '2px 0 0 0' }}>{achievement.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;

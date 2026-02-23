/**
 * AutoFit Engine for One-Page Resume Optimization
 * Handles client-side measurements and adjustments
 */

// A4 dimensions at 96 DPI
const A4_WIDTH_PX = 794;  // 210mm
const A4_HEIGHT_PX = 1123; // 297mm

// Minimum readable thresholds
const MIN_FONT_SIZE = 10;
const MIN_LINE_HEIGHT = 1.2;
const MIN_MARGIN = 10; // mm

/**
 * Measure content height in a hidden container
 */
export const measureContentHeight = (htmlContent) => {
  // Create hidden measurement container
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: ${A4_WIDTH_PX}px;
    visibility: hidden;
    pointer-events: none;
  `;
  
  container.innerHTML = htmlContent;
  document.body.appendChild(container);
  
  const height = container.scrollHeight;
  
  // Cleanup
  document.body.removeChild(container);
  
  return height;
};

/**
 * Check if content fits on one page
 */
export const fitsOnOnePage = (height) => {
  return height <= A4_HEIGHT_PX;
};

/**
 * Calculate required adjustments to fit content
 */
export const calculateAdjustments = (currentHeight, currentSettings = {}) => {
  const settings = {
    fontSize: currentSettings.fontSize || 11,
    lineHeight: currentSettings.lineHeight || 1.35,
    sectionSpacing: currentSettings.sectionSpacing || 10,
    margin: currentSettings.margin || 12,
    ...currentSettings
  };
  
  // If already fits, no adjustments needed
  if (currentHeight <= A4_HEIGHT_PX) {
    return { needsAdjustment: false, settings };
  }
  
  const overflow = currentHeight - A4_HEIGHT_PX;
  const overflowRatio = overflow / currentHeight;
  
  // Progressive adjustments
  const adjustments = { ...settings, needsAdjustment: true };
  
  // Level 1: Reduce line height (least aggressive)
  if (overflowRatio > 0.05) {
    adjustments.lineHeight = Math.max(MIN_LINE_HEIGHT, settings.lineHeight - 0.1);
  }
  
  // Level 2: Reduce section spacing
  if (overflowRatio > 0.1) {
    adjustments.sectionSpacing = Math.max(6, settings.sectionSpacing - 2);
  }
  
  // Level 3: Reduce margins
  if (overflowRatio > 0.15) {
    adjustments.margin = Math.max(MIN_MARGIN, settings.margin - 2);
  }
  
  // Level 4: Reduce font size (most aggressive)
  if (overflowRatio > 0.2) {
    adjustments.fontSize = Math.max(MIN_FONT_SIZE, settings.fontSize - 0.5);
  }
  
  // Level 5: Multiple compression techniques
  if (overflowRatio > 0.25) {
    adjustments.lineHeight = Math.max(MIN_LINE_HEIGHT, adjustments.lineHeight - 0.05);
    adjustments.sectionSpacing = Math.max(4, adjustments.sectionSpacing - 2);
    adjustments.fontSize = Math.max(MIN_FONT_SIZE, adjustments.fontSize - 0.5);
  }
  
  // Level 6: Maximum compression
  if (overflowRatio > 0.35) {
    adjustments.lineHeight = MIN_LINE_HEIGHT;
    adjustments.sectionSpacing = 4;
    adjustments.margin = MIN_MARGIN;
    adjustments.fontSize = MIN_FONT_SIZE;
    adjustments.maxCompression = true;
  }
  
  return adjustments;
};

/**
 * Apply CSS adjustments to HTML content
 */
export const applyAdjustments = (htmlContent, adjustments) => {
  const {
    fontSize = 11,
    lineHeight = 1.35,
    sectionSpacing = 10,
    margin = 12
  } = adjustments;
  
  // Create adjustment styles
  const adjustmentStyles = `
    <style id="autofit-styles">
      .optimized-resume, .optimized-resume * {
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight} !important;
      }
      .optimized-resume {
        padding: ${margin}mm !important;
      }
      .optimized-resume section, 
      .optimized-resume .section {
        margin-bottom: ${sectionSpacing}px !important;
      }
      .optimized-resume p, 
      .optimized-resume li {
        margin-bottom: ${Math.max(1, sectionSpacing / 4)}px !important;
      }
      .optimized-resume h1, 
      .optimized-resume h2, 
      .optimized-resume h3 {
        margin-bottom: ${Math.max(2, sectionSpacing / 3)}px !important;
      }
      .optimized-resume ul {
        margin-top: 2px !important;
        margin-bottom: 2px !important;
      }
    </style>
  `;
  
  // Insert styles before content
  if (htmlContent.includes('<head>')) {
    return htmlContent.replace('</head>', `${adjustmentStyles}</head>`);
  } else if (htmlContent.includes('<body>')) {
    return htmlContent.replace('<body>', `<body>${adjustmentStyles}`);
  } else {
    return adjustmentStyles + htmlContent;
  }
};

/**
 * Smart content compression rules
 */
export const applySmartCompression = (htmlContent) => {
  let compressed = htmlContent;
  
  // Remove extra whitespace between tags
  compressed = compressed.replace(/>\s+</g, '><');
  
  // Compress multiple spaces
  compressed = compressed.replace(/\s{2,}/g, ' ');
  
  // Remove empty paragraphs
  compressed = compressed.replace(/<p[^>]*>\s*<\/p>/gi, '');
  
  // Remove empty list items
  compressed = compressed.replace(/<li[^>]*>\s*<\/li>/gi, '');
  
  // Compress consecutive breaks
  compressed = compressed.replace(/(<br\s*\/?>\s*){2,}/gi, '<br/>');
  
  return compressed;
};

/**
 * Check content fit - Groq handles the optimization
 * This function only measures, doesn't aggressively compress
 */
export const autoFitContent = async (htmlContent, maxIterations = 5) => {
  // Just measure the content as provided by Groq
  const height = measureContentHeight(htmlContent);
  
  return {
    success: fitsOnOnePage(height),
    html: htmlContent,
    settings: {
      fontSize: 11,
      lineHeight: 1.35,
      sectionSpacing: 10,
      margin: 12
    },
    finalHeight: height,
    iterations: 1,
    overflow: height > A4_HEIGHT_PX ? height - A4_HEIGHT_PX : 0
  };
};

/**
 * Generate print-ready CSS
 */
export const generatePrintStyles = () => {
  return `
    @media print {
      @page {
        size: A4;
        margin: 0;
      }
      
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .optimized-resume {
        width: 210mm !important;
        height: 297mm !important;
        overflow: hidden !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
      
      * {
        page-break-inside: avoid !important;
      }
    }
  `;
};

/**
 * Prepare HTML for PDF export
 */
export const prepareForPDF = (htmlContent, settings = {}) => {
  const printStyles = generatePrintStyles();
  
  // Wrap in proper HTML structure if needed
  let preparedHTML = htmlContent;
  
  if (!preparedHTML.includes('<!DOCTYPE')) {
    preparedHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; }
    ${printStyles}
  </style>
</head>
<body>
  ${preparedHTML}
</body>
</html>
    `;
  } else if (!preparedHTML.includes('@media print')) {
    preparedHTML = preparedHTML.replace('</head>', `<style>${printStyles}</style></head>`);
  }
  
  return preparedHTML;
};

/**
 * Check content density and return warning if needed
 */
export const checkContentDensity = (resumeData) => {
  const sections = [
    resumeData.experience?.length || 0,
    resumeData.education?.length || 0,
    resumeData.projects?.length || 0,
    resumeData.skills?.length || 0,
    resumeData.certifications?.length || 0,
    resumeData.achievements?.length || 0
  ];
  
  const totalItems = sections.reduce((a, b) => a + b, 0);
  const experienceBullets = resumeData.experience?.reduce((acc, exp) => 
    acc + (exp.bullets?.filter(b => b.trim()).length || 0), 0) || 0;
  
  // Density thresholds
  if (totalItems > 20 || experienceBullets > 12) {
    return {
      warning: true,
      message: 'High content density detected. Content will be auto-optimized to fit one page.',
      level: 'high',
      details: {
        totalItems,
        experienceBullets,
        recommendation: 'Consider prioritizing your most relevant experiences.'
      }
    };
  }
  
  if (totalItems > 15 || experienceBullets > 8) {
    return {
      warning: true,
      message: 'Moderate content density. Some compression may be applied.',
      level: 'medium',
      details: {
        totalItems,
        experienceBullets
      }
    };
  }
  
  return {
    warning: false,
    message: 'Content density is optimal for a single page.',
    level: 'low'
  };
};

/**
 * Truncate content if absolutely necessary
 */
export const truncateContent = (resumeData, maxItems = {}) => {
  const truncated = { ...resumeData };
  
  const limits = {
    experience: maxItems.experience || 4,
    education: maxItems.education || 2,
    projects: maxItems.projects || 3,
    certifications: maxItems.certifications || 4,
    achievements: maxItems.achievements || 3,
    bulletsPerExperience: maxItems.bulletsPerExperience || 3,
    bulletsPerProject: maxItems.bulletsPerProject || 2
  };
  
  // Truncate experiences
  if (truncated.experience?.length > limits.experience) {
    truncated.experience = truncated.experience.slice(0, limits.experience);
  }
  
  // Truncate bullets per experience
  truncated.experience = truncated.experience?.map(exp => ({
    ...exp,
    bullets: exp.bullets?.slice(0, limits.bulletsPerExperience) || []
  }));
  
  // Truncate education
  if (truncated.education?.length > limits.education) {
    truncated.education = truncated.education.slice(0, limits.education);
  }
  
  // Truncate projects
  if (truncated.projects?.length > limits.projects) {
    truncated.projects = truncated.projects.slice(0, limits.projects);
  }
  
  // Truncate bullets per project
  truncated.projects = truncated.projects?.map(proj => ({
    ...proj,
    bullets: proj.bullets?.slice(0, limits.bulletsPerProject) || []
  }));
  
  // Truncate certifications
  if (truncated.certifications?.length > limits.certifications) {
    truncated.certifications = truncated.certifications.slice(0, limits.certifications);
  }
  
  // Truncate achievements
  if (truncated.achievements?.length > limits.achievements) {
    truncated.achievements = truncated.achievements.slice(0, limits.achievements);
  }
  
  return truncated;
};

export default {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  MIN_FONT_SIZE,
  MIN_LINE_HEIGHT,
  MIN_MARGIN,
  measureContentHeight,
  fitsOnOnePage,
  calculateAdjustments,
  applyAdjustments,
  applySmartCompression,
  autoFitContent,
  generatePrintStyles,
  prepareForPDF,
  checkContentDensity,
  truncateContent
};

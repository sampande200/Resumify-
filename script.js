// State Management
let educationCount = 0;
let experienceCount = 0;
let projectCount = 0;
let currentTemplate = 'classic';

// DOM Elements
const homepage = document.getElementById('homepage');
const builderPage = document.getElementById('builderPage');
const startBuildingBtn = document.getElementById('startBuildingBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const themeToggle = document.getElementById('themeToggle');
const templateButtons = document.querySelectorAll('[data-template]');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();

    // Add initial entries if none exist
    if (educationCount === 0) addEducation();
    if (experienceCount === 0) addExperience();
    if (projectCount === 0) addProject();
});

// Event Listeners
function setupEventListeners() {
    startBuildingBtn.addEventListener('click', showBuilder);
    resetBtn.addEventListener('click', resetForm);
    downloadBtn.addEventListener('click', downloadPDF);
    themeToggle.addEventListener('click', toggleTheme);

    templateButtons.forEach(btn => {
        btn.addEventListener('click', () => changeTemplate(btn.dataset.template));
    });

    // Form inputs
    document.getElementById('fullName').addEventListener('input', updatePreview);
    document.getElementById('email').addEventListener('input', updatePreview);
    document.getElementById('phone').addEventListener('input', updatePreview);
    document.getElementById('address').addEventListener('input', updatePreview);
    document.getElementById('summary').addEventListener('input', updatePreview);
    document.getElementById('skills').addEventListener('input', updatePreview);

    // Add buttons
    document.getElementById('addEducation').addEventListener('click', addEducation);
    document.getElementById('addExperience').addEventListener('click', addExperience);
    document.getElementById('addProject').addEventListener('click', addProject);
}

// Navigation
function showBuilder() {
    homepage.classList.add('d-none');
    builderPage.classList.remove('d-none');
    updatePreview();
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
    themeToggle.innerHTML = `<span id="themeIcon">${isDark ? '☀️' : '🌙'}</span> ${isDark ? 'Light' : 'Dark'} Mode`;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Template Change
function changeTemplate(template) {
    currentTemplate = template;
    const preview = document.getElementById('resumePreview');
    preview.className = `resume-preview ${template}-template`;

    templateButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.template === template);
    });

    localStorage.setItem('template', template);
}
// Add Dynamic Sections
function addEducation() {
    educationCount++;
    const container = document.getElementById('educationContainer');
    const entry = document.createElement('div');
    entry.className = 'dynamic-entry';
    entry.dataset.id = educationCount;
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger remove-btn" onclick="removeEntry(this, 'education')">×</button>
        <div class="mb-2">
            <input type="text" class="form-control form-control-sm mb-2" placeholder="Degree" data-field="degree">
        </div>
        <div class="mb-2">
            <input type="text" class="form-control form-control-sm mb-2" placeholder="Institution" data-field="institution">
        </div>
        <div class="mb-2">
            <input type="text" class="form-control form-control-sm" placeholder="Year (e.g., 2020-2024)" data-field="year">
        </div>
    `;

    entry.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    container.appendChild(entry);
    updatePreview();
}

function addExperience() {
    experienceCount++;
    const container = document.getElementById('experienceContainer');
    const entry = document.createElement('div');
    entry.className = 'dynamic-entry';
    entry.dataset.id = experienceCount;
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger remove-btn" onclick="removeEntry(this, 'experience')">×</button>
        <div class="mb-2">
            <input type="text" class="form-control form-control-sm mb-2" placeholder="Job Title" data-field="title">
        </div>
        <div class="mb-2">
            <input type="text" class="form-control form-control-sm mb-2" placeholder="Company" data-field="company">
        </div>
        <div class="mb-2">
            <input type="text" class="form-control form-control-sm mb-2" placeholder="Duration (e.g., Jan 2022 - Present)" data-field="duration">
        </div>
        <div class="mb-2">
            <textarea class="form-control form-control-sm" rows="3" placeholder="Description" data-field="description"></textarea>
        </div>
    `;

    entry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    container.appendChild(entry);
    updatePreview();
}

function addProject() {
    projectCount++;
    const container = document.getElementById('projectsContainer');
    const entry = document.createElement('div');
    entry.className = 'dynamic-entry';
    entry.dataset.id = projectCount;
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger remove-btn" onclick="removeEntry(this, 'project')">×</button>
        <div class="mb-2">
            <input type="text" class="form-control form-control-sm mb-2" placeholder="Project Name" data-field="name">
        </div>
        <div class="mb-2">
            <textarea class="form-control form-control-sm" rows="3" placeholder="Description" data-field="description"></textarea>
        </div>
    `;

    entry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    container.appendChild(entry);
    updatePreview();
}

function removeEntry(button, type) {
    button.closest('.dynamic-entry').remove();
    updatePreview();
}

// Update Preview
function updatePreview() {
    // Personal Info
    const fullName = document.getElementById('fullName').value || 'Your Name';
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    document.getElementById('preview-name').textContent = fullName;
    document.getElementById('preview-email').textContent = email;
    document.getElementById('preview-phone').textContent = phone;
    document.getElementById('preview-address').textContent = address;

    // Summary
    const summary = document.getElementById('summary').value;
    const summarySection = document.getElementById('preview-summary-section');
    if (summary) {
        document.getElementById('preview-summary').textContent = summary;
        summarySection.classList.remove('d-none');
    } else {
        summarySection.classList.add('d-none');
    }

    // Education
    updateEducationPreview();

    // Experience
    updateExperiencePreview();

    // Skills
    updateSkillsPreview();

    // Projects
    updateProjectsPreview();

    // Save to localStorage
    saveToLocalStorage();
}

function updateEducationPreview() {
    const container = document.getElementById('preview-education');
    const section = document.getElementById('preview-education-section');
    const entries = document.querySelectorAll('#educationContainer .dynamic-entry');

    if (entries.length === 0) {
        section.classList.add('d-none');
        return;
    }

    let hasContent = false;
    let html = '';

    entries.forEach(entry => {
        const degree = entry.querySelector('[data-field="degree"]').value;
        const institution = entry.querySelector('[data-field="institution"]').value;
        const year = entry.querySelector('[data-field="year"]').value;

        if (degree || institution || year) {
            hasContent = true;
            html += `
                <div class="preview-entry">
                    <h4>${degree || 'Degree'}</h4>
                    <div class="entry-subtitle">${institution || 'Institution'}</div>
                    <div class="entry-date">${year}</div>
                </div>
            `;
        }
    });

    if (hasContent) {
        container.innerHTML = html;
        section.classList.remove('d-none');
    } else {
        section.classList.add('d-none');
    }
}

function updateExperiencePreview() {
    const container = document.getElementById('preview-experience');
    const section = document.getElementById('preview-experience-section');
    const entries = document.querySelectorAll('#experienceContainer .dynamic-entry');

    if (entries.length === 0) {
        section.classList.add('d-none');
        return;
    }

    let hasContent = false;
    let html = '';

    entries.forEach(entry => {
        const title = entry.querySelector('[data-field="title"]').value;
        const company = entry.querySelector('[data-field="company"]').value;
        const duration = entry.querySelector('[data-field="duration"]').value;
        const description = entry.querySelector('[data-field="description"]').value;

        if (title || company || duration || description) {
            hasContent = true;
            html += `
                <div class="preview-entry">
                    <h4>${title || 'Job Title'}</h4>
                    <div class="entry-subtitle">${company || 'Company'}</div>
                    <div class="entry-date">${duration}</div>
                    ${description ? `<p>${description}</p>` : ''}
                </div>
            `;
        }
    });

    if (hasContent) {
        container.innerHTML = html;
        section.classList.remove('d-none');
    } else {
        section.classList.add('d-none');
    }
}

function updateSkillsPreview() {
    const skills = document.getElementById('skills').value;
    const container = document.getElementById('preview-skills');
    const section = document.getElementById('preview-skills-section');

    if (!skills.trim()) {
        section.classList.add('d-none');
        return;
    }

    const skillArray = skills.split(',').map(s => s.trim()).filter(s => s);

    if (skillArray.length > 0) {
        container.innerHTML = skillArray.map(skill =>
            `<span class="skill-tag">${skill}</span>`
        ).join('');
        section.classList.remove('d-none');
    } else {
        section.classList.add('d-none');
    }
}

function updateProjectsPreview() {
    const container = document.getElementById('preview-projects');
    const section = document.getElementById('preview-projects-section');
    const entries = document.querySelectorAll('#projectsContainer .dynamic-entry');

    if (entries.length === 0) {
        section.classList.add('d-none');
        return;
    }

    let hasContent = false;
    let html = '';

    entries.forEach(entry => {
        const name = entry.querySelector('[data-field="name"]').value;
        const description = entry.querySelector('[data-field="description"]').value;

        if (name || description) {
            hasContent = true;
            html += `
                <div class="preview-entry">
                    <h4>${name || 'Project Name'}</h4>
                    ${description ? `<p>${description}</p>` : ''}
                </div>
            `;
        }
    });

    if (hasContent) {
        container.innerHTML = html;
        section.classList.remove('d-none');
    } else {
        section.classList.add('d-none');
    }
}

// Reset Form
function resetForm() {
    if (confirm('Are you sure you want to reset all fields? This action cannot be undone.')) {
        document.getElementById('resumeForm').reset();
        document.getElementById('educationContainer').innerHTML = '';
        document.getElementById('experienceContainer').innerHTML = '';
        document.getElementById('projectsContainer').innerHTML = '';

        educationCount = 0;
        experienceCount = 0;
        projectCount = 0;

        addEducation();
        addExperience();
        addProject();

        updatePreview();
        localStorage.removeItem('resumeData');
    }
}

// Download PDF
async function downloadPDF() {
    const button = downloadBtn;
    const originalText = button.textContent;
    button.textContent = 'Generating PDF...';
    button.disabled = true;

    try {
        const preview = document.getElementById('resumePreview');
        const canvas = await html2canvas(preview, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: document.body.classList.contains('dark-mode') ? '#2d2d2d' : '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        const fileName = document.getElementById('fullName').value || 'Resume';
        pdf.save(`${fileName}_Resume.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// Local Storage
function saveToLocalStorage() {
    const data = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        education: getEntriesData('educationContainer'),
        experience: getEntriesData('experienceContainer'),
        projects: getEntriesData('projectsContainer'),
        template: currentTemplate
    };

    localStorage.setItem('resumeData', JSON.stringify(data));
}

function getEntriesData(containerId) {
    const entries = document.querySelectorAll(`#${containerId} .dynamic-entry`);
    const data = [];

    entries.forEach(entry => {
        const entryData = {};
        entry.querySelectorAll('[data-field]').forEach(field => {
            entryData[field.dataset.field] = field.value;
        });
        data.push(entryData);
    });

    return data;
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('resumeData');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').textContent = '☀️';
        themeToggle.innerHTML = '<span id="themeIcon">☀️</span> Light Mode';
    }

    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        document.getElementById('fullName').value = data.fullName || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('address').value = data.address || '';
        document.getElementById('summary').value = data.summary || '';
        document.getElementById('skills').value = data.skills || '';

        // Load education
        if (data.education && data.education.length > 0) {
            document.getElementById('educationContainer').innerHTML = '';
            educationCount = 0;
            data.education.forEach(edu => {
                addEducation();
                const entry = document.querySelector(`#educationContainer .dynamic-entry:last-child`);
                if (edu.degree) entry.querySelector('[data-field="degree"]').value = edu.degree;
                if (edu.institution) entry.querySelector('[data-field="institution"]').value = edu.institution;
                if (edu.year) entry.querySelector('[data-field="year"]').value = edu.year;
            });
        }

        // Load experience
        if (data.experience && data.experience.length > 0) {
            document.getElementById('experienceContainer').innerHTML = '';
            experienceCount = 0;
            data.experience.forEach(exp => {
                addExperience();
                const entry = document.querySelector(`#experienceContainer .dynamic-entry:last-child`);
                if (exp.title) entry.querySelector('[data-field="title"]').value = exp.title;
                if (exp.company) entry.querySelector('[data-field="company"]').value = exp.company;
                if (exp.duration) entry.querySelector('[data-field="duration"]').value = exp.duration;
                if (exp.description) entry.querySelector('[data-field="description"]').value = exp.description;
            });
        }

        // Load projects
        if (data.projects && data.projects.length > 0) {
            document.getElementById('projectsContainer').innerHTML = '';
            projectCount = 0;
            data.projects.forEach(proj => {
                addProject();
                const entry = document.querySelector(`#projectsContainer .dynamic-entry:last-child`);
                if (proj.name) entry.querySelector('[data-field="name"]').value = proj.name;
                if (proj.description) entry.querySelector('[data-field="description"]').value = proj.description;
            });
        }

        // Load template
        if (data.template) {
            changeTemplate(data.template);
        }

        updatePreview();
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}
// Data Storage (using localStorage)
const STORAGE_KEYS = {
    TEAMS: 'hackmate_teams',
    PROFILE: 'hackmate_profile',
    USER_TEAMS: 'hackmate_user_teams'
};

// Initialize data
let teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS)) || [];
let userProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE)) || {
    name: '',
    bio: '',
    skills: [],
    interests: []
};
let userTeams = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_TEAMS)) || [];

// View Management
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Load data for specific views
        if (viewName === 'browse') {
            renderTeams();
        } else if (viewName === 'profile') {
            loadProfile();
            renderUserTeams();
            renderRecommendations();
        }
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');
}

// Navigation event listeners
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        showView(view);
    });
});

// Skills/Interests Tag Management
function createTag(text, containerId, onRemove) {
    const container = document.getElementById(containerId);
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `
        ${text}
        <span class="tag-remove" data-tag="${text}">&times;</span>
    `;
    
    const removeBtn = tag.querySelector('.tag-remove');
    removeBtn.addEventListener('click', () => {
        tag.remove();
        if (onRemove) onRemove(text);
    });
    
    container.appendChild(tag);
    return tag;
}

function setupTagInput(inputId, tagsContainerId, onTagsChange) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(tagsContainerId);
    const tags = [];
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = input.value.trim();
            if (value && !tags.includes(value.toLowerCase())) {
                tags.push(value.toLowerCase());
                createTag(value, tagsContainerId, (removedTag) => {
                    const index = tags.indexOf(removedTag.toLowerCase());
                    if (index > -1) tags.splice(index, 1);
                    if (onTagsChange) onTagsChange([...tags]);
                });
                input.value = '';
                if (onTagsChange) onTagsChange([...tags]);
            }
        }
    });
    
    return () => tags;
}

// Team Creation Form
let createTeamSkills = [];
let createTeamInterests = [];

const createSkillsGetter = setupTagInput('skill-input', 'skills-tags', (tags) => {
    createTeamSkills = tags;
});

const createInterestsGetter = setupTagInput('interest-input', 'interests-tags', (tags) => {
    createTeamInterests = tags;
});

document.getElementById('create-team-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const teamData = {
        id: Date.now().toString(),
        name: document.getElementById('team-name').value,
        description: document.getElementById('team-description').value,
        type: document.getElementById('team-type').value,
        size: parseInt(document.getElementById('team-size').value),
        currentSize: 1,
        requiredSkills: createTeamSkills,
        interests: createTeamInterests,
        contactInfo: document.getElementById('contact-info').value,
        creator: userProfile.name || 'Anonymous',
        createdAt: new Date().toISOString()
    };
    
    teams.push(teamData);
    userTeams.push(teamData.id);
    saveData();
    
    // Reset form
    document.getElementById('create-team-form').reset();
    document.getElementById('skills-tags').innerHTML = '';
    document.getElementById('interests-tags').innerHTML = '';
    createTeamSkills = [];
    createTeamInterests = [];
    
    alert('Team created successfully!');
    showView('browse');
});

// Render Teams
function renderTeams(filteredTeams = null) {
    const container = document.getElementById('teams-container');
    const teamsToRender = filteredTeams || teams;
    
    if (teamsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No teams found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = teamsToRender.map(team => `
        <div class="team-card" data-team-id="${team.id}">
            <div class="team-header">
                <div>
                    <h3 class="team-name">${escapeHtml(team.name)}</h3>
                </div>
                <span class="team-type">${team.type}</span>
            </div>
            <p class="team-description">${escapeHtml(team.description)}</p>
            <div class="team-skills">
                ${team.requiredSkills.map(skill => 
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                ).join('')}
            </div>
            <div class="team-footer">
                <span class="team-size">${team.currentSize}/${team.size} members</span>
                <button class="btn-join" onclick="joinTeam('${team.id}')">Join Team</button>
            </div>
        </div>
    `).join('');
    
    // Add click listeners for team cards
    container.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-join')) {
                const teamId = card.getAttribute('data-team-id');
                showTeamDetails(teamId);
            }
        });
    });
}

// Search and Filter
document.getElementById('search-input')?.addEventListener('input', filterTeams);
document.getElementById('skill-filter')?.addEventListener('change', filterTeams);
document.getElementById('type-filter')?.addEventListener('change', filterTeams);

function filterTeams() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const skillFilter = document.getElementById('skill-filter').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value.toLowerCase();
    
    const filtered = teams.filter(team => {
        const matchesSearch = !searchTerm || 
            team.name.toLowerCase().includes(searchTerm) ||
            team.description.toLowerCase().includes(searchTerm) ||
            team.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm));
        
        const matchesSkill = !skillFilter || 
            team.requiredSkills.some(skill => skill.toLowerCase() === skillFilter);
        
        const matchesType = !typeFilter || team.type.toLowerCase() === typeFilter;
        
        return matchesSearch && matchesSkill && matchesType;
    });
    
    renderTeams(filtered);
}

// Join Team
function joinTeam(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    if (userTeams.includes(teamId)) {
        alert('You are already a member of this team!');
        return;
    }
    
    if (team.currentSize >= team.size) {
        alert('This team is full!');
        return;
    }
    
    team.currentSize++;
    userTeams.push(teamId);
    saveData();
    
    alert(`Successfully joined ${team.name}!`);
    renderTeams();
    renderUserTeams();
}

// Show Team Details Modal
function showTeamDetails(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    const modal = document.getElementById('team-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>${escapeHtml(team.name)}</h2>
        <p class="team-type" style="margin: 0.5rem 0;">${team.type}</p>
        <p style="margin: 1.5rem 0; color: var(--text-secondary);">${escapeHtml(team.description)}</p>
        
        <div style="margin: 1.5rem 0;">
            <h3 style="margin-bottom: 0.5rem;">Required Skills</h3>
            <div class="team-skills">
                ${team.requiredSkills.map(skill => 
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                ).join('')}
            </div>
        </div>
        
        ${team.interests.length > 0 ? `
            <div style="margin: 1.5rem 0;">
                <h3 style="margin-bottom: 0.5rem;">Interests</h3>
                <div class="team-skills">
                    ${team.interests.map(interest => 
                        `<span class="skill-tag">${escapeHtml(interest)}</span>`
                    ).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="margin: 1.5rem 0;">
            <p><strong>Team Size:</strong> ${team.currentSize}/${team.size} members</p>
            <p><strong>Created by:</strong> ${escapeHtml(team.creator)}</p>
            ${team.contactInfo ? `<p><strong>Contact:</strong> ${escapeHtml(team.contactInfo)}</p>` : ''}
        </div>
        
        ${!userTeams.includes(teamId) && team.currentSize < team.size ? `
            <button class="btn btn-primary" onclick="joinTeam('${teamId}'); closeModal();">Join Team</button>
        ` : userTeams.includes(teamId) ? `
            <p style="color: var(--success-color); font-weight: 600;">You are a member of this team</p>
        ` : `
            <p style="color: var(--warning-color);">This team is full</p>
        `}
    `;
    
    modal.classList.add('active');
}

// Close Modal
function closeModal() {
    document.getElementById('team-modal').classList.remove('active');
}

document.querySelector('.close-modal')?.addEventListener('click', closeModal);
document.getElementById('team-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'team-modal') {
        closeModal();
    }
});

// Profile Management
let profileSkills = [];
let profileInterests = [];

const profileSkillsGetter = setupTagInput('profile-skill-input', 'profile-skills-tags', (tags) => {
    profileSkills = tags;
});

const profileInterestsGetter = setupTagInput('profile-interest-input', 'profile-interests-tags', (tags) => {
    profileInterests = tags;
});

function loadProfile() {
    document.getElementById('profile-name').value = userProfile.name || '';
    document.getElementById('profile-bio').value = userProfile.bio || '';
    
    // Clear existing tags
    document.getElementById('profile-skills-tags').innerHTML = '';
    document.getElementById('profile-interests-tags').innerHTML = '';
    
    // Load skills
    profileSkills = userProfile.skills || [];
    profileSkills.forEach(skill => {
        createTag(skill, 'profile-skills-tags', (removedTag) => {
            const index = profileSkills.indexOf(removedTag.toLowerCase());
            if (index > -1) profileSkills.splice(index, 1);
        });
    });
    
    // Load interests
    profileInterests = userProfile.interests || [];
    profileInterests.forEach(interest => {
        createTag(interest, 'profile-interests-tags', (removedTag) => {
            const index = profileInterests.indexOf(removedTag.toLowerCase());
            if (index > -1) profileInterests.splice(index, 1);
        });
    });
}

document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    userProfile = {
        name: document.getElementById('profile-name').value,
        bio: document.getElementById('profile-bio').value,
        skills: profileSkills,
        interests: profileInterests
    };
    
    saveData();
    alert('Profile saved successfully!');
    renderRecommendations();
});

// Render User's Teams
function renderUserTeams() {
    const container = document.getElementById('my-teams-container');
    const myTeams = teams.filter(team => userTeams.includes(team.id));
    
    if (myTeams.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3>You haven't joined any teams yet</h3>
                <p>Browse teams or create your own to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = myTeams.map(team => `
        <div class="team-card" data-team-id="${team.id}">
            <div class="team-header">
                <div>
                    <h3 class="team-name">${escapeHtml(team.name)}</h3>
                </div>
                <span class="team-type">${team.type}</span>
            </div>
            <p class="team-description">${escapeHtml(team.description)}</p>
            <div class="team-skills">
                ${team.requiredSkills.map(skill => 
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                ).join('')}
            </div>
            <div class="team-footer">
                <span class="team-size">${team.currentSize}/${team.size} members</span>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const teamId = card.getAttribute('data-team-id');
            showTeamDetails(teamId);
        });
    });
}

// Recommendations Algorithm
function renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    const userSkills = userProfile.skills || [];
    const userInterests = userProfile.interests || [];
    
    if (userSkills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Add skills to your profile to get personalized team recommendations!</p>
            </div>
        `;
        return;
    }
    
    // Calculate match scores
    const recommendations = teams
        .filter(team => !userTeams.includes(team.id) && team.currentSize < team.size)
        .map(team => {
            let score = 0;
            
            // Skill matching (higher weight)
            const matchingSkills = team.requiredSkills.filter(skill => 
                userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
            );
            score += matchingSkills.length * 10;
            
            // Interest matching
            const matchingInterests = team.interests.filter(interest => 
                userInterests.some(ui => ui.toLowerCase() === interest.toLowerCase())
            );
            score += matchingInterests.length * 5;
            
            // Bonus for teams that need skills the user has
            const neededSkills = team.requiredSkills.filter(skill => 
                !team.requiredSkills.some(rs => rs.toLowerCase() === skill.toLowerCase()) ||
                userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
            );
            
            return { team, score, matchingSkills, matchingInterests };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(item => item.team);
    
    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎯</div>
                <h3>No recommendations found</h3>
                <p>Try adding more skills or interests to your profile</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recommendations.map(team => `
        <div class="team-card" data-team-id="${team.id}">
            <div class="team-header">
                <div>
                    <h3 class="team-name">${escapeHtml(team.name)}</h3>
                </div>
                <span class="team-type">${team.type}</span>
            </div>
            <p class="team-description">${escapeHtml(team.description)}</p>
            <div class="team-skills">
                ${team.requiredSkills.map(skill => 
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                ).join('')}
            </div>
            <div class="team-footer">
                <span class="team-size">${team.currentSize}/${team.size} members</span>
                <button class="btn-join" onclick="joinTeam('${team.id}')">Join Team</button>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-join')) {
                const teamId = card.getAttribute('data-team-id');
                showTeamDetails(teamId);
            }
        });
    });
}

// Save Data to LocalStorage
function saveData() {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    localStorage.setItem(STORAGE_KEYS.USER_TEAMS, JSON.stringify(userTeams));
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize with sample data if empty
if (teams.length === 0) {
    teams = [
        {
            id: '1',
            name: 'AI Innovation Squad',
            description: 'Building an AI-powered solution for healthcare using machine learning and natural language processing.',
            type: 'hackathon',
            size: 5,
            currentSize: 2,
            requiredSkills: ['python', 'machine learning', 'react', 'nodejs'],
            interests: ['ai', 'healthcare', 'innovation'],
            contactInfo: 'ai-squad@example.com',
            creator: 'Alex Chen',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Blockchain Builders',
            description: 'Creating a decentralized application for supply chain transparency using blockchain technology.',
            type: 'project',
            size: 4,
            currentSize: 3,
            requiredSkills: ['blockchain', 'javascript', 'solidity', 'web3'],
            interests: ['blockchain', 'crypto', 'supply-chain'],
            contactInfo: 'blockchain@example.com',
            creator: 'Sam Johnson',
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            name: 'Design & Dev Duo',
            description: 'Looking for a designer and developer to create a beautiful mobile app for productivity.',
            type: 'startup',
            size: 3,
            currentSize: 1,
            requiredSkills: ['design', 'react', 'javascript', 'ui/ux'],
            interests: ['mobile', 'productivity', 'design'],
            contactInfo: 'design@example.com',
            creator: 'Jordan Smith',
            createdAt: new Date().toISOString()
        }
    ];
    saveData();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    showView('home');
});
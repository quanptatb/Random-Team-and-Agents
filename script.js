// Array of all members
const members = ['Cua', 'Hoàng', 'Nẻo', 'Hào', 'Cáo', 'Linh'];

// Valorant agents
const valorantAgents = [
    'Jett', 'Phoenix', 'Sage', 'Sova', 'Viper', 'Cypher', 'Reyna', 'Killjoy',
    'Breach', 'Omen', 'Brimstone', 'Raze', 'Skye', 'Yoru', 'Astra', 'KAY/O',
    'Chamber', 'Neon', 'Fade', 'Harbor', 'Gekko', 'Deadlock', 'Iso', 'Clove',
    'Vyse', 'Tejo', 'Veto', 'Waylay'
];

// Store agent assignments for each member
const memberAgents = {};

// Get DOM elements
const generateBtn = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const team1Members = document.getElementById('team1Members');
const team2Members = document.getElementById('team2Members');
const membersGrid = document.getElementById('membersGrid');

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get random agent for a member
function getRandomAgent(usedAgents = []) {
    const availableAgents = valorantAgents.filter(agent => !usedAgents.includes(agent));
    return availableAgents[Math.floor(Math.random() * availableAgents.length)];
}

// Assign random agents to all members
function assignRandomAgents() {
    const usedAgents = [];
    members.forEach(member => {
        if (!memberAgents[member] || memberAgents[member] === '') {
            const agent = getRandomAgent(usedAgents);
            memberAgents[member] = agent;
            usedAgents.push(agent);
            updateAgentDisplay(member);
        }
    });
}

// Update agent display for a member
function updateAgentDisplay(member) {
    const memberCard = document.querySelector(`.member-card[data-member="${member}"]`);
    if (memberCard) {
        const agentDisplay = memberCard.querySelector('.agent-display');
        const noAgentBtn = memberCard.querySelector('.no-agent-btn');
        const resetBtn = memberCard.querySelector('.reset-agent-btn');

        if (memberAgents[member] === 'NO_AGENT') {
            agentDisplay.innerHTML = '<span class="no-agent-text">Không có tướng</span>';
            noAgentBtn.style.display = 'none';
            resetBtn.style.display = 'inline-flex';
            memberCard.classList.add('no-agent');
        } else if (memberAgents[member]) {
            agentDisplay.innerHTML = `<span class="agent-name">🎮 ${memberAgents[member]}</span>`;
            noAgentBtn.style.display = 'inline-flex';
            resetBtn.style.display = 'none';
            memberCard.classList.remove('no-agent');
        } else {
            agentDisplay.innerHTML = '';
            noAgentBtn.style.display = 'none';
            resetBtn.style.display = 'none';
            memberCard.classList.remove('no-agent');
        }
    }
}

// Create member element for team display
function createTeamMemberElement(name, index) {
    const memberDiv = document.createElement('div');
    memberDiv.className = 'team-member';
    const agent = memberAgents[name] || '';
    const agentText = agent === 'NO_AGENT' ? '⛔ Không có tướng' : (agent ? `🎮 ${agent}` : '');
    memberDiv.innerHTML = `
        <span class="member-number">${index + 1}</span>
        <div class="member-info">
            <span class="member-team-name">${name}</span>
            ${agentText ? `<span class="member-team-agent">${agentText}</span>` : ''}
        </div>
    `;
    return memberDiv;
}

// Add shuffle animation to member cards
function animateShuffle() {
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'shake 0.5s ease-in-out';
            }, 10);
        }, index * 50);
    });
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-10px) rotate(-5deg); }
        75% { transform: translateX(10px) rotate(5deg); }
    }
`;
document.head.appendChild(style);

// Generate random teams
function generateTeams() {
    // Get selected mode
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const requiredCount = mode === '5' ? 5 : 6;

    // Get selected members
    const selectedMembers = [];
    document.querySelectorAll('.member-card').forEach(card => {
        const checkbox = card.querySelector('.member-checkbox');
        if (checkbox && checkbox.checked) {
            selectedMembers.push(card.dataset.member);
        }
    });

    // Validate selected member count
    if (selectedMembers.length < requiredCount) {
        alert(`Vui lòng chọn ít nhất ${requiredCount} người cho chế độ này!`);
        return;
    }

    // Use selected members
    let activeMembers = selectedMembers;

    // If more members selected than needed, use only required count
    if (activeMembers.length > requiredCount) {
        activeMembers = activeMembers.slice(0, requiredCount);
    }

    // Assign random agents first
    assignRandomAgents();

    // Add shuffle animation
    animateShuffle();

    // Disable button during generation
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.6';
    generateBtn.style.cursor = 'not-allowed';

    // Wait for animation to complete
    setTimeout(() => {
        // Shuffle members
        const shuffled = shuffleArray(activeMembers);

        // Clear previous results
        team1Members.innerHTML = '';
        team2Members.innerHTML = '';

        if (mode === '5') {
            // Single team of 5
            const team1 = shuffled.slice(0, 5);

            // Update team 1 title
            document.querySelector('.team-1 .team-title').textContent = 'Team (5 người)';

            // Add members to Team 1
            team1.forEach((member, index) => {
                team1Members.appendChild(createTeamMemberElement(member, index));
            });

            // Hide Team 2
            document.querySelector('.team-2').style.display = 'none';
        } else {
            // Two teams of 3
            const team1 = shuffled.slice(0, 3);
            const team2 = shuffled.slice(3, 6);

            // Update team titles
            document.querySelector('.team-1 .team-title').textContent = 'Team 1';

            // Add members to Team 1
            team1.forEach((member, index) => {
                team1Members.appendChild(createTeamMemberElement(member, index));
            });

            // Add members to Team 2
            team2.forEach((member, index) => {
                team2Members.appendChild(createTeamMemberElement(member, index));
            });

            // Show Team 2
            document.querySelector('.team-2').style.display = 'block';
        }

        // Show results section with animation
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Re-enable button
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
        generateBtn.style.cursor = 'pointer';

        // Update button text
        generateBtn.querySelector('.btn-text').textContent = 'Chia lại đội';
    }, 800);
}

// Add event listener to generate button
generateBtn.addEventListener('click', generateTeams);

// Add hover effect to member cards
const memberCards = document.querySelectorAll('.member-card');
memberCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.05)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add keyboard support for accessibility
generateBtn.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        generateTeams();
    }
});

// Add confetti effect on generation (optional enhancement)
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';

        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

// Optional: Add confetti to the generate function
const originalGenerateTeams = generateTeams;
generateTeams = function () {
    createConfetti();
    originalGenerateTeams();
};

// Handle "No Agent" button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('no-agent-btn')) {
        const memberCard = e.target.closest('.member-card');
        const member = memberCard.dataset.member;
        memberAgents[member] = 'NO_AGENT';
        updateAgentDisplay(member);
    }

    // Handle individual reset button clicks
    if (e.target.classList.contains('reset-agent-btn')) {
        const memberCard = e.target.closest('.member-card');
        const member = memberCard.dataset.member;

        // Get all currently used agents except this member's
        const usedAgents = Object.entries(memberAgents)
            .filter(([name, agent]) => name !== member && agent !== 'NO_AGENT' && agent)
            .map(([_, agent]) => agent);

        // Assign new random agent
        const newAgent = getRandomAgent(usedAgents);
        memberAgents[member] = newAgent;
        updateAgentDisplay(member);

        // Add a little animation
        memberCard.style.animation = 'none';
        setTimeout(() => {
            memberCard.style.animation = 'shake 0.5s ease-in-out';
        }, 10);
    }
});

// src/utils/calculateSkillLevel.js
export default function calculateSkillLevel(stats) {
    const level = Math.floor((stats.totalProgressions || 0) / 10) + Math.floor((stats.practiceHours || 0) / 5);
    return `${Math.min(level, 10)}/10`;
}
const mongoose = require("mongoose");
const { Task } = require("../models");
const featureNames = [
  "Dynamic weather system affecting gameplay",
  "Procedurally generated dungeons",
  "Day-night cycle with realistic lighting effects",
  "Interactive NPCs with individual personalities and routines",
  "Branching storyline with multiple endings",
  "Customizable player character creation",
  "Realistic physics engine for immersive gameplay",
  "Seamless open-world exploration",
  "Tactical combat system with strategic elements",
  "Base building and management mechanics",
  "Companion system allowing players to recruit allies",
  "Crafting system for creating weapons, armor, and items",
  "Stealth mechanics for covert operations",
  "Vehicle customization and driving mechanics",
  "Deep skill tree with diverse abilities and talents",
  "Minigames and side activities for additional content",
  "Survival mechanics such as hunger, thirst, and fatigue",
  "Multiplayer cooperative missions and PvP battles",
  "Dynamic economy influenced by player actions",
  "Photo mode for capturing stunning in-game moments",
  "Pet system allowing players to tame and train creatures",
  "Time travel mechanic for exploring different eras",
  "Virtual reality support for an immersive experience",
  "Augmented reality integration for real-world interactions",
  "Puzzle-solving challenges with unique mechanics",
  "Character relationships affecting gameplay and story",
  "Global events shaping the game world",
  "Voice recognition for in-game commands",
  "Dynamic soundtrack adapting to player actions",
  "Faction system with reputation and allegiance mechanics",
  "Player-driven economy with trading and commerce",
  "Territory control and faction warfare",
  "Genetic engineering allowing players to modify traits",
  "Psychological profiling affecting NPC interactions",
  "Interstellar travel and exploration of alien worlds",
  "Time manipulation mechanics for solving puzzles",
  "Parkour and free-running mechanics for fluid movement",
  "Diplomacy system for resolving conflicts peacefully",
  "Massively multiplayer online battles with thousands of players",
  "Environmental destruction and building collapse physics",
  "Character aging and generational gameplay",
  "Virtual assistant AI providing in-game guidance",
  "Player-driven politics and governance systems",
  "Dreamscape exploration with surreal environments",
  "Alternate reality investigations blending fiction with reality",
  "Dynamic dialogue system with branching conversations",
  "Weather manipulation powers for strategic advantage",
  "Psychological horror elements for intense immersion",
  "Character memory system affecting narrative choices",
  "Sandbox mode for unlimited creativity and experimentation",
];


// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function getShortName(inputString) {
    inputString = inputString.trim();
    const words = inputString.split(/\s+/);
    return words.slice(0, 2).join(' ');
}

const makeFeature = async (userData, discData) => {
    const featureName = getRandomArrItem(featureNames);
    const shortName = getShortName(featureName);
    const designLink = "https://docs.google.com/document/d/17LGOvITM8BF1pjvhY4s8lX7h9N9joVYRICFQmjDRfYQ/edit?usp=sharing"
    const duration = Math.floor(Math.random() * 14 + 1);
    
    const taskIds = [];
    const tasks = [];
    for (let i = 1; i < userData.length; i++) {
        const task = {
            _id: new mongoose.Types.ObjectId(),
            name: `${shortName} - ${discData[i].name}`,
            resource: userData[i]._id,
            estimate: Math.floor(duration * 0.8),
            commitment: duration,
            design: designLink,
        }
        taskIds.push(task._id);
        tasks.push(task);
    }
    
    const feature = {
        _id: new mongoose.Types.ObjectId(),
        name: featureName,
        owner: userData[0]._id,
        tasks: taskIds,
    };

    await Task.collection.insertMany(tasks);

    return feature;
}

module.exports = makeFeature;


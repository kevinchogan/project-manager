const mongoose = require("mongoose");
require('dotenv').config();

const db = require("../config/connection");
const { User, Project, Discipline, Feature, Milestone } = require("../models");
const cleanDB = require("./cleanDB");
const makeUser = require("./users");
const makeFeature = require("./features");

const populateDisciplineData = async () => {
    const disciplines = ["Designer", "Concept Artist", "Object Modeler", "Animator", "FX Artist", "Systems Engineer", "Gameplay Engineer"];
    const discData = []
    for (let i=0; i < disciplines.length; i++) {
        const id = new mongoose.Types.ObjectId();
        discData.push({
            _id: id,
            name: disciplines[i],
        })
    }   
    return discData; 
}

const populateUserData = async (discData) => {
    const userData = []
    for (let i = 0; i < discData.length; i++) {
        newUser = await makeUser(discData[i]._id)
        userData.push(newUser);
    } 
    return userData; 
}

const populateProjectData = async (userData, discData) => {
    const projects = [];
    const milestones = [];
    const milestoneIds = [];
    for (let i = 0; i < 2; i++) {
        const id = new mongoose.Types.ObjectId();
        const name = `Milestone ${i + 1}`;
        const dueDate = new Date(2024, 5, 1, 12, 0, 0 ,0);
        const features = [];
        const featureIds = [];
        for (let j = 0; j < 3; j++) {
            features[j] = await makeFeature(userData, discData);
            featureIds[j] = features[j]._id;
        }
        milestones[i] = {
            _id: id,
            name: name,
            due_date: dueDate,
            features: featureIds,
        }
        milestoneIds[i] = id;
        await Feature.collection.insertMany(features);
    }

    const dueDate = new Date(2024, 5, 1, 12, 0, 0 ,0);
    projects[0] = {
        _id: new mongoose.Types.ObjectId(),
        name: "Mandalorian",
        owner: userData[0]._id,
        due_date: dueDate,
        milestones: milestoneIds,
    }
    await Milestone.collection.insertMany(milestones);
    return projects
}

db.once("open", async () => {
    try {
        await cleanDB("Discipline", "disciplines");
        await cleanDB("User", "users");
        await cleanDB("Project", "projects");
        await cleanDB("Milestone", "milestones");
        await cleanDB("Task", "tasks");
        await cleanDB("Feature", "features");

        const discData = await populateDisciplineData();
        const userData = await populateUserData(discData);
        const projData = await populateProjectData(userData, discData);

        await Discipline.collection.insertMany(discData);
        await User.collection.insertMany(userData);
        await Project.collection.insertMany(projData);

        console.log("Seed data has been added!");
        process.exit(0);
    } catch (err) {
        console.error(err);
    }
    process.exit(1);
})
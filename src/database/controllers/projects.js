const { Project } = require("../models");

const getProject = async () => {
  return await Project.findOne();
};

const getProjectById = async (projectId) => {
  return await Project.findOne({ projectId });
};

const getAllProjects = async () => {
  return await Project.find();
};

const createProject = async (data) => {
  const project = new Project(data);
  return await project.save();
};

const deleteProjectById = async (projectId) => {
  const result = await Project.deleteOne({ projectId });
  if (result.deletedCount === 1) {
    return { message: "Project successfully deleted" };
  } else {
    return { message: "Project not found" };
  }
};

const deleteAllProjects = async () => {
  const result = await Project.deleteMany({});
  if (result.deletedCount > 0) {
    return {
      message: `${result.deletedCount} projects successfully deleted`,
    };
  } else {
    return { message: "No projects found" };
  }
};

module.exports = {
  getProject,
  createProject,
  getProjectById,
  getAllProjects,
  deleteProjectById,
  deleteAllProjects,
};

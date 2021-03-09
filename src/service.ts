import { Project } from "./schema";

const state: Project[] = [];

export const service = {
  async findProjectAll() {
    return state;
  },
  async findProjectById(id: string) {
    const project = state.find((it) => it.id === id);
    if (project) {
      return project;
    } else {
      throw new Error("Cannot find project");
    }
  },
  async createProject(project: Project) {
    state.push(project);
    return;
  },
};

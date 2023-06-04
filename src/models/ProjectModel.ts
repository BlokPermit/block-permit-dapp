import { Project, User } from "@prisma/client";
import { AssessmentProviderModel } from "./AssessmentProviderModel";

export interface ProjectModel {
  baseProject: Project;
  projectPhase: ProjectPhase;
  projectManager?: User;
  assessmentProviders: AssessmentProviderModel[];
}

export enum ProjectPhase {
  PHASE_1 = 1,
  PHASE_2 = 2,
  PHASE_3 = 3,
}

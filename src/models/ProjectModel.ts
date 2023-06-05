import { Project, User } from "@prisma/client";
import {DocumentContractModel} from "./DocumentContractModel";

export interface ProjectModel {
  baseProject: Project;
  projectManager: User;
  assessmentProviders: User[];
  numOfAssessmentProviders: number;
  administrativeAuthority: User | null;
  DPPUrl: string | null;
  sentDPPs: DocumentContractModel[];
  numOfAssessedDPPs: number;
  DGDUrl: string | null;
  sentDGDs: DocumentContractModel[];
  numOfAssessedDGDs: number;
}


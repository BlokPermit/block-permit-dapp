import { Project, User } from "@prisma/client";
import {DocumentContractModel} from "./DocumentContractModel";

export interface ProjectModel {
  baseProject: Project;
  projectManager: User;
  assessmentProviders: User[];
  numOfAssessmentProviders: number;
  administrativeAuthority?: User;
  DPPUrl?: string;
  sentDPPs?: DocumentContractModel[];
  numOfAssessedDPPs: number;
  DGDUrl?: string;
  sentDGDs?: DocumentContractModel[];
  numOfAssessedDGDs: number;
}


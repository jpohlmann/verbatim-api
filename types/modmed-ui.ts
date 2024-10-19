export type AuthCookies = {
    jsessionid: string;
    csid: string;
    gdpr: string;
};


export type DiagnosisRequest = {
    visit: {
      id: number;
    };
    diagnosisName: string;
    id?: number;
    diagnosis: {
      diagnosisName: string;
      labelOffsetY: number;
      uncertainDiagnosisName: string;
      labelOffsetX: number;
      labelText: string;
      requiresBodyLocation: boolean;
      id: number;
      diagnosisLabel: string;
      icd9: string;
    };
    diagnosisBodyLocations: any[];
    procedures: {
      procedure: string;
      id?: number;
      veProcedure: {
        name: string;
        id: number;
        labelColor: string;
        labelText: string;
        labelVisible: boolean;
        pathologyReq: boolean;
        procedureAlias: string;
        requiresBodyLocation: boolean;
      };
      procedureBodyLocations: any[];
    }[];
  };
export type DiagnosisResponse = {
    diagnosisName: string;
    id: number;
    position: number;
    diagnosisNameWithRO: string;
    procedures?: {
      procedure: string;
      veProcedure: {
        name: string;
        id: number;
        labelColor: string;
        labelText: string;
        labelVisible: boolean;
        pathologyReq: boolean;
        procedureAlias: string;
        requiresBodyLocation: boolean;
      };
      procedureBodyLocations: any[];
    }[];
}

export type VisitProcedureMetadataOption = {
  nestedResponses: any[];
  veVisitProcedureMetadataOptionResponseId?: number;
  stickyValues: boolean;
  optionValue: string;
  cdsmCheck: boolean;
  defaultOption: boolean;
  textAreaValue?: string;
  id: number;
};

export type VisitProcedureMetadata = {
  rangeStart: number;
  tabLabel: string;
  hidden: boolean;
  procedureMetadataGCodeList: any[];
  type: string;
  required: boolean;
  veVisitProcedureMetadataResponseId: string;
  rangeEnd: number;
  variableType: string;
  stickyValues: boolean;
  options: VisitProcedureMetadataOption[];
  perLocation: boolean;
  id: number;
  cols: number;
  events: any[];
  selected: boolean;
  procedureMetadataGCodeModifierList: any[];
  metadataFindings: any[];
  variableName: string;
  rangeIncrement: number;
  validatorRequired: boolean;
  bodyClickAware: boolean;
  inventoryToggle: boolean;
  validatorNumeric: boolean;
  rows: number;
  forceUnchecked: boolean;
  variableLabel: string;
  defaultValue?: string;
  value?: string;
};

export type ProcedureFacade = {
  metadata: VisitProcedureMetadata[];
  inventoryEnabled: boolean;
  labelText: string;
  linkedExamSet: boolean;
  procedureCount: number;
  planMorphology: boolean;
  showInventory: boolean;
  title: string;
  controllerResponse: string;
  rfcPlan: boolean;
  procedureName: string;
  requiresBodyLocation: boolean;
  additionalData: boolean;
  id: number;
  importInjectionData: boolean;
  additionalDataPerLocation: boolean;
  popular: boolean;
  labelVisible: boolean;
  associateToImpression: boolean;
  procedureAlias: string;
  previousPlan: boolean;
  procedureInfoDto: { procedureAlertDtoList: any[] };
  bodyClickAware: boolean;
  label: string;
  metadataPerBodyLocation: any[];
  labelColor: string;
  mapMetadataPerBodyLocation: { [key: string]: any };
  labelOffsetY: number;
  labelOffsetX: number;
  pathologyReq: boolean;
};

export type VisitDiagnosis = {
  diagnosisName: string;
  visitDiagnosisReferrals: any[];
  diagnosis: {
    diagnosisName: string;
    labelOffsetY: number;
    uncertainDiagnosisName: string;
    labelOffsetX: number;
    labelText: string;
    id: number;
  };
  problemAddressedDisplay: {
    label: string;
    value: string;
  };
  visitDiagnosisFaxes: any[];
  id: number;
  position: number;
  visitDiagnosisAssociatedTests: any[];
  diagnosisNameWithRO: string;
};

export type VisitDiagnosisProcedure = {
  procedureBodyLocations: any[];
  visitDiagnosis: VisitDiagnosis;
  visitProcedureAlerts: any[];
  id: number;
  procedure: string;
  position: number;
  visitDiagnosisAssociatedTests: any[];
  group: boolean;
};

export type Procedure = {
  procedureAlias: string;
  labelOffsetY: number;
  labelOffsetX: number;
  groupedResults: boolean;
  labelText: string;
  name: string;
  id: number;
  labelColor: string;
};

export type Patient = {
  lastName: string;
  gender: string;
  sex: string;
  mrn: string;
  fullName: string;
  dateOfBirth: string;
  pmsId: string;
  displayDateOfBirth: string;
  ssn: string;
  firstName: string;
  name: string;
  id: number;
  testUser: boolean;
  username: string;
};

export type MedicalSubdomainProperties = {
  usingDiagnosisNameForLabel: boolean;
  hasDrawingTools: boolean;
  showScaleMeasurementValue: boolean;
  usingUrinalysisPlan: boolean;
  findingsTitle: string;
  manualFollowUpSpecialty: boolean;
  previousFindingsTitle: string;
  ocular: boolean;
  usingHpiRosCardStatus: boolean;
  usingFindings: boolean;
  diagnosisLabels: {
    plural: string;
    singular: string;
    withArticle: string;
  };
  awaitingDiagnosisLabel: string;
  hasSpecialPlans: boolean;
  domainLogo: string;
  usingGroupedResults: boolean;
  usingNewMethodOfDisplayingVisitMorphologies: boolean;
  defaultGender: string;
  diagnosesLabel: string;
  diagnosisClasses: {
    title: string;
    type: string;
  }[];
  EMABrand: string;
  findingsLabel: {
    plural: string;
    singular: string;
    withArticle: string;
  };
  usingOrderXRay: boolean;
  showPrettyTitleInAssessment: boolean;
};

export type Visit = {
  medicalSubdomain: string;
  medicalDomain: string;
  visitTypeLabel: string;
  copyForward: boolean;
  patient: Patient;
  medicalSubdomainProperties: MedicalSubdomainProperties;
  medicalDomainTyped: string;
  visitDate: string;
  id: number;
  facility: {
    visible: boolean;
    facilityId: number;
    primaryFacility: boolean;
    name: string;
    timeZone: string;
    id: number;
  };
  visitType: string;
};

export type Diagnosis = {
  diagnosisName: string;
  labelOffsetY: number;
  uncertainDiagnosisName: string;
  labelOffsetX: number;
  labelText: string;
  id: number;
};

export type ProcedureModalResponse = {
  autoFaxEnabled: boolean;
  veProcedureFacade: ProcedureFacade;
  veVisitDiagnosisProcedure: VisitDiagnosisProcedure;
  veProcedure: Procedure;
  visit: Visit;
  id: number;
  veDiagnosis: Diagnosis;
  inventoryProcedure: boolean;
};

type VeProcedureMetadataOption = {
  id: number;
};

type VeVisitProcedureMetadataOptionResponse = {
  veProcedureMetadataOption: VeProcedureMetadataOption;
  textareaValue: string;
};

type VeProcedureMetadata = {
  id: number;
};

type VeVisitProcedureMetadataResponse = {
  id: string;
  veProcedureMetadata: VeProcedureMetadata;
  veVisitProcedureMetadataOptionResponses: VeVisitProcedureMetadataOptionResponse[];
};

export type VisitProcedure = {
  id: number;
  veVisitProcedureMetadataResponse: VeVisitProcedureMetadataResponse[];
  visitProcedureAlerts: any[];
};

export type ProcedureAddResponse = {
  id: number;
  procedure: string;
  position: number;
  group: boolean;
}

type ProcedureInfoDto = {
  procedureAlertDtoList: any[];
};

type SuggestedProcedure = {
  inventoryEnabled: boolean;
  procedureCount: number;
  labelText: string;
  linkedExamSet: boolean;
  planMorphology: boolean;
  showInventory: boolean;
  title: string;
  rfcPlan: boolean;
  procedureName: string;
  requiresBodyLocation: boolean;
  id: number;
  additionalData: boolean;
  importInjectionData: boolean;
  additionalDataPerLocation: boolean;
  popular: boolean;
  labelVisible: boolean;
  procedureAlias: string;
  associateToImpression: boolean;
  previousPlan: boolean;
  procedureInfoDto: ProcedureInfoDto;
  bodyClickAware: boolean;
  label: string;
  labelColor: string;
  labelOffsetY: number;
  labelOffsetX: number;
  pathologyReq: boolean;
};

export type FollowUpData = {
  followUpValue: number;
  suggestedProcedures: SuggestedProcedure[];
  promptICD10Search: boolean;
  requiresBodyLocation: boolean;
  visualDxId: number;
  id: number;
  hiddenProcedures: any[];
  visualDxModuleId: number;
};

type VeProcedure = {
  name: string;
  id: number;
  labelColor: string;
  labelText: string;
  labelVisible: boolean;
  pathologyReq: boolean;
  procedureAlias: string;
  requiresBodyLocation: boolean;
};

export type ProcedureData = {
  procedure: string;
  veProcedure: VeProcedure;
  procedureBodyLocations: any[];
};
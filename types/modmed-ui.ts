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
    diagnosisBodyLocations: any[];  // Adjust as needed if you know the structure of items in this array
    procedures: {
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
      procedureBodyLocations: any[];  // Adjust as needed if you know the structure of items in this array
    }[];
  };
export type DiagnosisResponse = {
    diagnosisName: string;
    id: number;
    position: number;
    diagnosisNameWithRO: string;
}
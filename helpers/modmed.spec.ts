import {expect, test} from '@jest/globals';
import { FollowUpData, ProcedureModalResponse, VisitProcedure } from '../types/modmed-ui';
import { findCounselingMedicationInProcedureModal, getCounselingProcedure, mapDrugToMedicationConsultation } from './modmed';
test('Creates visitProcedure from drug', () => {
    const modalResponse: ProcedureModalResponse = require('../testdata/medication-modal-response.json');
    const result = findCounselingMedicationInProcedureModal('Ketoconazole', modalResponse, 1599);
    expect(result).toBeTruthy();
    if (result) {
        expect((result as VisitProcedure).id).toEqual(1599);
        expect((result as VisitProcedure).veVisitProcedureMetadataResponse[0]
            .veVisitProcedureMetadataOptionResponses[0]
            .textareaValue
        ).toContain('Ketoconazole Counseling');
    }
});

test('Finds counseling', () => {
    const followUpData: FollowUpData = require('../testdata/suggested-procedures.json');
    const result = getCounselingProcedure(followUpData, 'Tinea Versicolor');
    expect(result).toBeTruthy();
    if (result) {
        expect(result.procedure).toEqual("Counseling - Tinea Versicolor");
        expect(result.veProcedure.id).toEqual(1262);
    }
});

test('Maps drugs properly', () => {
    const result = mapDrugToMedicationConsultation('Tretinoin');
    expect(result).toEqual('Retinoids');
});

test('Maps drugs properly Clobetasol Propionate', () => {
    const result = mapDrugToMedicationConsultation('Clobetasol Propionate');
    expect(result).toEqual('Topical Steroids');
});

test('Finds Rituxan counseling', () => {
    const diagnosisProcedureId = 1234;
    const procedureModalResult = require('../testdata/medication-modal-response.json');
    const counselingMedication = findCounselingMedicationInProcedureModal(
        mapDrugToMedicationConsultation("Rituxan"), 
        procedureModalResult, 
        diagnosisProcedureId
    );
    expect(counselingMedication).toBeTruthy();
    expect((counselingMedication as VisitProcedure).veVisitProcedureMetadataResponse[0].id).toEqual('63679');
    expect((counselingMedication as VisitProcedure).veVisitProcedureMetadataResponse[0].veProcedureMetadata.id).toEqual(228360);
    expect((counselingMedication as VisitProcedure).veVisitProcedureMetadataResponse[0].veVisitProcedureMetadataOptionResponses[0].veProcedureMetadataOption.id).toEqual(1557937);
    expect((counselingMedication as VisitProcedure).veVisitProcedureMetadataResponse[0].veVisitProcedureMetadataOptionResponses[0].textareaValue).toContain('Rituxan Counseling');
});


test('Sets Topical Steroids', () => {
    const diagnosisProcedureId = 1234;
    const procedureModalResult = require('../testdata/medication-modal-response.json');
    const counselingMedication = findCounselingMedicationInProcedureModal(
        mapDrugToMedicationConsultation("Topical Steroids"), 
        procedureModalResult, 
        diagnosisProcedureId
    );
    expect(counselingMedication).toBeTruthy();
    expect((counselingMedication as VisitProcedure).veVisitProcedureMetadataResponse[0].id).toEqual('63790');
    expect((counselingMedication as VisitProcedure).veVisitProcedureMetadataResponse[0].veProcedureMetadata.id).toEqual(228358);
    expect((counselingMedication as VisitProcedure).veVisitProcedureMetadataResponse[0].veVisitProcedureMetadataOptionResponses[0].veProcedureMetadataOption.id).toEqual(1370564);
    expect((counselingMedication as VisitProcedure).veVisitProcedureMetadataResponse[0].veVisitProcedureMetadataOptionResponses[0].textareaValue).toContain('Topical Steroids Counseling');
});

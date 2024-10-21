import {expect, test} from '@jest/globals';
import { FollowUpData, ProcedureModalResponse, VisitProcedure } from '../types/modmed-ui';
import { findCounselingMedicationInProcedureModal, getCounselingProcedure } from './modmed';
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
///<reference types="cypress" />
import Chance from 'chance';
const chance = new Chance();

//describes the test sweeps
describe('test starter', ()=> {

//expect(2).to.equal(2);
    //redirecter tilbage til url
    beforeEach(() => {
        cy.visit('http://localhost/create');
    });

    //Describe a specification or test-case with the given title and callback fn acting as a thunk.
    it('Fill create form and send', () => {

        // Click login button
        cy.get('button').contains('Login')
            .click();

        cy.url().should('include', 'login');

        cy.get('input[name=loginfmt]').type(email);


    })



})
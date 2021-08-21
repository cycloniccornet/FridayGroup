
//Intelligent code completion
///<reference types="cypress" />
import Chance from 'chance';
const chance = new Chance();

const randomstring = require('randomstring');

//describes the test and gives it a title
describe('end2end testing for create', ()=> {

    const randomTest = 'test#' + Math.round((Math.random()*899998)+100001);
    const randomQuantity = '' + Math.round((Math.random()*9999)+1);
    const randomValue = '' + Math.round((Math.random()*999)+1);

    //redirecter url to create before every new test
    beforeEach(() => {
        cy.visit('http://localhost/create');
    });

    // Describe a specification or test-case with the given title and callback function acting as a thunk.
    // Thunk = subroutine used to inject an additional calculation into another subroutine
    it('Fill create form and send', () => {
        //cy.pause();
        cy.contains('h1', 'Create a new product')


        // Fills out the form
        cy.get('input[name=productname]').type(randomTest);
        cy.get('input[name=quantity]').type(randomQuantity);
        cy.get('input[name=price]').type(randomValue);
        cy.get('textarea[name=description]').type("This is a test product");
        cy.get('select[name=selectLocation]').select('Inventar CC Kbh');
        cy.get('select[name=selectCategory]').select('Alcohol Mini');

        cy.pause()
        cy.get('.btn').click();

        cy.contains('Lagerstatus')
    });
});

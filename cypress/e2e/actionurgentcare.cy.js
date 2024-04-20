describe('template spec', () => { 
  beforeEach(() => { 
    cy.visit('https://actionurgentcare.com/', {
          onBeforeLoad(win) {
            cy.stub(win, 'open').as('windowOpen');
            win.addEventListener('beforeunload', (event) => {
              event.preventDefault();
              event.returnValue = '';
            });
          }    
    }) 
  }) 

  it('Confirmation appointment', () => { 
      cy.get(".nav-item").contains("In-Clinic Care").trigger('mouseover'); 
      cy.get("[href='/clinics/blossom-hill']").eq(0).click(); 
      cy.url().should('eq', 'https://actionurgentcare.com/clinics/blossom-hill'); 
      cy.get(".MuiTypography-root").eq(6).click(); 
      cy.get(".MuiButton-root").eq(2).click(); 
      cy.get(".MuiButton-root").contains("Primary Care").click(); 
      cy.get(".MuiButton-root").contains("Continue").click();

      cy.get('@windowOpen').should('be.called').then(stub => { 
        const url = stub.args[0][0]; 
        cy.visit(url);
        cy.intercept(url, (req) => {
            req.reply({ body: '' });
        }).as('stopRequests');
      });
      
      cy.origin('https://kyla.com/', () => {
          cy.log('iframe');
      })    
  })    

  it ('Learn More about Covid', () =>{
    cy.get(".btn-outline-primary").contains("Learn More").click();
    cy.url().should('eq','https://actionurgentcare.com/covid');
  })
  it('See all locations',() =>{
    cy.get(".btn-outline-primary").contains("See All Locations").click();
    cy.url().should('eq','https://actionurgentcare.com/in-clinic-care');
  })
})
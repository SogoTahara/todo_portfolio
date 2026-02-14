describe('Weatherページ', () => {
  it('ナビゲーションから遷移できる', () => {
    cy.visit('http://localhost:5173')

    cy.get('[data-bs-toggle="offcanvas"]').click()

    cy.get('#sidebarMenu').should('be.visible')
    cy.contains('今日の天気').should('exist')

    cy.contains('今日の天気').should('be.visible')
  })
})
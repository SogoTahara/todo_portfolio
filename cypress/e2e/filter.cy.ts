describe('Todoフィルター機能', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')

    cy.window().then((win) => {
      cy.stub(win, 'prompt').callsFake((message) => {
        if (message.includes('メール')) return 'login@login'
        if (message.includes('パスワード')) return 'login123'
        return null
      })
    })

    cy.get('[data-bs-toggle="offcanvas"]').click()
    cy.get('#sidebarMenu').contains('button', 'ログイン').click()
    cy.contains('ログアウト').should('exist')

    cy.get('.offcanvas-header .btn-close').click()
    cy.get('#sidebarMenu').should('not.be.visible')
  })

  it('完了のみフィルターが機能する', () => {
    const taskName = `完了タスク-${Date.now()}`

    cy.get('input[placeholder="タスクを追加"]').type(taskName)
    cy.get('[data-test="add-task"]').click()

    
    cy.contains(taskName).find('button').contains('未完了').click()

    cy.contains('完了のみ').click()

    cy.contains(taskName).should('exist')
  })
})
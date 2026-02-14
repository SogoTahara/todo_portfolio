describe('Todoアプリ基本操作', () => {
  const taskName = `Cypressテスト-${Date.now()}`

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

  it('Todoを追加できる', () => {
    cy.get('input[placeholder="タスクを追加"]').type(taskName)
    cy.get('[data-test="add-task"]').click()
    cy.contains(taskName).should('exist')
  })

  it('Todoを完了にできる', () => {
    cy.contains(taskName)
      .find('button')
      .contains('未完了')
      .click()
    
    cy.contains(taskName)
      .should('have.class', 'text-decoration-line-through')
  })

  it('Todoを削除できる', () => {
   
    cy.contains(taskName)
      .find('button')
      .contains('削除')
      .click()

    cy.wait(1000)
    cy.contains(taskName).should('not.exist')
  })
})
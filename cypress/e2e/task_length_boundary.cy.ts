describe('Todo文字数制限テスト', () => {
  
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

  it('0文字では追加できない', () => {
    cy.get('input[placeholder="タスクを追加"]').clear()
    cy.get('[data-test="add-task"]').click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('空欄です')
    })
  })

  it('1文字なら追加できる', () => {
    cy.get('input[placeholder="タスクを追加"]').clear().type('a')
    cy.get('[data-test="add-task"]').click()
    cy.contains('a').should('exist')
  })

  it('30文字なら追加できる', () => {
    const text30 = 'a'.repeat(30)
    cy.get('input[placeholder="タスクを追加"]').clear().type(text30)
    cy.get('[data-test="add-task"]').click()
    cy.contains(text30).should('exist')
  })

  it('31文字以上では追加できない', () => {
    const text31 = 'a'.repeat(31)
    cy.get('input[placeholder="タスクを追加"]').clear().type(text31)
    cy.get('[data-test="add-task"]').click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('30文字以内で入力してください')
    })
    
    cy.contains(text31).should('not.exist')
  })
})
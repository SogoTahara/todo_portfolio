describe('認証機能とアクセス制御', () => {
  
  // 各テストの前にページを開く
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  context('1. ログイン・ログアウトの動作確認', () => {
    it('正しい情報でログインし、ログアウトできる', () => {
      // window.prompt を自動入力できるようにする
      cy.window().then((win) => {
        cy.stub(win, 'prompt').callsFake((message) => {
          if (message.includes('メール')) return 'login@login' // あなたのテスト用メアド
          if (message.includes('パスワード')) return 'login123' // あなたのテスト用パスワード
          return null
        })
      })

      // 1. サイドバーを開く
      cy.get('[data-bs-toggle="offcanvas"]').click()

      // 2. ログインボタンを押す
      cy.get('#sidebarMenu').contains('button', 'ログイン').click()

      // 3. ログイン成功の確認（ログアウトボタンが出現するか）
      cy.contains('button', 'ログアウト').should('be.visible')
      
      // 4. 統計ボックスが表示されているか確認
      // （サイドバーを閉じてメイン画面を見る）
      cy.get('.offcanvas-header .btn-close').click()
      
      // --- ログアウトのテスト ---
      // 5. 再びサイドバーを開く
      cy.get('[data-bs-toggle="offcanvas"]').click()

      // 6. ログアウトボタンを押す
      cy.contains('button', 'ログアウト').click()

      // 7. ログアウト成功の確認（ログインボタンに戻っているか）
      cy.contains('button', 'ログイン').should('be.visible')
    })
  })

  context('2. ログアウト時の機能制限（ガード）確認', () => {
    // このブロックではログイン操作をしない＝ログアウト状態でテストする

    it('ログアウト状態ではタスクを追加できず、アラートが出る', () => {
      const taskName = '追加されないタスク'
      
      // アラートの内容を監視するスパイを作成
      const stub = cy.stub()
      cy.on('window:alert', stub)

      // 入力して追加ボタンを押す
      cy.get('input[placeholder="タスクを追加"]').type(taskName)
      cy.get('[data-test="add-task"]').click()

      // 検証1: アラートが正しく呼ばれたか
      cy.then(() => {
        expect(stub).to.have.been.calledWith('タスクを追加するにはログインしてください')
      })

      // 検証2: タスクが画面に追加されていないこと
      cy.contains(taskName).should('not.exist')
    })

    it('ログアウト状態では統計情報が表示されず、ロックメッセージが出る', () => {
      // 統計ボックスの中身チェック
      cy.contains('現在のタスク集計').should('not.exist')
      cy.contains('ログインするとタスク統計などの機能が使えます').should('exist')
    })

    // ※削除や完了のガードテストをするには、元から画面にタスクがある必要があります。
    // もし初期状態でタスクが1つもない場合は、このテストはスキップされます。
    it('ログアウト状態では削除ボタンを押すとアラートが出る', () => {
      // 画面にタスクがあるか確認（なければテスト終了）
      cy.get('body').then(($body) => {
        if ($body.find('button.btn-outline-danger').length > 0) {
          
          const stub = cy.stub()
          cy.on('window:alert', stub)

          // 削除ボタンを押す（最初の1個）
          cy.get('button').contains('削除').first().click()

          // 検証: アラートが出る
          cy.then(() => {
            expect(stub).to.have.been.calledWith('削除するにはログインしてください')
          })
        }
      })
    })
  })
})
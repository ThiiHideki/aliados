# Guia do Admin: Como Fechar a Lista do Mix e Definir os Times

Este guia mostra os passos para o **admin** depois que a lista do mix encheu: como travar a lista (confirmar quem realmente jogou) e como fechar a divisão dos times na tela de "Escolher Time".

---

## Parte 1: Fechar a lista do Mix (confirmar presença)

A "lista do mix" é a lista do dia que os jogadores entram pelo site ou pelo botão do Discord. Quando todo mundo já confirmou e o mix vai começar, o admin precisa **travar a lista** marcando quem realmente jogou. Quem não jogou leva **falta**.

### Passos

1. Entre no site como **admin**.
2. No menu lateral, abra **"Mix - Disponibilidade"**.
3. Veja a lista de **Titulares** (10 vagas) e os **Suplentes**.
4. Se precisar adicionar alguém manualmente, use o bloco **"Ações Admin"**:
   - Selecione o jogador no menu.
   - Escolha **"Titular"** ou **"Suplente"**.
   - Clique em **"Adicionar"**.
5. Quando a lista estiver pronta, clique no botão **"Confirmar Presença (Admin)"**.
6. A tela entra em modo confirmação:
   - Por padrão, **todos os 10 titulares aparecem marcados** (presença OK).
   - **Desmarque** apenas quem **NÃO jogou** (faltou de verdade).
   - Quem ficar **desmarcado** vai receber **falta** automaticamente no histórico.
7. Clique no botão verde **"Confirmar"**.
8. Pronto. A lista do dia está fechada e as faltas registradas.

> Se errou e quer cancelar antes de salvar, é só clicar em **"Cancelar"** que volta tudo ao normal.

### Dicas

- Se algum titular avisou que não vinha e o suplente entrou no lugar, **adicione o suplente como titular** antes de confirmar (botão "Adicionar" nas Ações Admin).
- Quem foi titular e não jogou leva falta, mesmo que o lugar tenha sido ocupado por suplente.
- O botão **"Notificar Mix no Discord"** publica a lista do dia no canal **#🔫-lista-mix🔫** com o botão para os jogadores entrarem direto pelo Discord — use isso **antes** de começar a encher a lista.

---

## Parte 2: Fechar os times em "Escolher Time"

Depois que a lista está confirmada, o admin monta os dois times de 5 (CT e TR) na página **Mix - Escolher Time**.

### Passos

1. No menu lateral, abra **"Mix - Escolher Time"**.
2. Tela 1 — **Seleção de jogadores**:
   - Aparece a lista de todos os jogadores.
   - Marque os **10 jogadores** que vão jogar o mix.
   - Como admin, você pode **ajustar o nível (1-10)** de cada jogador no slider que aparece embaixo do card. O nível já vem pré-calculado pelas estatísticas (K/D, HS%, ADR, Win Rate, multi-kills), mas pode ser refinado na mão.
   - Quando os 10 estiverem marcados, clique em **"Próximo"** para ir para o balanceamento.
3. Tela 2 — **Balanceamento de times**:
   - Aparecem 3 colunas: **Jogadores Disponíveis**, **Time 1 (CT)** e **Time 2 (TR)**.
   - Você tem 3 botões automáticos no topo:
     - **Resetar** — esvazia os times e volta todos para "Disponíveis".
     - **Por Nível** — divide automaticamente equilibrando pelo nível 1-10 ajustado.
     - **Por K/D** — divide automaticamente equilibrando pela média de K/D dos jogadores.
   - Você pode também **mover jogadores manualmente** clicando nos botões dentro de cada card (mover para Time 1, mover para Time 2, ou tirar do time).
   - Cada time mostra na descrição o **Nível total** e o **K/D Médio** — use esses dois números pra ver se está equilibrado.
4. **Definir capitães** (opcional):
   - Em cada time, clique no jogador e use a opção **"Capitão"** para marcar quem vai ser capitão de cada lado.
   - Ele ganha um destaque visual (estrela/marcação) e fica reconhecido como capitão na divisão final.
5. Quando os dois times estiverem do jeito que você quer, clique em **"Próximo"** para ir para o **Veto de Mapas**.
6. Tela 3 — **Veto de mapas**:
   - Os capitães vetam mapas alternadamente.
   - O mapa que sobrar é o mapa do mix.
7. Pronto! Times fechados e mapa definido. Pode chamar a galera pro servidor.

### Dicas

- O balanceamento **"Por Nível"** costuma dar partidas mais justas porque considera mais coisas que só K/D.
- O **"Por K/D"** é bom quando o time tem muito jogador novo (ainda sem nível bem ajustado).
- Se o resultado automático não ficou legal, é só fazer pequenos ajustes manuais movendo 1 ou 2 jogadores entre os times.
- Você pode **voltar para a tela anterior** a qualquer momento, sem perder os jogadores já selecionados.

---

## Resumo rápido

| Etapa | Tela | O que fazer |
|---|---|---|
| 1. Notificar | Mix - Disponibilidade | Botão **"Notificar Mix no Discord"** |
| 2. Adicionar manualmente (se precisar) | Mix - Disponibilidade | Bloco **Ações Admin** → escolher jogador → Adicionar |
| 3. Fechar lista do dia | Mix - Disponibilidade | **"Confirmar Presença"** → desmarcar quem faltou → **"Confirmar"** |
| 4. Selecionar 10 jogadores | Mix - Escolher Time (passo 1) | Marcar os 10, ajustar nível se quiser, **"Próximo"** |
| 5. Dividir times | Mix - Escolher Time (passo 2) | **"Por Nível"** ou **"Por K/D"** + ajustes manuais + capitães → **"Próximo"** |
| 6. Veto de mapas | Mix - Escolher Time (passo 3) | Capitães vetam até sobrar 1 mapa |

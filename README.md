# Sistema de Moeda Estudantil

Trabalho da disciplina Projeto de Software. O projeto consiste em modelar e
implementar um sistema de moeda virtual para reconhecer o mérito dos estudantes,
dividido em sprints semanais.

## Integrantes

- Lucas Lima Magalhães Lafetá Chaves

## Descrição do sistema

O sistema estimula o reconhecimento do mérito estudantil por meio de uma moeda
virtual. Os professores distribuem moedas aos seus alunos, por exemplo por bom
comportamento ou participação em aula, e os alunos trocam essas moedas por
produtos e descontos oferecidos por empresas parceiras.

O aluno se cadastra informando nome, e-mail, CPF, RG, endereço, instituição de
ensino e curso. As instituições participantes e os professores (nome, CPF e
departamento) já vêm pré-cadastrados. A cada semestre cada professor recebe mil
moedas, e o que não for distribuído se acumula no saldo. Para enviar moedas, o
professor precisa de saldo suficiente e deve informar o aluno e o motivo do
reconhecimento. O aluno é avisado por e-mail ao receber moedas.

Professores e alunos consultam o extrato da conta, com o saldo e as transações
(envios, no caso do professor; recebimentos e trocas, no caso do aluno). As
empresas parceiras se cadastram e oferecem vantagens, cada uma com descrição,
foto e custo em moedas. Ao trocar moedas por uma vantagem, o valor é descontado
do saldo do aluno e um e-mail com um código de cupom é enviado ao aluno e à
empresa, para conferir a troca. Todos os usuários acessam o sistema com login e
senha.

## Diagrama de Caso de Uso

![Diagrama de casos de uso](<docs/diagramas/Laboratório 4/Sprint 1/Diagrama de Casos de Uso Atualizado.png>)

### Atores

- **Aluno**: participa do sistema de mérito, recebe moedas e as troca por vantagens.
- **Professor**: distribui moedas aos alunos e recebe 1.000 moedas por semestre.
- **Empresa Parceira**: cadastra as vantagens que oferece em troca de moedas.
- **Agendador do Semestre**: dispara, a cada semestre, o crédito de moedas aos professores.
- **Serviço de E-mail** (sistema externo): envia as notificações e os cupons por e-mail.

## Histórias de Usuário

### Todos os perfis

#### Autenticar-se

> **Como** aluno, professor ou empresa parceira, **quero** entrar no sistema com meu login e senha, **para** acessar as funcionalidades do meu perfil.

- Alunos, professores e empresas parceiras têm login e senha cadastrados.
- As funcionalidades de cada perfil só são acessíveis após a autenticação.
- O cadastro inicial de aluno e de empresa parceira é feito antes de existir um login.

### Aluno

#### Cadastrar aluno

> **Como** aluno, **quero** me cadastrar no sistema de mérito, **para** receber moedas dos meus professores e trocá-las por vantagens.

- O aluno informa nome, e-mail, CPF, RG, endereço, curso, login e senha.
- A instituição de ensino é escolhida entre as instituições já pré-cadastradas.

#### Atualizar dados do aluno

> **Como** aluno, **quero** atualizar meus dados cadastrais, **para** mantê-los corretos.

- Só o próprio aluno autenticado altera os seus dados.

#### Excluir cadastro do aluno

> **Como** aluno, **quero** excluir meu cadastro, **para** deixar de participar do sistema de mérito.

- Só o próprio aluno autenticado exclui o seu cadastro.

#### Consultar extrato do aluno

> **Como** aluno, **quero** consultar o extrato da minha conta, **para** acompanhar meu saldo e minhas movimentações.

- O extrato mostra o total de moedas que o aluno ainda possui.
- O extrato lista os recebimentos de moedas e as trocas por vantagens.

#### Trocar moedas por vantagem

> **Como** aluno, **quero** trocar minhas moedas por uma vantagem cadastrada, **para** aproveitar o reconhecimento que recebi.

- O aluno seleciona uma das vantagens cadastradas no sistema.
- O saldo do aluno precisa cobrir o custo da vantagem, e o valor é descontado do saldo.
- O sistema gera um código para a troca.
- Um e-mail de cupom, com o código, é enviado ao aluno para a troca presencial.
- Um e-mail, com o mesmo código, é enviado à empresa parceira para conferir a troca.

### Aluno e Empresa Parceira

#### Consultar vantagens

> **Como** aluno ou empresa parceira, **quero** consultar as vantagens cadastradas, **para** escolher uma troca (aluno) ou acompanhar o que ofereço (empresa).

- O aluno vê o catálogo com as vantagens ativas de todas as empresas, com descrição, foto e custo.
- A empresa vê apenas as vantagens que ela cadastrou.
- Vantagens excluídas não aparecem em nenhuma das listas.

### Professor

#### Enviar moedas a um aluno

> **Como** professor, **quero** enviar moedas a um aluno, **para** reconhecer seu bom comportamento ou sua participação em aula.

- O professor precisa ter saldo suficiente para o montante enviado.
- O professor indica o aluno que recebe as moedas.
- O motivo do reconhecimento é uma mensagem aberta e obrigatória.
- O aluno é notificado por e-mail ao receber as moedas.

#### Consultar extrato do professor

> **Como** professor, **quero** consultar o extrato da minha conta, **para** acompanhar meu saldo e as moedas que já enviei.

- O extrato mostra o total de moedas que o professor ainda possui.
- O extrato lista os envios de moedas.

#### Receber moedas do semestre

> **Como** professor, **quero** receber moedas a cada semestre, **para** ter o que distribuir aos meus alunos.

- A cada semestre o sistema credita 1.000 moedas ao professor.
- O crédito é disparado pelo agendador do semestre, e não pelo professor.
- O total é acumulável: as moedas não distribuídas permanecem no saldo e as 1.000 novas são somadas a ele.

### Empresa Parceira

#### Cadastrar empresa parceira

> **Como** empresa parceira, **quero** me cadastrar no sistema, **para** oferecer vantagens aos alunos.

- A empresa informa nome, e-mail, CNPJ, login e senha.

#### Atualizar dados da empresa parceira

> **Como** empresa parceira, **quero** atualizar meus dados cadastrais, **para** mantê-los corretos.

- Só a própria empresa autenticada altera os seus dados.

#### Excluir cadastro da empresa parceira

> **Como** empresa parceira, **quero** excluir meu cadastro, **para** encerrar a parceria com o sistema.

- Só a própria empresa autenticada exclui o seu cadastro.

#### Cadastrar vantagem

> **Como** empresa parceira, **quero** cadastrar as vantagens que ofereço, **para** que os alunos possam trocá-las por moedas.

- A vantagem tem descrição, foto do produto e custo em moedas.
- A vantagem pertence à empresa que a cadastrou.

#### Excluir vantagem

> **Como** empresa parceira, **quero** excluir uma vantagem que não ofereço mais, **para** que ela saia do catálogo dos alunos.

- Só a empresa dona da vantagem a exclui.
- A exclusão é lógica: os resgates já feitos continuam registrados.

### Serviço de e-mail (sistema externo)

#### Notificar aluno sobre moedas recebidas

> **Como** serviço de e-mail, **quero** ser acionado quando um professor envia moedas, **para** avisar o aluno por e-mail.

- O e-mail é enviado ao aluno sempre que ele recebe moedas.

#### Enviar cupom de resgate

> **Como** serviço de e-mail, **quero** ser acionado quando um aluno resgata uma vantagem, **para** enviar o cupom ao aluno e a conferência à empresa parceira.

- O aluno e a empresa parceira recebem, cada um, um e-mail.
- Os dois e-mails incluem o mesmo código gerado pelo sistema.

### Fora do escopo

- Instituições de ensino e professores já vêm pré-cadastrados no sistema, por isso não há história de cadastro para eles.

## Diagrama de Classes

![Diagrama de classes](<docs/diagramas/Laboratório 4/Sprint 1/Diagrama de Classes Inalterado.png>)

## Diagramas de Sequência

Há um diagrama de sequência para cada caso de uso. As telas e os controladores são objetos de projeto; os serviços, os repositórios e as entidades são as classes do diagrama de classes, e as mensagens seguem as operações dessas classes. A validação da sessão é a parte 2 do UC01, referenciada pelos casos de uso protegidos.

| Caso de uso | Diagrama |
|---|---|
| UC01 - Autenticar-se | [UC01 - Autenticar-se](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC01 - Autenticar-se.png>) |
| UC02 - Cadastrar Aluno | [UC02 - Cadastrar Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC02 - Cadastrar Aluno.png>) |
| UC03 - Atualizar Dados do Aluno | [UC03 - Atualizar Dados do Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC03 - Atualizar Dados do Aluno.png>) |
| UC04 - Excluir Cadastro do Aluno | [UC04 - Excluir Cadastro do Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC04 - Excluir Cadastro do Aluno.png>) |
| UC05 - Consultar Extrato do Aluno | [UC05 - Consultar Extrato do Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC05 - Consultar Extrato do Aluno.png>) |
| UC06 - Trocar Moedas por Vantagem | [UC06 - Trocar Moedas por Vantagem](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC06 - Trocar Moedas por Vantagem.png>) |
| UC07 - Enviar Moedas a um Aluno | [UC07 - Enviar Moedas a um Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC07 - Enviar Moedas a um Aluno.png>) |
| UC08 - Consultar Extrato do Professor | [UC08 - Consultar Extrato do Professor](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC08 - Consultar Extrato do Professor.png>) |
| UC09 - Receber Moedas do Semestre | [UC09 - Receber Moedas do Semestre](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC09 - Receber Moedas do Semestre.png>) |
| UC10 - Cadastrar Empresa Parceira | [UC10 - Cadastrar Empresa Parceira](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC10 - Cadastrar Empresa Parceira.png>) |
| UC11 - Atualizar Dados da Empresa Parceira | [UC11 - Atualizar Dados da Empresa Parceira](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC11 - Atualizar Dados da Empresa Parceira.png>) |
| UC12 - Excluir Cadastro da Empresa Parceira | [UC12 - Excluir Cadastro da Empresa Parceira](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC12 - Excluir Cadastro da Empresa Parceira.png>) |
| UC13 - Cadastrar Vantagem | [UC13 - Cadastrar Vantagem](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC13 - Cadastrar Vantagem.png>) |
| UC14 - Enviar Cupom de Resgate | [UC14 - Enviar Cupom de Resgate](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC14 - Enviar Cupom de Resgate.png>) |
| UC15 - Notificar Aluno sobre Moedas Recebidas | [UC15 - Notificar Aluno sobre Moedas Recebidas](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC15 - Notificar Aluno sobre Moedas Recebidas.png>) |
| UC16 - Consultar Vantagens | [UC16 - Consultar Vantagens](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC16 - Consultar Vantagens.png>) |
| UC17 - Excluir Vantagem | [UC17 - Excluir Vantagem](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/UC17 - Excluir Vantagem.png>) |

## Diagrama de Visão Geral da Interação

![Diagrama de visão geral da interação](<docs/diagramas/Laboratório 4/Sprint 1/Diagrama de Visão Geral da Interação.png>)

## Diagrama de Componentes

![Diagrama de componentes](<docs/diagramas/Laboratório 3/Sprint 3/Diagrama de Componentes.png>)

## Modelo Lógico

![Modelo lógico](<docs/diagramas/Laboratório 3/Sprint 2/Modelo Lógico.png>)

## Estrutura do projeto

```
docker-compose.yml
.env.example
docs/
  diagramas/
    Laboratório 3/      diagramas de cada sprint (Sprint 1, Sprint 2 e Sprint 3)
    Laboratório 4/      Sprint 1: casos de uso, classes, visão geral da
                        interação e Diagramas de Sequência (um por caso de uso)
  entregas/         PDFs de entrega (Lab03S01 e Lab04S01)
  apresentacao/     slides da apresentação final
  enunciado/        enunciado do laboratório
src/
  back/             API em Python (FastAPI)
    app/
      controller/   rotas, schemas, permissões e tratamento de erros
      service/      regras de negócio (cadastros, moedas, vantagens, e-mail)
      repository/   interfaces, acesso ao banco (SQLAlchemy) e armazenamento de fotos
      model/        entidades
      tarefas/      carga inicial e crédito do semestre
    migrations/     migrações (Alembic)
    tests/          modelos, repositorios, servicos, api e suporte
  front/            interface em React, Vite e Tailwind
    src/            api, componentes, contextos, hooks, paginas, tipos e utils
    tests/          api, componentes, hooks e utils
```

## Como executar

Requisitos: Docker com Docker Compose.

```bash
docker compose up -d --build
```

- Front-end: http://localhost:5173
- API e documentação: http://localhost:8000/docs

As migrações e os dados iniciais (2 instituições e 3 professores) são aplicados ao subir a API. Os valores padrão do banco estão em `.env.example`; para mudá-los, copie o arquivo para `.env`.

### Acesso ao sistema

- **Professores** (já cadastrados, cada um com 1.000 moedas): `prof.carlos`, `prof.ana` e `prof.marcos`, todos com a senha `senha1234`.
- **Alunos** e **empresas parceiras** se cadastram pelas telas "Sou aluno" e "Sou empresa" e depois entram com o login e a senha escolhidos.

### E-mails

O sistema envia o aviso de moedas recebidas e os e-mails do resgate (cupom para o aluno e conferência para a empresa). Para enviar de verdade pelo Gmail, copie `.env.example` para `.env` e preencha `SMTP_USUARIO` e `SMTP_SENHA` (uma senha de aplicativo da conta Google). Sem essas informações, os e-mails não são enviados e o conteúdo aparece no log da API (`docker compose logs api`).

### Moedas do semestre

A cada semestre, o crédito de 1.000 moedas aos professores é feito com o comando abaixo.

```bash
docker compose exec api python -m app.tarefas.creditar_semestre
```

## Entregas por sprint

- **Sprint 1** — diagrama de casos de uso, histórias de usuário, diagrama de classes e
  diagrama de componentes.
- **Sprint 2** — modelo ER, estratégia de acesso ao banco de dados e versão inicial
  dos CRUDs de aluno e empresa parceira.
- **Sprint 3** — versão final dos CRUDs, login, envio de moedas, vantagens com foto,
  resgate com cupom por e-mail e apresentação da arquitetura e da camada de persistência.
- **Release 02, Sprint 1 (Lab04S01)** — diagramas de sequência (um por caso de uso),
  diagrama de visão geral da interação e atualização do diagrama de casos de uso. Os
  diagramas de sequência e o de visão geral estão reunidos em
  `docs/entregas/Lab04S01-Sistema-de-Moeda-Estudantil.pdf`.

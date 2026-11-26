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

![Diagrama de classes](<docs/diagramas/Laboratório 4/Sprint 3/Diagrama de Classes Atualizado.png>)

## Diagramas de Sequência

Há um diagrama de sequência para cada caso de uso. As telas e os controladores são objetos de projeto; os serviços, os repositórios e as entidades são as classes do diagrama de classes, e as mensagens seguem as operações dessas classes. A validação da sessão é a parte 2 do Caso de Uso 01, referenciada pelos casos de uso protegidos.

| Caso de uso | Diagrama |
|---|---|
| Caso de Uso 01 - Autenticar-se | [Caso de Uso 01 - Autenticar-se](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 01 - Autenticar-se.png>) |
| Caso de Uso 02 - Cadastrar Aluno | [Caso de Uso 02 - Cadastrar Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 02 - Cadastrar Aluno.png>) |
| Caso de Uso 03 - Atualizar Dados do Aluno | [Caso de Uso 03 - Atualizar Dados do Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 03 - Atualizar Dados do Aluno.png>) |
| Caso de Uso 04 - Excluir Cadastro do Aluno | [Caso de Uso 04 - Excluir Cadastro do Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 04 - Excluir Cadastro do Aluno.png>) |
| Caso de Uso 05 - Consultar Extrato do Aluno | [Caso de Uso 05 - Consultar Extrato do Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 05 - Consultar Extrato do Aluno.png>) |
| Caso de Uso 06 - Trocar Moedas por Vantagem | [Caso de Uso 06 - Trocar Moedas por Vantagem](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 06 - Trocar Moedas por Vantagem.png>) |
| Caso de Uso 07 - Enviar Moedas a um Aluno | [Caso de Uso 07 - Enviar Moedas a um Aluno](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 07 - Enviar Moedas a um Aluno.png>) |
| Caso de Uso 08 - Consultar Extrato do Professor | [Caso de Uso 08 - Consultar Extrato do Professor](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 08 - Consultar Extrato do Professor.png>) |
| Caso de Uso 09 - Receber Moedas do Semestre | [Caso de Uso 09 - Receber Moedas do Semestre](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 09 - Receber Moedas do Semestre.png>) |
| Caso de Uso 10 - Cadastrar Empresa Parceira | [Caso de Uso 10 - Cadastrar Empresa Parceira](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 10 - Cadastrar Empresa Parceira.png>) |
| Caso de Uso 11 - Atualizar Dados da Empresa Parceira | [Caso de Uso 11 - Atualizar Dados da Empresa Parceira](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 11 - Atualizar Dados da Empresa Parceira.png>) |
| Caso de Uso 12 - Excluir Cadastro da Empresa Parceira | [Caso de Uso 12 - Excluir Cadastro da Empresa Parceira](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 12 - Excluir Cadastro da Empresa Parceira.png>) |
| Caso de Uso 13 - Cadastrar Vantagem | [Caso de Uso 13 - Cadastrar Vantagem](<docs/diagramas/Laboratório 4/Sprint 2/Diagramas de Sequência/Caso de Uso 13 - Cadastrar Vantagem Atualizado.png>) |
| Caso de Uso 14 - Enviar Cupom de Resgate | [Caso de Uso 14 - Enviar Cupom de Resgate](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 14 - Enviar Cupom de Resgate.png>) |
| Caso de Uso 15 - Notificar Aluno sobre Moedas Recebidas | [Caso de Uso 15 - Notificar Aluno sobre Moedas Recebidas](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 15 - Notificar Aluno sobre Moedas Recebidas.png>) |
| Caso de Uso 16 - Consultar Vantagens | [Caso de Uso 16 - Consultar Vantagens](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 16 - Consultar Vantagens.png>) |
| Caso de Uso 17 - Excluir Vantagem | [Caso de Uso 17 - Excluir Vantagem](<docs/diagramas/Laboratório 4/Sprint 1/Diagramas de Sequência/Caso de Uso 17 - Excluir Vantagem.png>) |

## Diagrama de Visão Geral da Interação

![Diagrama de visão geral da interação](<docs/diagramas/Laboratório 4/Sprint 1/Diagrama de Visão Geral da Interação.png>)

## Diagrama de Componentes

![Diagrama de componentes](<docs/diagramas/Laboratório 4/Sprint 2/Diagrama de Componentes Inalterado.png>)

## Diagrama de Implantação

![Diagrama de implantação](<docs/diagramas/Laboratório 4/Sprint 2/Diagrama de Implantação.png>)

O navegador do usuário baixa o front-end da Vercel e conversa com a API na Render por HTTPS. A API roda num contêiner Docker com os componentes do diagrama de componentes, grava os dados no PostgreSQL da Neon e envia os e-mails pelo servidor SMTP da Brevo.

## Modelo Lógico

![Modelo lógico](<docs/diagramas/Laboratório 3/Sprint 2/Modelo Lógico.png>)

A tabela `foto_vantagem`, que guarda as fotos das vantagens, foi acrescentada depois deste modelo pela migração `0002_foto_vantagem`.

## Estrutura do projeto

```
docker-compose.yml
render.yaml         publicação da API na Render
.env.example
docs/
  diagramas/
    Laboratório 3/      diagramas de cada sprint (Sprint 1, Sprint 2 e Sprint 3)
    Laboratório 4/      Sprint 1: casos de uso, classes, visão geral da
                        interação e Diagramas de Sequência (um por caso de uso)
                        Sprint 2: diagrama de implantação e versões atualizadas
  entregas/         PDFs e zip de entrega de cada laboratório
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
  front/            interface em React, Vite e Tailwind (vercel.json para a Vercel)
    src/            api, componentes, contextos, hooks, paginas, tipos e utils
    tests/          api, componentes, hooks e utils
```

## Como executar no computador

### O que precisa ter instalado

- Git
- Docker com Docker Compose (o Docker Desktop já traz os dois)

### Passo a passo

1. Baixe o projeto e entre na pasta:

```bash
git clone https://github.com/lucaslmchaves/sistema-moeda-estudantil.git
cd sistema-moeda-estudantil
```

2. Suba o sistema (a primeira vez demora alguns minutos, porque baixa as imagens e monta tudo):

```bash
docker compose up -d --build
```

3. Espere uns 30 segundos. Nesse tempo a API cria as tabelas do banco e os dados iniciais (2 instituições e 3 professores). Para conferir, abra http://localhost:8000/saude e veja se aparece `"status":"ok"`.

4. Abra o sistema:

- Front-end: http://localhost:5173
- API e documentação: http://localhost:8000/docs

Não precisa criar o arquivo `.env`: os valores padrão já funcionam. Ele só é necessário para configurar o envio de e-mails (veja mais abaixo).

### Como testar

1. **Professor:** os professores já vêm cadastrados. Clique em "Sou professor" e entre com `prof.carlos` e a senha `senha1234` (também existem `prof.ana` e `prof.marcos`, com a mesma senha). Cada um começa com 1.000 moedas.
2. **Aluno:** clique em "Sou aluno" e faça o cadastro. Use nome e sobrenome, um CPF válido (por exemplo `529.982.247-25`), um RG como `MG-12.345.678`, o endereço com número e uma senha com pelo menos 8 caracteres, com letra e número.
3. **Empresa parceira:** clique em "Sou empresa" e faça o cadastro. Use um CNPJ válido, por exemplo `11.222.333/0001-81`.
4. Entre como a **empresa**, vá em "Minhas vantagens" e cadastre uma vantagem com descrição, custo em moedas e uma foto (JPEG, PNG ou WebP de até 2 MB).
5. Entre como o **professor** e, em "Enviar moedas", mande moedas ao aluno com o motivo.
6. Entre como o **aluno**, veja o catálogo em "Vantagens", troque moedas por uma vantagem e confira o saldo em "Extrato".

### E-mails

O sistema manda o aviso de moedas recebidas e, no resgate, o cupom para o aluno e a conferência para a empresa. Sem configurar nada, os e-mails **não são enviados**: o conteúdo de cada um aparece no log da API. Para ver:

```bash
docker compose logs api
```

Para enviar de verdade, copie o arquivo de exemplo e preencha as variáveis de e-mail:

```bash
cp .env.example .env
```

No Windows, no lugar do `cp` use `copy .env.example .env`. Depois abra o `.env` e preencha:

- **Com o Brevo:** `SMTP_HOST=smtp-relay.brevo.com`, `SMTP_PORTA=2525`, `SMTP_USUARIO` (login SMTP do Brevo), `SMTP_SENHA` (chave SMTP) e `EMAIL_REMETENTE` (e-mail remetente verificado no Brevo). A criação da conta está em "E-mails na nuvem (Brevo)", mais abaixo.
- **Com o Gmail:** `SMTP_HOST=smtp.gmail.com`, `SMTP_PORTA=587`, `SMTP_USUARIO` e `EMAIL_REMETENTE` com o seu Gmail, e `SMTP_SENHA` com uma senha de aplicativo da conta Google (não é a senha normal).

Depois de salvar o `.env`, rode `docker compose up -d` de novo para a API ler os valores. O arquivo `.env` não vai para o GitHub, então as suas senhas ficam só no seu computador.

### Moedas do semestre

A cada semestre, o crédito de 1.000 moedas aos professores é feito com o comando abaixo.

```bash
docker compose exec api python -m app.tarefas.creditar_semestre
```

### Rodar os testes

```bash
docker compose exec api python -m pytest -q
```

Os testes do front-end precisam do Node 22 instalado:

```bash
cd src/front
npm ci
npm test
```

### Parar e recomeçar

- Para parar o sistema e manter os dados: `docker compose down`
- Para parar e apagar tudo, inclusive o banco: `docker compose down -v`

## Publicação na nuvem

O sistema está no ar em **https://sistema-moeda-estudantil-gold.vercel.app** (a API fica em https://moeda-estudantil-api-gmkt.onrender.com, com a documentação em `/docs`).

Usuários já cadastrados na nuvem, todos com a senha `senha1234`:

| Perfil | Logins |
|---|---|
| Professor | `prof.carlos`, `prof.ana`, `prof.marcos` |
| Aluno | `aluno.joao`, `aluno.maria` |
| Empresa parceira | `empresa.cantina`, `empresa.livraria` |

| Parte | Serviço | Observação |
|---|---|---|
| Front-end | Vercel | build estático de `src/front` |
| API | Render | contêiner Docker de `src/back`, descrito em `render.yaml` |
| Banco de dados | Neon | PostgreSQL 16, sem prazo de validade |
| E-mails | Brevo | SMTP na porta 2525 (a Render gratuita bloqueia as portas 25, 465 e 587, usadas pelo Gmail) |

No plano gratuito a API dorme depois de 15 minutos sem acesso, e a primeira abertura depois disso leva cerca de 1 minuto. As fotos das vantagens ficam no banco, por isso não se perdem quando a API reinicia.

### Passo a passo

1. **Neon**: crie um projeto com PostgreSQL 16 e copie a connection string (começa com `postgresql://` e termina com `?sslmode=require`).
2. **Brevo**: crie a conta e gere a chave SMTP, como explicado em "E-mails na nuvem (Brevo)" mais abaixo. Anote o login SMTP e a chave.
3. **Render**: em "New", escolha "Blueprint" e o repositório do GitHub. Preencha `DATABASE_URL` (a connection string da Neon), `SMTP_USUARIO` (login SMTP da Brevo), `SMTP_SENHA` (chave SMTP), `EMAIL_REMETENTE` (o e-mail verificado) e deixe `CORS_ORIGINS` por enquanto com qualquer valor. Quando o deploy terminar, abra `/saude` e `/docs` no endereço da API.
4. **Vercel**: importe o repositório, informe `src/front` em "Root Directory" e crie a variável `VITE_API_URL` com o endereço da API da Render, sem barra no final. Faça o deploy.
5. **Render de novo**: troque `CORS_ORIGINS` pelo endereço da Vercel, sem barra no final, e salve. A API reinicia e o front passa a conseguir chamá-la.

Na nuvem os dados iniciais (instituições e professores) são criados ao subir a API, como no Docker local. O crédito semestral pode ser rodado do computador contra o banco da Neon:

```bash
docker compose run --rm -e DATABASE_URL="<connection string da Neon>" api python -m app.tarefas.creditar_semestre
```

### E-mails na nuvem (Brevo)

A Render gratuita bloqueia as portas 25, 465 e 587, então o Gmail não funciona lá. Por isso os e-mails saem pelo Brevo, na porta 2525 (plano grátis, até 300 e-mails por dia).

1. Crie uma conta em brevo.com. Antes de enviar, o Brevo pede para verificar o telefone (aparece um aviso azul na tela inicial).
2. Em **Configurações → Remetentes, domínios e IPs dedicados → Remetentes**, confira se o seu e-mail aparece como **verificado**. Se não, adicione e confirme pelo código que chega nele.
3. Em **SMTP e API → SMTP**, anote o **Login** (termina em `@smtp-brevo.com`) e clique em **Gerar chave SMTP**. Copie a chave na hora, porque ela só aparece uma vez. Não ative o bloqueio de IPs, porque a Render troca de IP.
4. Na Render, em **Environment** do serviço `moeda-estudantil-api`, preencha `SMTP_USUARIO` (o login), `SMTP_SENHA` (a chave) e `EMAIL_REMETENTE` (o e-mail verificado). O servidor e a porta já estão no `render.yaml`. Ao salvar, a API reinicia.

Quem recebe o e-mail precisa ter um endereço de verdade. Se o remetente for um Gmail, o Brevo mostra um aviso sobre o domínio e envia por um domínio dele; no teste o e-mail chegou na caixa de entrada, mas outros provedores podem mandar para o spam.

### Publicação automática

A cada commit na `main`, o workflow **Testes** (aba Actions do GitHub) roda os testes da API e do front. Quando os dois passam, dois workflows entram em ação:

- **Publicar na Render** pede à Render o deploy daquele commit e espera a API responder com a versão nova (a rota `/saude` informa o commit publicado). Precisa do segredo `RENDER_DEPLOY_HOOK`.
- **Publicar na Vercel** pede o deploy pelo Deploy Hook e espera o front responder com o commit novo (o arquivo `/versao.json`, gerado no build). Precisa do segredo `VERCEL_DEPLOY_HOOK`. O deploy automático da Vercel pelo Git fica desligado no `src/front/vercel.json` (`git.deploymentEnabled`), para o front só ser publicado depois dos testes.

O deploy automático da Render também fica desligado, no `render.yaml`, para não publicar duas vezes.

Para criar os segredos:

1. **Render:** serviço `moeda-estudantil-api` → **Settings → Deploy Hook**, copie o endereço.
2. **Vercel:** projeto → **Settings → Git → Deploy Hooks**, crie um hook para a branch `main` e copie o endereço.
3. **GitHub:** **Settings → Secrets and variables → Actions → New repository secret**, um com o nome `RENDER_DEPLOY_HOOK` e outro com o nome `VERCEL_DEPLOY_HOOK`.

## Entregas por sprint

- **Sprint 1** — diagrama de casos de uso, histórias de usuário, diagrama de classes e
  diagrama de componentes.
- **Sprint 2** — modelo ER, estratégia de acesso ao banco de dados e versão inicial
  dos CRUDs de aluno e empresa parceira.
- **Sprint 3** — versão final dos CRUDs, login, envio de moedas, vantagens com foto,
  resgate com cupom por e-mail e apresentação da arquitetura e da camada de persistência.
- **Release 02, Sprint 1** — diagramas de sequência (um por caso de uso),
  diagrama de visão geral da interação e atualização do diagrama de casos de uso. Os
  diagramas de sequência e o de visão geral estão reunidos em
  `docs/entregas/Sistema de Moeda Estudantil - Laboratório 4 - Sprint 1.pdf` (e, em zip, só os diagramas).
- **Release 02, Sprint 2** — diagrama de implantação e publicação da aplicação na nuvem (Vercel, Render e Neon). O diagrama de classes foi atualizado para a nova forma de guardar as fotos e o de componentes seguiu igual.

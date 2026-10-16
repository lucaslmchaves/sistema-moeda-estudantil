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

## Entregas por sprint

- **Sprint 1** — diagrama de casos de uso, histórias de usuário, diagrama de classes e
  diagrama de componentes.
- **Sprint 2** — modelo ER, estratégia de acesso ao banco de dados e versão inicial
  dos CRUDs de aluno e empresa parceira.
- **Sprint 3** — versão final dos CRUDs, apresentação da arquitetura e da camada de
  persistência.

#!/usr/bin/env bash
set -e

# ==============================================================================
# Script de verificação da stack completa (Sistema de Moeda Estudantil)
# Sobe a stack, aguarda a API estar saudável, executa o CRUD completo de Aluno e
# de Empresa Parceira com dados únicos e válidos, e valida o front-end.
# ==============================================================================

echo "=== 1. Subindo a stack de containers (db, api, front) ==="
docker compose up -d --build

API_URL="http://localhost:8000"
FRONT_URL="http://localhost:5173"

echo "=== 2. Aguardando a API estar saudável em /saude ==="
TENTATIVAS=30
SUCESSO_SAUDE=0
for i in $(seq 1 $TENTATIVAS); do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/saude" || true)
  if [ "$HTTP_STATUS" = "200" ]; then
    SUCESSO_SAUDE=1
    break
  fi
  sleep 1
done

if [ $SUCESSO_SAUDE -ne 1 ]; then
  echo "FALHA: API não respondeu com status 200 em /saude"
  exit 1
fi
echo "API saudável e operacional."

# Funções geradoras de CPF e CNPJ matematicamente válidos
gerar_cpf() {
  local d=()
  for i in {0..8}; do
    d+=($(( (RANDOM % 9) + 1 )))
  done
  local s1=0
  for i in {0..8}; do
    s1=$(( s1 + d[i] * (10 - i) ))
  done
  local r1=$(( s1 % 11 ))
  local d10=0
  if [ $r1 -ge 2 ]; then d10=$(( 11 - r1 )); fi
  d+=($d10)

  local s2=0
  for i in {0..9}; do
    s2=$(( s2 + d[i] * (11 - i) ))
  done
  local r2=$(( s2 % 11 ))
  local d11=0
  if [ $r2 -ge 2 ]; then d11=$(( 11 - r2 )); fi
  d+=($d11)

  local res=""
  for n in "${d[@]}"; do res="${res}${n}"; done
  echo "$res"
}

gerar_cnpj() {
  local d=()
  for i in {0..7}; do
    d+=($(( (RANDOM % 9) + 1 )))
  done
  d+=(0 0 0 1)
  local w1=(5 4 3 2 9 8 7 6 5 4 3 2)
  local s1=0
  for i in {0..11}; do
    s1=$(( s1 + d[i] * w1[i] ))
  done
  local r1=$(( s1 % 11 ))
  local d13=0
  if [ $r1 -ge 2 ]; then d13=$(( 11 - r1 )); fi
  d+=($d13)

  local w2=(6 5 4 3 2 9 8 7 6 5 4 3 2)
  local s2=0
  for i in {0..12}; do
    s2=$(( s2 + d[i] * w2[i] ))
  done
  local r2=$(( s2 % 11 ))
  local d14=0
  if [ $r2 -ge 2 ]; then d14=$(( 11 - r2 )); fi
  d+=($d14)

  local res=""
  for n in "${d[@]}"; do res="${res}${n}"; done
  echo "$res"
}

echo "=== 3. Verificando GET /instituicoes ==="
STATUS_INST=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/instituicoes")
if [ "$STATUS_INST" != "200" ]; then
  echo "FALHA: GET /instituicoes retornou status $STATUS_INST"
  exit 1
fi

echo "=== 4. Testando CRUD completo de Aluno ==="
SUFIXO=$(( RANDOM + 10000 ))
CPF_ALUNO=$(gerar_cpf)
LOGIN_ALUNO="aluno_${SUFIXO}"
EMAIL_ALUNO="aluno_${SUFIXO}@teste.com"

PAYLOAD_ALUNO=$(cat <<EOF
{
  "nome": "Aluno Teste ${SUFIXO}",
  "email": "${EMAIL_ALUNO}",
  "cpf": "${CPF_ALUNO}",
  "rg": "MG-${SUFIXO}",
  "endereco": "Rua das Acacias, ${SUFIXO}",
  "curso": "Engenharia de Software",
  "id_instituicao": 1,
  "login": "${LOGIN_ALUNO}",
  "senha": "senhaValida123"
}
EOF
)

# POST /alunos (201)
RESPOSTA_CRIAR=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/alunos" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_ALUNO")

STATUS_CRIAR=$(echo "$RESPOSTA_CRIAR" | tail -n1)
CORPO_CRIAR=$(echo "$RESPOSTA_CRIAR" | sed '$d')

if [ "$STATUS_CRIAR" != "201" ]; then
  echo "FALHA: POST /alunos retornou status $STATUS_CRIAR, esperado 201. Resposta: $CORPO_CRIAR"
  exit 1
fi

# Extrai id_usuario
ID_ALUNO=$(echo "$CORPO_CRIAR" | grep -o '"id_usuario":[0-9]*' | cut -d: -f2)
if [ -z "$ID_ALUNO" ]; then
  echo "FALHA: Não foi possível obter id_usuario do aluno criado."
  exit 1
fi
echo "Aluno criado com sucesso: ID $ID_ALUNO"

# GET /alunos (200)
STATUS_LISTA=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/alunos")
if [ "$STATUS_LISTA" != "200" ]; then
  echo "FALHA: GET /alunos retornou status $STATUS_LISTA"
  exit 1
fi

# GET /alunos/{id} (200)
STATUS_GET=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/alunos/$ID_ALUNO")
if [ "$STATUS_GET" != "200" ]; then
  echo "FALHA: GET /alunos/$ID_ALUNO retornou status $STATUS_GET"
  exit 1
fi

# PUT /alunos/{id} (200)
PAYLOAD_ATT=$(cat <<EOF
{
  "nome": "Aluno Teste Atualizado ${SUFIXO}"
}
EOF
)
STATUS_PUT=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/alunos/$ID_ALUNO" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_ATT")
if [ "$STATUS_PUT" != "200" ]; then
  echo "FALHA: PUT /alunos/$ID_ALUNO retornou status $STATUS_PUT"
  exit 1
fi

# DELETE /alunos/{id} (204)
STATUS_DEL=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/alunos/$ID_ALUNO")
if [ "$STATUS_DEL" != "204" ]; then
  echo "FALHA: DELETE /alunos/$ID_ALUNO retornou status $STATUS_DEL"
  exit 1
fi

# GET /alunos/{id} pós exclusão lógica (404)
STATUS_POS_DEL=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/alunos/$ID_ALUNO")
if [ "$STATUS_POS_DEL" != "404" ]; then
  echo "FALHA: GET pós exclusão retornou status $STATUS_POS_DEL, esperado 404"
  exit 1
fi
echo "CRUD de Aluno verificado com sucesso."

echo "=== 5. Testando CRUD completo de Empresa Parceira ==="
CNPJ_EMP=$(gerar_cnpj)
LOGIN_EMP="empresa_${SUFIXO}"
EMAIL_EMP="empresa_${SUFIXO}@teste.com"

PAYLOAD_EMP=$(cat <<EOF
{
  "nome": "Empresa Teste ${SUFIXO}",
  "email": "${EMAIL_EMP}",
  "cnpj": "${CNPJ_EMP}",
  "login": "${LOGIN_EMP}",
  "senha": "senhaValida123"
}
EOF
)

# POST /empresas (201)
RESPOSTA_EMP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/empresas" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_EMP")

STATUS_CRIAR_EMP=$(echo "$RESPOSTA_EMP" | tail -n1)
CORPO_EMP=$(echo "$RESPOSTA_EMP" | sed '$d')

if [ "$STATUS_CRIAR_EMP" != "201" ]; then
  echo "FALHA: POST /empresas retornou status $STATUS_CRIAR_EMP, esperado 201. Resposta: $CORPO_EMP"
  exit 1
fi

ID_EMP=$(echo "$CORPO_EMP" | grep -o '"id_usuario":[0-9]*' | cut -d: -f2)
if [ -z "$ID_EMP" ]; then
  echo "FALHA: Não foi possível obter id_usuario da empresa criada."
  exit 1
fi
echo "Empresa criada com sucesso: ID $ID_EMP"

# GET /empresas (200)
STATUS_LISTA_EMP=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/empresas")
if [ "$STATUS_LISTA_EMP" != "200" ]; then
  echo "FALHA: GET /empresas retornou status $STATUS_LISTA_EMP"
  exit 1
fi

# GET /empresas/{id} (200)
STATUS_GET_EMP=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/empresas/$ID_EMP")
if [ "$STATUS_GET_EMP" != "200" ]; then
  echo "FALHA: GET /empresas/$ID_EMP retornou status $STATUS_GET_EMP"
  exit 1
fi

# PUT /empresas/{id} (200)
STATUS_PUT_EMP=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/empresas/$ID_EMP" \
  -H "Content-Type: application/json" \
  -d "{\"nome\": \"Empresa Atualizada ${SUFIXO}\"}")
if [ "$STATUS_PUT_EMP" != "200" ]; then
  echo "FALHA: PUT /empresas/$ID_EMP retornou status $STATUS_PUT_EMP"
  exit 1
fi

# DELETE /empresas/{id} (204)
STATUS_DEL_EMP=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/empresas/$ID_EMP")
if [ "$STATUS_DEL_EMP" != "204" ]; then
  echo "FALHA: DELETE /empresas/$ID_EMP retornou status $STATUS_DEL_EMP"
  exit 1
fi

# GET /empresas/{id} pós exclusão (404)
STATUS_POS_DEL_EMP=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/empresas/$ID_EMP")
if [ "$STATUS_POS_DEL_EMP" != "404" ]; then
  echo "FALHA: GET pós exclusão de empresa retornou status $STATUS_POS_DEL_EMP, esperado 404"
  exit 1
fi
echo "CRUD de Empresa Parceira verificado com sucesso."

echo "=== 6. Testando disponibilidade do front-end ==="
STATUS_FRONT=$(curl -s -o /dev/null -w "%{http_code}" "$FRONT_URL" || true)
if [ "$STATUS_FRONT" != "200" ]; then
  echo "FALHA: Front-end em $FRONT_URL não retornou HTTP 200 (retornou $STATUS_FRONT)"
  exit 1
fi
echo "Front-end operacional em $FRONT_URL."

echo "=== Todos os testes e asserts passaram! ==="
echo "OK"
exit 0

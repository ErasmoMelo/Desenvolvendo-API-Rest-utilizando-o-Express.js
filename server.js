
const express = require('express');

const app = express();
const PORTA = 3000;

// Permite receber dados no formato JSON.
app.use(express.json());

// Dados iniciais armazenados em memória.
const alunos = [
  { id: 1, nome: 'Ana', curso: 'Computação' },
  { id: 2, nome: 'Pedro', curso: 'Sistemas de Informação' }
];

// Estratégia: utilizar um contador crescente para gerar IDs únicos.
let proximoId = 3;

// Valida se nome e curso foram informados corretamente.
function dadosValidos(nome, curso) {
  return (
    typeof nome === 'string' &&
    nome.trim().length > 0 &&
    typeof curso === 'string' &&
    curso.trim().length > 0
  );
}

// GET /alunos - Lista todos os alunos.
app.get('/alunos', (req, res) => {
  return res.status(200).json(alunos);
});

// GET /alunos/:id - Consulta um aluno pelo ID.
app.get('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);

  const aluno = alunos.find((aluno) => aluno.id === id);

  if (!aluno) {
    return res.status(404).json({
      mensagem: 'Aluno não encontrado.'
    });
  }

  return res.status(200).json(aluno);
});

// POST /alunos - Cadastra um novo aluno.
app.post('/alunos', (req, res) => {
  const { nome, curso } = req.body || {};

  if (!dadosValidos(nome, curso)) {
    return res.status(400).json({
      mensagem: 'Nome e curso são obrigatórios e devem ser válidos.'
    });
  }

  const novoAluno = {
    id: proximoId++,
    nome: nome.trim(),
    curso: curso.trim()
  };

  alunos.push(novoAluno);

  return res.status(201).json(novoAluno);
});

// PUT /alunos/:id - Atualiza um aluno existente.
app.put('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);

  const aluno = alunos.find((aluno) => aluno.id === id);

  if (!aluno) {
    return res.status(404).json({
      mensagem: 'Aluno não encontrado.'
    });
  }

  const { nome, curso } = req.body || {};

  if (!dadosValidos(nome, curso)) {
    return res.status(400).json({
      mensagem: 'Nome e curso são obrigatórios e devem ser válidos.'
    });
  }

  aluno.nome = nome.trim();
  aluno.curso = curso.trim();

  return res.status(200).json(aluno);
});

// DELETE /alunos/:id - Exclui um aluno.
app.delete('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);

  const indice = alunos.findIndex((aluno) => aluno.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensagem: 'Aluno não encontrado.'
    });
  }

  alunos.splice(indice, 1);

  // Resposta sem corpo, conforme o status HTTP 204.
  return res.status(204).end();
});

// Tratamento de JSON malformado.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      mensagem: 'O corpo da requisição contém um JSON inválido.'
    });
  }

  return next(err);
});

// Inicializa o servidor na porta 3000.
app.listen(PORTA, () => {
  console.log(`API de alunos executando em http://localhost:${PORTA}`);
});

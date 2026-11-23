const el = {
  form: document.querySelector('#form-matricula'),
  selectAluno: document.querySelector('#mat-aluno'),
  salvar: document.querySelector('#mat-salvar'),
  cancelar: document.querySelector('#mat-cancelar'),
  carregando: document.querySelector('#matriculas-carregando'),
  erro: document.querySelector('#matriculas-erro'),
  erroMsg: document.querySelector('#matriculas-erro-msg'),
  recarregar: document.querySelector('#matriculas-recarregar'),
  vazio: document.querySelector('#matriculas-vazio'),
  sucesso: document.querySelector('#matriculas-sucesso'),
  linhas: document.querySelector('#matriculas-linhas'),
};

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto;
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function linha(matricula, editandoId, alunos) {
  const tr = document.createElement('tr');
  if (matricula.id === editandoId) tr.className = 'editando';

  const aluno = alunos.find((a) => a.id === matricula.alunoId);
  const nomeAluno = aluno ? aluno.nome : `Aluno #${matricula.alunoId}`;

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', matricula.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', matricula.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(matricula.id),
    celula(nomeAluno),
    celula(matricula.plano),
    celula(formatarMoeda(matricula.valor), 'numero text-nowrap'),
    celula(matricula.status),
    acoes,
  );
  return tr;
}

export const matriculaView = {
  render({ status, matriculas, erro, editandoId, salvando }, alunos = []) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...matriculas.map((m) => linha(m, editandoId, alunos)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar matrícula';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherAlunos(alunos) {
    const selecionado = el.selectAluno.value;
    const padrao = document.createElement('option');
    padrao.value = '';
    padrao.textContent = 'Selecione um aluno…';

    const opcoes = alunos.map((a) => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = `${a.nome} (#${a.id})`;
      return opt;
    });

    el.selectAluno.replaceChildren(padrao, ...opcoes);
    el.selectAluno.value = selecionado;
  },

  preencherForm(matricula) {
    el.form.alunoId.value = matricula.alunoId;
    el.form.plano.value = matricula.plano;
    el.form.valor.value = matricula.valor;
    el.form.status.value = matricula.status;
    el.form.alunoId.focus();
  },

  limparForm() {
    el.form.reset();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { matriculaService } from './services/matriculaService.js';
import { matriculaView } from './ui/matriculaView.js';
import { criarStore } from './state/store.js';
import { alunoService } from './services/alunoService.js';
import { alunoView } from './ui/alunoView.js';
import { aviso } from './ui/aviso.js';

// ===================== ALUNOS =====================
const alunosStore = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  alunos: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Toda vez que o estado mudar, a view redesenha.
alunosStore.assinar(alunoView.render);

async function carregarAlunos() {
  alunosStore.set({ status: 'carregando', erro: null });
  try {
    const lista = await alunoService.listar();
    alunosStore.set({ status: lista.length ? 'sucesso' : 'vazio', alunos: lista });
  } catch (e) {
    alunosStore.set({ status: 'erro', erro: e.message });
  }
}

async function salvarAluno(dados) {
  const { editandoId } = alunosStore.get();
  aviso.limpar();
  alunosStore.set({ salvando: true });
  try {
    if (editandoId) await alunoService.atualizar(editandoId, dados);
    else await alunoService.criar(dados);

    aviso.sucesso(editandoId ? 'Aluno atualizado.' : 'Aluno cadastrado.');
    alunoView.limparForm();
    alunosStore.set({ editandoId: null });
    await carregarAlunos();
  } catch (e) {
    aviso.erro(e.message); // o formulário fica como está, para corrigir
  } finally {
    alunosStore.set({ salvando: false });
  }
}

function editarAluno(id) {
  const aluno = alunosStore.get().alunos.find((a) => a.id === id);
  alunoView.preencherForm(aluno);
  alunosStore.set({ editandoId: id });
}

function cancelarEdicaoAluno() {
  alunoView.limparForm();
  alunosStore.set({ editandoId: null });
}

async function removerAluno(id) {
  if (!confirm(`Remover o aluno #${id}?`)) return;
  aviso.limpar();
  try {
    await alunoService.remover(id);
    aviso.sucesso('Aluno removido.');
    if (alunosStore.get().editandoId === id) cancelarEdicaoAluno();
    await carregarAlunos();
  } catch (e) {
    aviso.erro(e.message);
  }
}

alunoView.aoEnviar(salvarAluno);
alunoView.aoCancelar(cancelarEdicaoAluno);
alunoView.aoRecarregar(carregarAlunos);
alunoView.aoClicarNaLista({ editar: editarAluno, remover: removerAluno });

// ===================== MATRÍCULAS =====================
const matriculasStore = criarStore({
  status: 'carregando',
  matriculas: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

matriculasStore.assinar((estado) => {
  matriculaView.render(estado, alunosStore.get().alunos);
});

// Religa o <select> e redesenha a tabela de matrículas quando a lista de alunos muda
alunosStore.assinar(({ alunos }) => {
  matriculaView.preencherAlunos(alunos);
  matriculaView.render(matriculasStore.get(), alunos);
});

async function carregarMatriculas() {
  matriculasStore.set({ status: 'carregando', erro: null });
  try {
    const lista = await matriculaService.listar();
    matriculasStore.set({ status: lista.length ? 'sucesso' : 'vazio', matriculas: lista });
  } catch (e) {
    matriculasStore.set({ status: 'erro', erro: e.message });
  }
}

async function salvarMatricula(dados) {
  const { editandoId } = matriculasStore.get();
  aviso.limpar();
  matriculasStore.set({ salvando: true });
  try {
    if (editandoId) await matriculaService.atualizar(editandoId, dados);
    else await matriculaService.criar(dados);

    aviso.sucesso(editandoId ? 'Matrícula atualizada.' : 'Matrícula cadastrada.');
    matriculaView.limparForm();
    matriculasStore.set({ editandoId: null });
    await carregarMatriculas();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    matriculasStore.set({ salvando: false });
  }
}

function editarMatricula(id) {
  const matricula = matriculasStore.get().matriculas.find((m) => m.id === id);
  matriculaView.preencherForm(matricula);
  matriculasStore.set({ editandoId: id });
}

function cancelarEdicaoMatricula() {
  matriculaView.limparForm();
  matriculasStore.set({ editandoId: null });
}

async function removerMatricula(id) {
  if (!confirm(`Remover a matrícula #${id}?`)) return;
  aviso.limpar();
  try {
    await matriculaService.remover(id);
    aviso.sucesso('Matrícula removida.');
    if (matriculasStore.get().editandoId === id) cancelarEdicaoMatricula();
    await carregarMatriculas();
  } catch (e) {
    aviso.erro(e.message);
  }
}

matriculaView.aoEnviar(salvarMatricula);
matriculaView.aoCancelar(cancelarEdicaoMatricula);
matriculaView.aoRecarregar(carregarMatriculas);
matriculaView.aoClicarNaLista({ editar: editarMatricula, remover: removerMatricula });

// ===================== INÍCIO =====================
carregarAlunos();
carregarMatriculas();